import {
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue';
import type { AppLocale, LocaleMessages, LocaleOption } from './i18n';
import type { AppRouteId, LocalizedAppRouteDefinition } from './routes';
import type { SecretFileTitleParts } from './useSecretFileTitle';

export interface AppShellContext {
  appTitle: ComputedRef<string>;
  completeStory: () => void;
  documentTitle: ComputedRef<string>;
  locale: Ref<AppLocale>;
  localeOptions: readonly LocaleOption[];
  localizedHomeEntrances: ComputedRef<LocalizedAppRouteDefinition[]>;
  localizedRouteById: ComputedRef<ReadonlyMap<AppRouteId, LocalizedAppRouteDefinition>>;
  messages: ComputedRef<LocaleMessages>;
  navigate: (routeId: AppRouteId) => void;
  profileName: Ref<string>;
  setLocale: (locale: AppLocale) => void;
  titleParts: ComputedRef<SecretFileTitleParts>;
  updateProfileName: (name: string) => void;
}

const appShellKey: InjectionKey<AppShellContext> = Symbol('app-shell');

export function provideAppShell(context: AppShellContext): void {
  provide(appShellKey, context);
}

export function useAppShell(): AppShellContext {
  const context = inject(appShellKey);

  if (!context) {
    throw new Error('App shell context is unavailable outside the application root.');
  }

  return context;
}
