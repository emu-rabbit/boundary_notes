import type { SecretFileScope } from '../secret-file';
import { isCloudShareId } from './cloudShareId';

const cloudSharesKey = 'bdsm-boundary-test-cloud-shares:v2';
const legacyCloudShareIdsKey = 'bdsm-boundary-test-cloud-share-ids:v1';
const authorExampleHiddenKey = 'bdsm-boundary-test-author-example-cloud-file:hidden';
export const maxLinkedCloudShares = 50;
export const authorExampleCloudShareId = 'sf_d82MBFoxZq81Gv4Jcp4Zjm56';

export interface KeyValueStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface LinkedCloudShare {
  createdAt: string | null;
  profileName: string | null;
  scope: SecretFileScope | null;
  shareId: string;
  sourceContentFingerprint: string | null;
}

export interface CloudFileListItem extends LinkedCloudShare {
  isAuthorExample: boolean;
}

const authorExampleCloudShare: LinkedCloudShare = {
  createdAt: null,
  profileName: null,
  scope: null,
  shareId: authorExampleCloudShareId,
  sourceContentFingerprint: null,
};

export class CloudShareLinkStorageError extends Error {
  constructor() {
    super('The linked cloud-file metadata could not be saved locally.');
    this.name = 'CloudShareLinkStorageError';
  }
}

function resolveBrowserStorage(): KeyValueStorage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSecretFileScope(value: unknown): value is SecretFileScope {
  return value === 'activeOnly' || value === 'passiveOnly' || value === 'all';
}

function parseStoredShare(value: unknown): LinkedCloudShare {
  if (
    !isRecord(value)
    || typeof value.shareId !== 'string'
    || !isCloudShareId(value.shareId)
    || !(value.createdAt === null || (
      typeof value.createdAt === 'string'
      && !Number.isNaN(Date.parse(value.createdAt))
    ))
    || !(value.profileName === null || (
      typeof value.profileName === 'string'
      && value.profileName.trim().length > 0
      && Array.from(value.profileName).length <= 32
      && !/[\u0000-\u001F\u007F]/.test(value.profileName)
    ))
    || !(value.scope === null || isSecretFileScope(value.scope))
    || !(value.sourceContentFingerprint === undefined || value.sourceContentFingerprint === null || (
      typeof value.sourceContentFingerprint === 'string'
      && /^sha256:[a-f0-9]{64}$/u.test(value.sourceContentFingerprint)
    ))
  ) {
    throw new Error('The linked cloud-file metadata is invalid.');
  }

  return {
    createdAt: value.createdAt,
    profileName: value.profileName,
    scope: value.scope,
    shareId: value.shareId,
    sourceContentFingerprint: typeof value.sourceContentFingerprint === 'string'
      ? value.sourceContentFingerprint
      : null,
  };
}

function parseStoredShares(value: string | null): LinkedCloudShare[] {
  if (value === null) return [];

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error('The linked cloud-file metadata index is invalid.');
  }

  const shares = parsed.map(parseStoredShare);
  return shares
    .filter((share, index) => shares.findIndex((candidate) => candidate.shareId === share.shareId) === index)
    .slice(0, maxLinkedCloudShares);
}

function parseLegacyShareIds(value: string | null): LinkedCloudShare[] {
  if (!value) return [];

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed) || parsed.some((shareId) => typeof shareId !== 'string')) {
    throw new Error('The legacy linked cloud-file index is invalid.');
  }

  return [...new Set(parsed.filter(isCloudShareId))]
    .slice(0, maxLinkedCloudShares)
    .map((shareId) => ({
      createdAt: null,
      profileName: null,
      scope: null,
      shareId,
      sourceContentFingerprint: null,
    }));
}

export class CloudShareLinkRepository {
  private shares: LinkedCloudShare[] = [];
  private hasLoaded = false;

  constructor(private storage: KeyValueStorage | null = resolveBrowserStorage()) {}

