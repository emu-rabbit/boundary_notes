import { describe, expect, it } from 'vitest';
import { createSecretFile } from '../domain/secretFile';
import type { QuestionDefinition } from '../domain/types';
import {
  BrowserSecretFileRepository,
  LocalSecretFileLimitError,
  maxLocalSecretFiles,
  type KeyValueStorage,
} from './browserSecretFileRepository';

const questions: readonly QuestionDefinition[] = [
  { id: 'detail.impact.hand.active', level: 'detail', role: 'active' },
];

function createTestSecretFile() {
  return createSecretFile({
    bankSchemaVersion: 1,
    bankVersion: '2026-07-08',
    createdAt: '2026-07-10T06:00:00.000Z',
    fileId: 'local_test-file-1234',
    profileName: '兔子',
    questions,
    scope: 'all',
  });
}

function createMemoryStorage(): KeyValueStorage {
  const values = new Map<string, string>();

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

describe('BrowserSecretFileRepository', () => {
  it('keeps a validated file and index in browser storage', () => {
    const storage = createMemoryStorage();
    const repository = new BrowserSecretFileRepository(storage);
    const secretFile = createTestSecretFile();

    repository.save(secretFile);

    expect(repository.read(secretFile.fileId)).toEqual(secretFile);
    expect(repository.list()).toMatchObject([
      { answered: 0, fileId: secretFile.fileId, total: 1 },
    ]);
    expect(repository.getStatus()).toEqual({ mode: 'persistent' });
  });

  it('rewrites legacy spotlight storage after splitting it by direction', () => {
    const storage = createMemoryStorage();
    const current = createTestSecretFile();
    const legacy = {
      ...current,
      schemaVersion: 1,
      spotlight: {
        selectedQuestionIds: [
          'detail.impact.hand.active',
          'detail.impact.hand.passive',
        ],
      },
    };
    storage.setItem('bdsm-boundary-test-secret-files:index', JSON.stringify([current.fileId]));
    storage.setItem(
      `bdsm-boundary-test-secret-files:file:${current.fileId}`,
      JSON.stringify(legacy),
    );

    const repository = new BrowserSecretFileRepository(storage);
    const migrated = repository.read(current.fileId);
    const rewritten = JSON.parse(
      storage.getItem(`bdsm-boundary-test-secret-files:file:${current.fileId}`) ?? '{}',
    );

    expect(migrated?.schemaVersion).toBe(2);
    expect(migrated?.spotlight).toEqual({
      active: { selectedQuestionIds: ['detail.impact.hand.active'] },
      passive: { selectedQuestionIds: ['detail.impact.hand.passive'] },
    });
    expect(rewritten).toEqual(migrated);
  });

  it('keeps the active session in memory when browser storage writes fail', () => {
    const failingStorage: KeyValueStorage = {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error('Quota exceeded');
      },
    };
    const repository = new BrowserSecretFileRepository(failingStorage);
    const secretFile = createTestSecretFile();

    repository.save(secretFile);

    expect(repository.read(secretFile.fileId)).toEqual(secretFile);
    expect(repository.getStatus()).toEqual({ mode: 'memory', reason: 'writeFailed' });
  });

  it('blocks a new file after the confirmed local limit but still permits updates', () => {
    const repository = new BrowserSecretFileRepository(createMemoryStorage());

    for (let index = 0; index < maxLocalSecretFiles; index += 1) {
      repository.save({
        ...createTestSecretFile(),
        fileId: `local_test-file-${String(index).padStart(4, '0')}`,
      });
    }

    const firstFile = repository.read('local_test-file-0000');
    expect(firstFile).not.toBeNull();
    expect(() => repository.save(firstFile!)).not.toThrow();
    expect(() =>
      repository.save({
        ...createTestSecretFile(),
        fileId: 'local_test-file-over-limit',
      }),
    ).toThrow(LocalSecretFileLimitError);
  });
});
