import type { AppLocale } from '../../app/i18n';

export const contentWarningStorageKey = 'boundary-notes-content-warning-confirmed-at';
export const contentWarningDurationMs = 7 * 24 * 60 * 60 * 1000;

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function hasRecentContentWarningConfirmation(
  now = Date.now(),
  storage: Storage | null = getStorage(),
): boolean {
  try {
    const confirmedAt = Number(storage?.getItem(contentWarningStorageKey));
    const elapsed = now - confirmedAt;

    return Number.isFinite(confirmedAt) && elapsed >= 0 && elapsed < contentWarningDurationMs;
  } catch {
    return false;
  }
}

export function saveContentWarningConfirmation(
  now = Date.now(),
  storage: Storage | null = getStorage(),
): void {
  try {
    storage?.setItem(contentWarningStorageKey, String(now));
  } catch {
    // Restricted or private browsing contexts may not permit localStorage writes.
  }
}

export function resolveContentWarningLocale(
  activeLocale: AppLocale,
  routeLocale: AppLocale | null,
  storedLocale: AppLocale | null,
): AppLocale {
  return routeLocale || storedLocale ? activeLocale : 'zh-Hant';
}
