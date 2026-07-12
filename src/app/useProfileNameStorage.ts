export const defaultProfileName = '兔子';
export const profileNameStorageKey = 'bdsm-boundary-test-profile-name';
export const profileNameMaxLength = 32;

type GraphemeSegmenter = {
  segment: (input: string) => Iterable<{ segment: string }>;
};

type IntlWithSegmenter = typeof Intl & {
  Segmenter?: new (
    locales?: string | string[],
    options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
  ) => GraphemeSegmenter;
};

const combiningMarkPattern = /[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/u;
const wideCharacterPattern =
  /[\u1100-\u115f\u2329\u232a\u2e80-\u303e\u3040-\u30ff\u3100-\u312f\u3130-\u318f\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe19\ufe30-\ufe6f\uff00-\uff60\uffe0-\uffe6]/u;
const emojiPattern = /\p{Extended_Pictographic}/u;

function storageAvailable(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function segmentGraphemes(value: string): string[] {
  const Segmenter = (Intl as IntlWithSegmenter).Segmenter;

  if (Segmenter) {
    return Array.from(
      new Segmenter(undefined, { granularity: 'grapheme' }).segment(value),
      ({ segment }) => segment,
    );
  }

  return Array.from(value);
}

function getVisualWidthUnit(grapheme: string): number {
  if (!grapheme || combiningMarkPattern.test(grapheme)) {
    return 0;
  }

  if (wideCharacterPattern.test(grapheme) || emojiPattern.test(grapheme)) {
    return 2;
  }

  if (/\s/u.test(grapheme)) {
    return 0.5;
  }

  return 1;
}

export function measureProfileNameVisualWidth(name: string): number {
  return segmentGraphemes(name).reduce(
    (width, grapheme) => width + getVisualWidthUnit(grapheme),
    0,
  );
}

export function normalizeProfileName(name: string, fallback = ''): string {
  const normalizedName = name.trim();
  return normalizedName || fallback;
}

export function loadStoredProfileName(): string {
  try {
    return normalizeProfileName(storageAvailable()?.getItem(profileNameStorageKey) ?? '');
  } catch {
    return '';
  }
}

export function getProfileEntryRoute(profileName: string): 'home' | 'story' {
  return normalizeProfileName(profileName) ? 'home' : 'story';
}

export function saveStoredProfileName(name: string, fallback = defaultProfileName): string {
  const normalizedName = normalizeProfileName(name, fallback);

  try {
    storageAvailable()?.setItem(profileNameStorageKey, normalizedName);
  } catch {
    // localStorage can be unavailable in restricted/private contexts; the in-memory name still works.
  }

  return normalizedName;
}
