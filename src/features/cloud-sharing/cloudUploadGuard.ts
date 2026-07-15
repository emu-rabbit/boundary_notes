import type { AppLocale } from '../../app/i18n';
import type { SecretFile } from '../secret-file';
import { parseSecretFile } from '../secret-file/validation/secretFileSchema';
import type { KeyValueStorage } from './cloudShareLinkRepository';

const cloudUploadGuardKey = 'bdsm-boundary-test-cloud-upload-guard:v1';
const hourlyWindowMs = 60 * 60 * 1000;
const dailyWindowMs = 24 * 60 * 60 * 1000;
const hourlyLimit = 5;
const dailyLimit = 10;

export type CloudUploadBlockScope = 'site' | 'source';
export type CloudUploadRetryWindow = 'day' | 'hour';

export interface CloudUploadBlock {
  retryAt: number;
  scope: CloudUploadBlockScope;
  window: CloudUploadRetryWindow;
}

interface CloudUploadGuardState {
  serverBlocks: Partial<Record<CloudUploadBlockScope, Omit<CloudUploadBlock, 'scope'>>>;
  successfulUploadTimes: number[];
  version: 1;
}

function createEmptyState(): CloudUploadGuardState {
  return { serverBlocks: {}, successfulUploadTimes: [], version: 1 };
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

function parseServerBlock(value: unknown): Omit<CloudUploadBlock, 'scope'> | null {
  if (
    !isRecord(value)
    || typeof value.retryAt !== 'number'
    || !Number.isFinite(value.retryAt)
    || (value.window !== 'day' && value.window !== 'hour')
  ) {
    return null;
  }

  return { retryAt: value.retryAt, window: value.window };
}

function parseState(value: string | null): CloudUploadGuardState {
  if (value === null) return createEmptyState();

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      !isRecord(parsed)
      || parsed.version !== 1
      || !Array.isArray(parsed.successfulUploadTimes)
      || parsed.successfulUploadTimes.some(
        (entry) => typeof entry !== 'number' || !Number.isFinite(entry),
      )
      || !isRecord(parsed.serverBlocks)
    ) {
      return createEmptyState();
    }

    const sourceBlock = parseServerBlock(parsed.serverBlocks.source);
    const siteBlock = parseServerBlock(parsed.serverBlocks.site);

    return {
      serverBlocks: {
        ...(sourceBlock ? { source: sourceBlock } : {}),
        ...(siteBlock ? { site: siteBlock } : {}),
      },
      successfulUploadTimes: parsed.successfulUploadTimes,
      version: 1,
    };
  } catch {
    return createEmptyState();
  }
}

function getLocalRateLimitBlock(
  successfulUploadTimes: readonly number[],
  now: number,
): CloudUploadBlock | null {
  const dailyUploads = successfulUploadTimes
    .filter((time) => time >= now - dailyWindowMs)
    .sort((left, right) => left - right);
  const hourlyUploads = dailyUploads.filter((time) => time >= now - hourlyWindowMs);
  const candidates: CloudUploadBlock[] = [];

  if (hourlyUploads.length >= hourlyLimit) {
    const retryAt = (hourlyUploads[0] ?? now) + hourlyWindowMs;

    if (retryAt > now) {
      candidates.push({ retryAt, scope: 'source', window: 'hour' });
    }
  }

  if (dailyUploads.length >= dailyLimit) {
    const retryAt = (dailyUploads[0] ?? now) + dailyWindowMs;

    if (retryAt > now) {
      candidates.push({ retryAt, scope: 'source', window: 'day' });
    }
  }

  return candidates.sort((left, right) => right.retryAt - left.retryAt)[0] ?? null;
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`;
  }

  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

export function createCloudUploadContentKey(secretFile: SecretFile): string {
  const validated = parseSecretFile(secretFile);

  return stableSerialize({
    answers: validated.answers,
    fileId: validated.fileId,
    profileName: validated.profileName,
    questionBank: validated.questionBank,
    scope: validated.scope,
    spotlight: validated.spotlight,
  });
}

export function formatApproximateCloudUploadWait(
  locale: AppLocale,
  remainingMs: number,
  retryWindow: CloudUploadRetryWindow,
): string {
  if (retryWindow === 'day') {
    const hours = Math.max(1, Math.ceil(remainingMs / hourlyWindowMs));

    if (locale === 'ja') return `${hours}時間`;
    if (locale === 'en') return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    if (locale === 'zh-Hans') return `${hours} 小时`;
    return `${hours} 小時`;
  }

  const minutes = Math.max(10, Math.ceil(remainingMs / (10 * 60 * 1000)) * 10);

  if (locale === 'ja') return `${minutes}分`;
  if (locale === 'en') return `${minutes} minutes`;
  if (locale === 'zh-Hans') return `${minutes} 分钟`;
  return `${minutes} 分鐘`;
}

export class CloudUploadGuard {
  private memoryState = createEmptyState();

  constructor(
    private storage: KeyValueStorage | null = resolveBrowserStorage(),
    private readonly getNow: () => number = Date.now,
  ) {}

  getBlock(): CloudUploadBlock | null {
    const now = this.getNow();
    const state = this.readState();
    const candidates = [getLocalRateLimitBlock(state.successfulUploadTimes, now)];

    for (const scope of ['source', 'site'] as const) {
      const serverBlock = state.serverBlocks[scope];

      if (serverBlock && serverBlock.retryAt > now) {
        candidates.push({ ...serverBlock, scope });
      }
    }

    return candidates
      .filter((block): block is CloudUploadBlock => block !== null)
      .sort((left, right) => right.retryAt - left.retryAt)[0] ?? null;
  }

  recordServerBlock(
    scope: CloudUploadBlockScope,
    retryAfterSeconds: number,
    retryWindow: CloudUploadRetryWindow,
  ): CloudUploadBlock {
    const state = this.readState();
    const block = {
      retryAt: this.getNow() + Math.max(1, Math.ceil(retryAfterSeconds)) * 1000,
      scope,
      window: retryWindow,
    } satisfies CloudUploadBlock;

    state.serverBlocks[scope] = { retryAt: block.retryAt, window: block.window };
    this.persistState(state);
    return block;
  }

  recordSuccessfulUpload(createdAt: string): void {
    const createdAtMs = Date.parse(createdAt);

    if (Number.isNaN(createdAtMs)) return;

    const now = this.getNow();
    const state = this.readState();
    state.successfulUploadTimes = [...state.successfulUploadTimes, createdAtMs]
      .filter((time) => time >= now - dailyWindowMs)
      .sort((left, right) => left - right)
      .slice(-dailyLimit);
    state.serverBlocks = {};
    this.persistState(state);
  }

  private readState(): CloudUploadGuardState {
    if (!this.storage) return this.memoryState;

    try {
      const state = parseState(this.storage.getItem(cloudUploadGuardKey));
      this.memoryState = state;
      return state;
    } catch {
      this.storage = null;
      return this.memoryState;
    }
  }

  private persistState(state: CloudUploadGuardState): void {
    this.memoryState = state;

    if (!this.storage) return;

    try {
      this.storage.setItem(cloudUploadGuardKey, JSON.stringify(state));
    } catch {
      this.storage = null;
    }
  }
}

export const cloudUploadGuard = new CloudUploadGuard();
