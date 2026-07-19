import type { SecretFile, SecretFileScope } from '../secret-file';

export type ProfileBranch = 'sameProfile' | 'differentProfile';

export type ScopeBranch =
  | 'sameActive'
  | 'samePassive'
  | 'sameAll'
  | 'singleToAll'
  | 'singleToSingle'
  | 'allToSingle';

export interface OrderedTimeMachineFiles {
  newer: SecretFile;
  older: SecretFile;
}

function compareSecretFileTime(left: SecretFile, right: SecretFile): number {
  const updatedAtDifference = Date.parse(left.updatedAt) - Date.parse(right.updatedAt);

  if (updatedAtDifference !== 0) return updatedAtDifference;

  const createdAtDifference = Date.parse(left.createdAt) - Date.parse(right.createdAt);

  if (createdAtDifference !== 0) return createdAtDifference;

  return left.fileId.localeCompare(right.fileId);
}

export function orderTimeMachineFiles(
  first: SecretFile,
  second: SecretFile,
): OrderedTimeMachineFiles {
  return compareSecretFileTime(first, second) <= 0
    ? { older: first, newer: second }
    : { older: second, newer: first };
}

export function getProfileBranch(files: OrderedTimeMachineFiles): ProfileBranch {
  return files.older.profileName === files.newer.profileName
    ? 'sameProfile'
    : 'differentProfile';
}

function isSingleScope(scope: SecretFileScope): boolean {
  return scope === 'activeOnly' || scope === 'passiveOnly';
}

export function getScopeBranch(files: OrderedTimeMachineFiles): ScopeBranch {
  const olderScope = files.older.scope;
  const newerScope = files.newer.scope;

  if (olderScope === newerScope) {
    if (olderScope === 'activeOnly') return 'sameActive';
    if (olderScope === 'passiveOnly') return 'samePassive';
    return 'sameAll';
  }

  if (isSingleScope(olderScope) && newerScope === 'all') return 'singleToAll';
  if (olderScope === 'all' && isSingleScope(newerScope)) return 'allToSingle';

  return 'singleToSingle';
}

function toLocalCalendarDay(value: string): number {
  const date = new Date(value);

  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getCalendarDayGap(files: OrderedTimeMachineFiles): number {
  const olderDay = toLocalCalendarDay(files.older.updatedAt);
  const newerDay = toLocalCalendarDay(files.newer.updatedAt);

  if (!Number.isFinite(olderDay) || !Number.isFinite(newerDay)) return 0;

  return Math.max(0, Math.round((newerDay - olderDay) / 86_400_000));
}
