import type { SecretFile, SecretFileAnswer, SecretFileScope } from '../domain/types';
import { parseSecretFile } from '../validation/secretFileSchema';

const indexKey = 'bdsm-boundary-test-secret-files:index';
const fileKeyPrefix = 'bdsm-boundary-test-secret-files:file:';
export const maxLocalSecretFiles = 20;

export class LocalSecretFileLimitError extends Error {
  constructor() {
    super(`這台裝置最多只能保存 ${maxLocalSecretFiles} 份秘密檔案。`);
    this.name = 'LocalSecretFileLimitError';
  }
}

export interface KeyValueStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface SecretFileSummary {
  answered: number;
  createdAt: string;
  fileId: string;
  profileName: string;
  scope: SecretFileScope;
  total: number;
  updatedAt: string;
}

export type SecretFileStorageStatus =
  | { mode: 'persistent' }
  | {
      mode: 'memory';
      reason: 'readFailed' | 'unavailable' | 'writeFailed';
    };

function resolveBrowserStorage(): KeyValueStorage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function cloneSecretFile(secretFile: SecretFile): SecretFile {
  return JSON.parse(JSON.stringify(secretFile)) as SecretFile;
}

function getFileKey(fileId: string): string {
  return `${fileKeyPrefix}${fileId}`;
}

function getSummary(secretFile: SecretFile): SecretFileSummary {
  const answers = Object.values(secretFile.answers).filter(
    (answer: SecretFileAnswer) => answer.state !== 'filteredOut',
  );

  return {
    answered: answers.filter((answer) => answer.state === 'answered').length,
    createdAt: secretFile.createdAt,
    fileId: secretFile.fileId,
    profileName: secretFile.profileName,
    scope: secretFile.scope,
    total: answers.length,
    updatedAt: secretFile.updatedAt,
  };
}

function parseIndex(value: string): string[] {
  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed) || parsed.some((fileId) => typeof fileId !== 'string')) {
    throw new Error('The local secret-file index is invalid.');
  }

  return [...new Set(parsed)];
}

export class BrowserSecretFileRepository {
  private files = new Map<string, SecretFile>();
  private hasLoaded = false;
  private status: SecretFileStorageStatus;

  constructor(private storage: KeyValueStorage | null = resolveBrowserStorage()) {
    this.status = storage ? { mode: 'persistent' } : { mode: 'memory', reason: 'unavailable' };
  }

  delete(fileId: string): void {
    this.ensureLoaded();
    this.files.delete(fileId);

    if (!this.storage) {
      return;
    }

    try {
      this.storage.removeItem(getFileKey(fileId));
      this.storage.setItem(indexKey, JSON.stringify([...this.files.keys()]));
    } catch {
      this.useMemoryFallback('writeFailed');
    }
  }

  getStatus(): SecretFileStorageStatus {
    return { ...this.status };
  }

  list(): SecretFileSummary[] {
    this.ensureLoaded();

    return [...this.files.values()]
      .map(getSummary)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  read(fileId: string): SecretFile | null {
    this.ensureLoaded();
    const secretFile = this.files.get(fileId);

    return secretFile ? cloneSecretFile(secretFile) : null;
  }

  save(secretFile: SecretFile): SecretFile {
    this.ensureLoaded();
    const validatedSecretFile = parseSecretFile(secretFile);

    if (
      !this.files.has(validatedSecretFile.fileId) &&
      this.files.size >= maxLocalSecretFiles
    ) {
      throw new LocalSecretFileLimitError();
    }

    this.files.set(validatedSecretFile.fileId, cloneSecretFile(validatedSecretFile));

    if (this.storage) {
      try {
        this.storage.setItem(getFileKey(validatedSecretFile.fileId), JSON.stringify(validatedSecretFile));
        this.storage.setItem(indexKey, JSON.stringify([...this.files.keys()]));
      } catch {
        this.useMemoryFallback('writeFailed');
      }
    }

    return cloneSecretFile(validatedSecretFile);
  }

  private ensureLoaded(): void {
    if (this.hasLoaded) {
      return;
    }

    this.hasLoaded = true;

    if (!this.storage) {
      return;
    }

    try {
      const rawIndex = this.storage.getItem(indexKey);
      const migratedFiles: SecretFile[] = [];

      if (!rawIndex) {
        return;
      }

      for (const fileId of parseIndex(rawIndex)) {
        const rawSecretFile = this.storage.getItem(getFileKey(fileId));

        if (!rawSecretFile) {
          throw new Error(`The local secret file ${fileId} is missing.`);
        }

        const storedSecretFile: unknown = JSON.parse(rawSecretFile);
        const secretFile = parseSecretFile(storedSecretFile);
        this.files.set(secretFile.fileId, secretFile);

        if (
          typeof storedSecretFile === 'object' &&
          storedSecretFile !== null &&
          'schemaVersion' in storedSecretFile &&
          storedSecretFile.schemaVersion === 1
        ) {
          migratedFiles.push(secretFile);
        }
      }

      try {
        for (const secretFile of migratedFiles) {
          this.storage.setItem(getFileKey(secretFile.fileId), JSON.stringify(secretFile));
        }
      } catch {
        this.useMemoryFallback('writeFailed');
      }
    } catch {
      this.files.clear();
      this.useMemoryFallback('readFailed');
    }
  }

  private useMemoryFallback(reason: Extract<SecretFileStorageStatus, { mode: 'memory' }>['reason']): void {
    this.storage = null;
    this.status = { mode: 'memory', reason };
  }
}