  add(share: LinkedCloudShare): LinkedCloudShare[] {
    const validatedShare = parseStoredShare(share);
    this.ensureLoaded();
    const existingShare = this.shares.find(
      (existing) => existing.shareId === validatedShare.shareId,
    );
    const mergedShare = {
      ...validatedShare,
      sourceContentFingerprint: validatedShare.sourceContentFingerprint
        ?? existingShare?.sourceContentFingerprint
        ?? null,
    };
    const nextShares = [
      mergedShare,
      ...this.shares.filter((existing) => existing.shareId !== mergedShare.shareId),
    ].slice(0, maxLinkedCloudShares);

    this.persist(nextShares);
    this.shares = nextShares;
    return this.list();
  }

  list(): LinkedCloudShare[] {
    this.ensureLoaded();
    return this.shares.map((share) => ({ ...share }));
  }

  isAuthorExampleHidden(): boolean {
    if (!this.storage) return false;

    try {
      return this.storage.getItem(authorExampleHiddenKey) === 'true';
    } catch {
      return false;
    }
  }

  hideAuthorExample(): void {
    if (!this.storage) {
      throw new CloudShareLinkStorageError();
    }

    try {
      this.storage.setItem(authorExampleHiddenKey, 'true');
    } catch {
      throw new CloudShareLinkStorageError();
    }
  }

  remove(shareId: string): LinkedCloudShare[] {
    this.ensureLoaded();
    const nextShares = this.shares.filter((existing) => existing.shareId !== shareId);

    this.persist(nextShares);
    this.shares = nextShares;
    return this.list();
  }

  private ensureLoaded(): void {
    if (this.hasLoaded) return;
    this.hasLoaded = true;

    if (!this.storage) return;

    let currentValue: string | null;

    try {
      currentValue = this.storage.getItem(cloudSharesKey);
    } catch {
      this.storage = null;
      return;
    }

    if (currentValue !== null) {
      try {
        this.shares = parseStoredShares(currentValue);
      } catch {
        this.shares = [];
      }
      return;
    }

    try {
      this.shares = parseLegacyShareIds(this.storage.getItem(legacyCloudShareIdsKey));
    } catch {
      this.shares = [];
    }
  }

  private persist(shares: LinkedCloudShare[]): void {
    if (!this.storage) {
      throw new CloudShareLinkStorageError();
    }

    try {
      this.storage.setItem(cloudSharesKey, JSON.stringify(shares));
    } catch {
      throw new CloudShareLinkStorageError();
    }

    try {
      this.storage.removeItem(legacyCloudShareIdsKey);
    } catch {
      // The v2 index is already authoritative, so a stale legacy key is harmless.
    }
  }
}

const cloudShareLinkRepository = new CloudShareLinkRepository();

export function linkCloudShare(share: LinkedCloudShare): LinkedCloudShare[] {
  return cloudShareLinkRepository.add(share);
}

export function listLinkedCloudShares(): LinkedCloudShare[] {
  return cloudShareLinkRepository.list();
}

export function listCloudFiles(): CloudFileListItem[] {
  const linkedShares = listLinkedCloudShares()
    .filter((share) => share.shareId !== authorExampleCloudShareId)
    .map((share) => ({ ...share, isAuthorExample: false }));

  if (cloudShareLinkRepository.isAuthorExampleHidden()) {
    return linkedShares;
  }

  return [{ ...authorExampleCloudShare, isAuthorExample: true }, ...linkedShares];
}

export function isAuthorExampleCloudFile(shareId: string): boolean {
  return shareId === authorExampleCloudShareId;
}

export function hideAuthorExampleCloudFile(): void {
  cloudShareLinkRepository.hideAuthorExample();
}

export function findLinkedCloudShareByContentFingerprint(
  sourceContentFingerprint: string,
): LinkedCloudShare | null {
  return listLinkedCloudShares()
    .find((share) => share.sourceContentFingerprint === sourceContentFingerprint) ?? null;
}

export function unlinkCloudShare(shareId: string): LinkedCloudShare[] {
  return cloudShareLinkRepository.remove(shareId);
}
