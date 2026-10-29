import { computed, ref, watch } from 'vue';
import { enMessages } from './locales/en';
import { jaMessages } from './locales/ja';
import { zhHansMessages } from './locales/zh-Hans';
import { zhHantMessages } from './locales/zh-Hant';
import type { AppLocale, LocaleMessages, LocaleOption } from './types';

export type {
  AppLocale,
  LocaleMessages,
  LocaleOption,
  RouteMessage,
  StoryChoiceMessage,
  StoryStepMessages,
} from './types';

export const localeStorageKey = 'bdsm-boundary-test-locale';
export const defaultLocale: AppLocale = 'en';

export const localeOptions: LocaleOption[] = [
  { id: 'zh-Hant', label: '繁體中文' },
  { id: 'zh-Hans', label: '简体中文' },
  { id: 'ja', label: '日本語' },
  { id: 'en', label: 'English' },
];

const supportedLocaleIds = new Set<AppLocale>(localeOptions.map((option) => option.id));

export const messagesByLocale: Record<AppLocale, LocaleMessages> = {
  'zh-Hant': zhHantMessages,
  'zh-Hans': zhHansMessages,
  ja: jaMessages,
  en: enMessages,
};

function isAppLocale(value: string | null): value is AppLocale {
  return value !== null && supportedLocaleIds.has(value as AppLocale);
}

function storageAvailable(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function loadStoredLocale(): AppLocale {
  return loadStoredLocaleOrNull() ?? getBrowserLocale() ?? defaultLocale;
}

export function loadStoredLocaleOrNull(): AppLocale | null {
  try {
    const storedLocale = storageAvailable()?.getItem(localeStorageKey) ?? null;
    return isAppLocale(storedLocale) ? storedLocale : null;
  } catch {
    return null;
  }
}

export function resolveInitialLocale(
  routeLocale: AppLocale | null,
  storedLocale: AppLocale | null,
  preferStoredLocale: boolean,
  browserLocale: AppLocale | null = null,
): AppLocale {
  if (preferStoredLocale && storedLocale) return storedLocale;
  return routeLocale ?? storedLocale ?? browserLocale ?? defaultLocale;
}

export function resolveBrowserLocale(languages: readonly string[]): AppLocale | null {
  for (const language of languages) {
    const parts = language.toLowerCase().replace(/_/gu, '-').split('-');
    const [languageCode, ...subtags] = parts;

    if (languageCode === 'en') return 'en';
    if (languageCode === 'ja') return 'ja';
    if (languageCode === 'zh') {
      if (
        subtags.includes('hant')
        || ['tw', 'hk', 'mo'].some((region) => subtags.includes(region))
      ) {
        return 'zh-Hant';
      }
      if (
        subtags.includes('hans')
        || ['cn', 'sg'].some((region) => subtags.includes(region))
      ) {
        return 'zh-Hans';
      }
      return 'zh-Hant';
    }
  }

  return null;
}

export function getBrowserLocale(): AppLocale | null {
  if (typeof navigator === 'undefined') return null;
  const languages = [...navigator.languages, navigator.language];
  return resolveBrowserLocale(languages);
}

export function saveStoredLocale(locale: AppLocale): void {
  try {
    storageAvailable()?.setItem(localeStorageKey, locale);
  } catch {
    // localStorage can be unavailable in restricted/private contexts; the current session still updates.
  }
}

export function useI18n(initialLocale: AppLocale = loadStoredLocale()) {
  const locale = ref<AppLocale>(initialLocale);
  const messages = computed(() => messagesByLocale[locale.value]);

  function setLocale(nextLocale: AppLocale): void {
    locale.value = nextLocale;
    saveStoredLocale(nextLocale);
  }

  watch(
    locale,
    (nextLocale) => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = nextLocale;
      }
    },
    { immediate: true },
  );

  return {
    locale,
    localeOptions,
    messages,
    setLocale,
  };
}
