import { describe, expect, it } from 'vitest';
import type { AppLocale } from '../../app/i18n';
import type { SecretFile } from '../secret-file';
import type { KeyValueStorage } from './cloudShareLinkRepository';
import {
  CloudUploadGuard,
  createCloudUploadContentFingerprint,
  createCloudUploadContentKey,
  formatApproximateCloudUploadWait,
} from './cloudUploadGuard';

class MemoryStorage implements KeyValueStorage {
  values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

function createSecretFile(updatedAt = '2026-07-15T00:01:00.000Z'): SecretFile {
  return {
    answers: {
      'category.impactSpanking.active': {
        experience: 'some',
        note: '',
        preference: 'like',
        state: 'answered',
      },
      'category.impactSpanking.passive': { state: 'filteredOut' },
    },
    createdAt: '2026-07-15T00:00:00.000Z',
    fileId: 'local_12345678',
    profileName: '兔子',
    questionBank: { bankVersion: '2026-07-11', schemaVersion: 2 },
    schemaVersion: 2,
    scope: 'activeOnly',
    spotlight: {
      active: { selectedQuestionIds: ['category.impactSpanking.active'] },
      passive: { selectedQuestionIds: [] },
    },
    updatedAt,
  };
}

describe('CloudUploadGuard', () => {
  it('blocks the sixth locally recorded upload in the rolling hour', () => {
    let now = Date.parse('2026-07-15T01:00:00.000Z');
    const guard = new CloudUploadGuard(new MemoryStorage(), () => now);

    for (let index = 0; index < 5; index += 1) {
      guard.recordSuccessfulUpload(new Date(now - index * 60_000).toISOString());
    }

    expect(guard.getBlock()).toEqual({
      retryAt: Date.parse('2026-07-15T01:56:00.000Z'),
      scope: 'source',
      window: 'hour',
    });

    now = Date.parse('2026-07-15T01:56:00.000Z');
    expect(guard.getBlock()).toBeNull();
  });

  it('uses the daily window after ten locally recorded uploads', () => {
    const now = Date.parse('2026-07-15T23:00:00.000Z');
    const guard = new CloudUploadGuard(new MemoryStorage(), () => now);

    for (let index = 0; index < 10; index += 1) {
      guard.recordSuccessfulUpload(new Date(now - (index + 2) * 60 * 60 * 1000).toISOString());
    }

    expect(guard.getBlock()).toMatchObject({ scope: 'source', window: 'day' });
  });

  it('persists a server cooldown and falls back to memory when storage fails', () => {
    const storage = new MemoryStorage();
    const now = Date.parse('2026-07-15T00:00:00.000Z');
    const guard = new CloudUploadGuard(storage, () => now);
    storage.setItem = () => { throw new Error('quota exceeded'); };

    const block = guard.recordServerBlock('site', 3599, 'hour');
    expect(guard.getBlock()).toEqual(block);
  });
});

describe('formatApproximateCloudUploadWait', () => {
  it.each<[AppLocale, string]>([
    ['zh-Hant', '6 小時'],
    ['zh-Hans', '6 小时'],
    ['ja', '6時間'],
    ['en', '6 hours'],
  ])('rounds a daily retry up to whole hours for %s', (locale, expected) => {
    expect(formatApproximateCloudUploadWait(locale, 5.72 * 60 * 60 * 1000, 'day')).toBe(expected);
  });

  it.each<[AppLocale, string]>([
    ['zh-Hant', '40 分鐘'],
    ['zh-Hans', '40 分钟'],
    ['ja', '40分'],
    ['en', '40 minutes'],
  ])('rounds an hourly retry up to ten-minute steps for %s', (locale, expected) => {
    expect(formatApproximateCloudUploadWait(locale, 33 * 60 * 1000, 'hour')).toBe(expected);
  });
});

describe('createCloudUploadContentKey', () => {
  it('ignores timestamps but changes when shareable content changes', () => {
    const original = createSecretFile();
    const timestampOnlyChange = createSecretFile('2026-07-15T02:00:00.000Z');
    const contentChange = {
      ...timestampOnlyChange,
      profileName: '月兔',
    };

    expect(createCloudUploadContentKey(timestampOnlyChange)).toBe(
      createCloudUploadContentKey(original),
    );
    expect(createCloudUploadContentKey(contentChange)).not.toBe(
      createCloudUploadContentKey(original),
    );
  });

  it('creates the same persistent fingerprint for the same shareable version', async () => {
    const original = createSecretFile();
    const timestampOnlyChange = createSecretFile('2026-07-15T02:00:00.000Z');
    const contentChange = { ...timestampOnlyChange, profileName: '月兔' };

    await expect(createCloudUploadContentFingerprint(timestampOnlyChange)).resolves.toBe(
      await createCloudUploadContentFingerprint(original),
    );
    await expect(createCloudUploadContentFingerprint(contentChange)).resolves.not.toBe(
      await createCloudUploadContentFingerprint(original),
    );
  });
});
