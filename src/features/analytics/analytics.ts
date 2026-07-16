import { readonly, ref } from 'vue';
import type { Analytics } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import type { AppRouteId } from '../../app/routes';
import type {
  QuestionLevel,
  QuestionRole,
  SecretFileScope,
} from '../secret-file';

export const analyticsConsentStorageKey = 'boundary-notes-analytics-consent:v1';

export type AnalyticsConsentState = 'declined' | 'granted' | 'unknown';
export type AnalyticsImportSource = 'cloud_share' | 'local_json';
export type AnalyticsSecretFileScope = 'both' | 'following' | 'leading';

type AnalyticsContext = {
  analytics: Analytics;
  module: typeof import('firebase/analytics');
};

type AnalyticsEventParams = Record<string, boolean | number | string>;

const firebaseAnalyticsAppName = 'boundary-notes-analytics';
const consentState = ref<AnalyticsConsentState>(loadStoredAnalyticsConsent());
const runtimeEnabled = import.meta.env.PROD && hasAnalyticsConfiguration();
const consentUiPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_SHOW_ANALYTICS_CONSENT === 'true';

let analyticsContextPromise: Promise<AnalyticsContext | null> | null = null;
let analyticsContext: AnalyticsContext | null = null;
let installedRouter: Router | null = null;

export const analyticsConsentState = readonly(consentState);
export const isAnalyticsRuntimeEnabled = runtimeEnabled;
export const isAnalyticsConsentUiEnabled = runtimeEnabled || consentUiPreviewEnabled;

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readAnalyticsConsent(storage: Pick<Storage, 'getItem'> | null): AnalyticsConsentState {
  try {
    return storage?.getItem(analyticsConsentStorageKey) === 'granted' ? 'granted' : 'unknown';
  } catch {
    return 'unknown';
  }
}

function loadStoredAnalyticsConsent(): AnalyticsConsentState {
  return readAnalyticsConsent(getStorage());
}

function hasAnalyticsConfiguration(): boolean {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY?.trim() &&
      import.meta.env.VITE_FIREBASE_APP_ID?.trim() &&
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  );
}

function getAnalyticsFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
    appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim(),
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  };
}

function getSafeRouteLocation(route: Pick<RouteLocationNormalizedLoaded, 'path'>): string {
  if (typeof window === 'undefined') return route.path;
  return new URL(route.path, window.location.origin).href;
}

function getSafeReferrer(): string {
  if (typeof document === 'undefined' || !document.referrer) return '';

  try {
    const referrer = new URL(document.referrer);
    return `${referrer.origin}${referrer.pathname}`;
  } catch {
    return '';
  }
}

export function toAnalyticsSecretFileScope(scope: SecretFileScope): AnalyticsSecretFileScope {
  if (scope === 'activeOnly') return 'leading';
  if (scope === 'passiveOnly') return 'following';
  return 'both';
}

export function shouldShowAnalyticsConsent(input: {
  consent: AnalyticsConsentState;
  routeName: string | symbol | null | undefined;
  source: unknown;
  uiEnabled: boolean;
}): boolean {
  if (!input.uiEnabled || input.consent !== 'unknown') return false;
  if (input.routeName === 'entry' || input.routeName === 'story') return false;
  if (input.routeName === 'terms' || input.routeName === 'privacy') return false;
  if (input.routeName === 'preview' && input.source === 'cloud') return false;
  return true;
}

