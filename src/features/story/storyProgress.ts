export type ReplayableStoryId = 'create' | 'timeMachine';

const storageKeyPrefix = 'bdsm-boundary-test-story-played-';

function storageAvailable(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function storageKey(storyId: ReplayableStoryId): string {
  return `${storageKeyPrefix}${storyId}`;
}

export function hasPlayedStory(storyId: ReplayableStoryId): boolean {
  try {
    return storageAvailable()?.getItem(storageKey(storyId)) === 'true';
  } catch {
    return false;
  }
}

export function markStoryPlayed(storyId: ReplayableStoryId): void {
  try {
    storageAvailable()?.setItem(storageKey(storyId), 'true');
  } catch {
    // localStorage can be unavailable in restricted/private contexts; the current session still works.
  }
}
