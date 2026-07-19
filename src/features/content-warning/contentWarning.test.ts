import { describe, expect, it } from 'vitest';
import {
  contentWarningDurationMs,
  contentWarningStorageKey,
  hasRecentContentWarningConfirmation,
  resolveContentWarningLocale,
} from './contentWarning';

function createStorage(values: Record<string, string> = {}): Storage {
  const entries = new Map(Object.entries(values));

  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => [...entries.keys()][index] ?? null,
    removeItem: (key) => entries.delete(key),
    setItem: (key, value) => entries.set(key, value),
  };
}

describe('content warning confirmation', () => {
  const now = 1_750_000_000_000;

  it('keeps a confirmation for one week', () => {
    const storage = createStorage({
      [contentWarningStorageKey]: String(now - contentWarningDurationMs + 1),
    });

    expect(hasRecentContentWarningConfirmation(now, storage)).toBe(true);
  });

  it('shows the notice again after one week or for an invalid value', () => {
    expect(hasRecentContentWarningConfirmation(now, createStorage({
      [contentWarningStorageKey]: String(now - contentWarningDurationMs),
    }))).toBe(false);
    expect(hasRecentContentWarningConfirmation(now, createStorage({
      [contentWarningStorageKey]: 'not-a-timestamp',
    }))).toBe(false);
  });

  it('uses Traditional Chinese when neither the URL nor local storage identifies a locale', () => {
    expect(resolveContentWarningLocale('en', null, null)).toBe('zh-Hant');
    expect(resolveContentWarningLocale('ja', 'ja', null)).toBe('ja');
    expect(resolveContentWarningLocale('zh-Hans', null, 'zh-Hans')).toBe('zh-Hans');
  });
});