async function getAnalyticsContext(): Promise<AnalyticsContext | null> {
  if (!runtimeEnabled || consentState.value !== 'granted') return null;
  if (analyticsContext) return analyticsContext;
  if (analyticsContextPromise) return analyticsContextPromise;

  analyticsContextPromise = (async () => {
    const [appModule, analyticsModule] = await Promise.all([
      import('firebase/app'),
      import('firebase/analytics'),
    ]);

    if (!(await analyticsModule.isSupported())) return null;

    const config = getAnalyticsFirebaseConfig();
    const existingApp = appModule.getApps().find((app) => app.name === firebaseAnalyticsAppName);
    const app: FirebaseApp = existingApp ?? appModule.initializeApp(config, firebaseAnalyticsAppName);
    const analytics = analyticsModule.initializeAnalytics(app, {
      config: {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        send_page_view: false,
      },
    });

    const analyticsStorage = consentState.value === 'granted' ? 'granted' : 'denied';

    analyticsModule.setConsent({
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: analyticsStorage,
    });
    analyticsModule.setAnalyticsCollectionEnabled(analytics, analyticsStorage === 'granted');

    analyticsContext = { analytics, module: analyticsModule };
    return analyticsContext;
  })().catch(() => null).finally(() => {
    analyticsContextPromise = null;
  });

  return analyticsContextPromise;
}

async function logAnalyticsEvent(
  eventName: string,
  params: AnalyticsEventParams = {},
): Promise<void> {
  const context = await getAnalyticsContext();
  if (!context || consentState.value !== 'granted') return;

  const route = installedRouter?.currentRoute.value;
  const routeParams = route
    ? {
        page_location: getSafeRouteLocation(route),
        page_path: route.path,
        page_referrer: getSafeReferrer(),
        page_title: String(route.name ?? 'unknown'),
        route_name: String(route.name ?? 'unknown'),
      }
    : {};

  context.module.logEvent(context.analytics, eventName, {
    ...routeParams,
    app_locale: typeof document === 'undefined' ? 'unknown' : document.documentElement.lang,
    ...params,
  });
}

async function trackRouteView(route: RouteLocationNormalizedLoaded): Promise<void> {
  await logAnalyticsEvent('page_view', {
    page_location: getSafeRouteLocation(route),
    page_path: route.path,
    page_referrer: getSafeReferrer(),
    page_title: String(route.name ?? 'unknown'),
    route_name: String(route.name ?? 'unknown'),
    ...(route.name === 'preview'
      ? { preview_source: route.query.source === 'cloud' ? 'cloud' : 'local' }
      : {}),
  });
}

function pauseCollectionForNavigation(): void {
  if (analyticsContext) {
    analyticsContext.module.setAnalyticsCollectionEnabled(analyticsContext.analytics, false);
  }
}

async function resumeCollectionAfterNavigation(route: RouteLocationNormalizedLoaded): Promise<void> {
  if (consentState.value !== 'granted') return;
  const context = await getAnalyticsContext();
  if (!context || consentState.value !== 'granted') return;

  context.module.setAnalyticsCollectionEnabled(context.analytics, true);
  await trackRouteView(route);
}

export function installAnalyticsRouterTracking(router: Router): void {
  if (installedRouter === router) return;
  installedRouter = router;

  router.beforeEach(() => {
    pauseCollectionForNavigation();
    return true;
  });
  router.afterEach((route) => {
    void resumeCollectionAfterNavigation(route);
  });

  if (consentState.value === 'granted') {
    void resumeCollectionAfterNavigation(router.currentRoute.value);
  }
}

function saveGrantedConsent(): void {
  try {
    getStorage()?.setItem(analyticsConsentStorageKey, 'granted');
  } catch {
    // The current runtime can still honor consent when localStorage is unavailable.
  }
}

function clearGrantedConsent(): void {
  try {
    getStorage()?.removeItem(analyticsConsentStorageKey);
  } catch {
    // The current runtime still stops collection when localStorage is unavailable.
  }
}

export function grantAnalyticsConsent(): void {
  saveGrantedConsent();
  consentState.value = 'granted';

  void getAnalyticsContext().then(async (context) => {
    if (!context || consentState.value !== 'granted') return;
    context.module.setConsent({
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'granted',
    });
    context.module.setAnalyticsCollectionEnabled(context.analytics, true);
    await logAnalyticsEvent('analytics_consent_granted');
    if (installedRouter) await trackRouteView(installedRouter.currentRoute.value);
  });
}

export function declineAnalyticsConsentForRuntime(): void {
  consentState.value = 'declined';
  pauseCollectionForNavigation();
}

export function revokeAnalyticsConsent(): void {
  clearGrantedConsent();
  consentState.value = 'declined';

  if (analyticsContext) {
    analyticsContext.module.setConsent({
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
    });
    analyticsContext.module.setAnalyticsCollectionEnabled(analyticsContext.analytics, false);
  }
}

export function trackRouteSelection(routeId: AppRouteId): void {
  void logAnalyticsEvent('select_content', {
    content_type: 'app_route',
    item_id: routeId,
  });
}

export function trackLocaleChanged(locale: string): void {
  void logAnalyticsEvent('locale_changed', { selected_locale: locale });
}

export function trackProfileNameUpdated(): void {
  void logAnalyticsEvent('profile_name_updated');
}

export function trackSecretFileCreated(scope: SecretFileScope): void {
  void logAnalyticsEvent('secret_file_created', { scope: toAnalyticsSecretFileScope(scope) });
}

export function trackSecretFileEditOpened(scope: SecretFileScope): void {
  void logAnalyticsEvent('secret_file_edit_opened', { scope: toAnalyticsSecretFileScope(scope) });
}

export function trackSecretFileAnswerSaved(level: QuestionLevel, role: QuestionRole): void {
  void logAnalyticsEvent('secret_file_answer_saved', { question_level: level, role });
}

export function trackQuestionnaireOverviewCompleted(scope: SecretFileScope): void {
  void logAnalyticsEvent('questionnaire_overview_completed', {
    scope: toAnalyticsSecretFileScope(scope),
  });
}

export function trackDetailSessionStarted(
  role: QuestionRole,
  mode: 'all' | 'unanswered',
  questionCount: number,
): void {
  void logAnalyticsEvent('detail_session_started', {
    mode,
    question_count: questionCount,
    role,
  });
}

export function trackDetailSessionCompleted(
  role: QuestionRole,
  mode: 'all' | 'unanswered',
  questionCount: number,
): void {
  void logAnalyticsEvent('detail_session_completed', {
    mode,
    question_count: questionCount,
    role,
  });
}

export function trackSpotlightUpdated(role: QuestionRole, selectedCount: number): void {
  void logAnalyticsEvent('spotlight_updated', { role, selected_count: selectedCount });
}

export function trackSecretFileViewed(source: 'cloud' | 'local', scope: SecretFileScope): void {
  void logAnalyticsEvent('secret_file_viewed', {
    scope: toAnalyticsSecretFileScope(scope),
    source,
  });
}

export function trackSecretFileImported(
  importSource: AnalyticsImportSource,
  scope: SecretFileScope,
  overwroteExisting: boolean,
): void {
  void logAnalyticsEvent('secret_file_imported', {
    import_source: importSource,
    overwrote_existing: overwroteExisting,
    scope: toAnalyticsSecretFileScope(scope),
  });
}

export function trackSecretFileDownloaded(scope: SecretFileScope): void {
  void logAnalyticsEvent('secret_file_downloaded', { scope: toAnalyticsSecretFileScope(scope) });
}

export function trackSecretFileDeleted(scope: SecretFileScope): void {
  void logAnalyticsEvent('secret_file_deleted', { scope: toAnalyticsSecretFileScope(scope) });
}

export function trackCloudShareCreated(scope: SecretFileScope): void {
  void logAnalyticsEvent('share', {
    content_type: 'secret_file',
    method: 'cloud_link',
    scope: toAnalyticsSecretFileScope(scope),
  });
}

export function trackCloudShareUnlinked(scope: SecretFileScope | null): void {
  void logAnalyticsEvent('cloud_share_unlinked', {
    scope: scope ? toAnalyticsSecretFileScope(scope) : 'unknown',
  });
}
