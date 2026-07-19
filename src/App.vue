<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { loadStoredLocaleOrNull, resolveInitialLocale, useI18n } from './app/i18n';
import { fromLocalePathSegment, toLocalePathSegment } from './app/localeRouting';
import {
  getLocalizedRouteLocation,
  isAppRouteId,
  localizeRoutes,
  type AppRouteId,
} from './app/routes';
import { applySeoDocument, getSeoDocument, publicSeoRouteIds } from './app/seo';
import { provideAppShell } from './app/useAppShell';
import { saveStoredProfileName } from './app/useProfileNameStorage';
import { useSecretFileTitle } from './app/useSecretFileTitle';
import AnalyticsConsentBanner from './components/AnalyticsConsentBanner.vue';
import ContentWarningDialog from './features/content-warning/ContentWarningDialog.vue';
import { resolveContentWarningLocale } from './features/content-warning/contentWarning';
import {
  analyticsConsentState,
  isAnalyticsConsentUiEnabled,
  shouldShowAnalyticsConsent,
  trackLocaleChanged,
  trackProfileNameUpdated,
  trackRouteSelection,
} from './features/analytics/analytics';

const props = defineProps<{
  initialProfileName: string;
}>();

const router = useRouter();
const route = useRoute();
const profileName = ref(props.initialProfileName);
const uninterruptedAutoAdvanceCount = ref(0);
const routeLocale = fromLocalePathSegment(route.params.locale);
const storedLocaleAtEntry = loadStoredLocaleOrNull();
const isCloudShareEntry = route.name === 'preview' && route.query.source === 'cloud';
let preserveStoredLocaleForInitialCloudShare = isCloudShareEntry && storedLocaleAtEntry !== null;
const { locale, localeOptions, messages, setLocale } = useI18n(resolveInitialLocale(
  routeLocale,
  storedLocaleAtEntry,
  preserveStoredLocaleForInitialCloudShare,
));
const { appTitle, documentTitle, titleParts } = useSecretFileTitle(profileName, messages);
const autoAdvanceDelay = computed(() => (uninterruptedAutoAdvanceCount.value >= 3 ? 1500 : 3000));
const localizedRoutes = computed(() => localizeRoutes(messages.value));
const localizedRouteById = computed(
  () => new Map(localizedRoutes.value.map((route) => [route.id, route])),
);
const localizedHomeEntrances = computed(() =>
  localizedRoutes.value.filter(
    (route) => route.id !== 'story' && route.id !== 'home',
  ),
);
const showAnalyticsConsent = computed(() => shouldShowAnalyticsConsent({
  consent: analyticsConsentState.value,
  routeName: route.name,
  source: route.query.source,
  uiEnabled: isAnalyticsConsentUiEnabled,
}));
const contentWarningLocale = computed(() => resolveContentWarningLocale(
  locale.value,
  fromLocalePathSegment(route.params.locale),
  loadStoredLocaleOrNull(),
));
const publicIndexingBuild = import.meta.env.VITE_PUBLIC_INDEXING === 'true'
  || (typeof document !== 'undefined'
    && document.documentElement.dataset.publicIndexing === 'true');

watch(
  () => route.params.locale,
  (localeParam) => {
    const nextLocale = fromLocalePathSegment(localeParam);
    if (preserveStoredLocaleForInitialCloudShare) {
      preserveStoredLocaleForInitialCloudShare = false;
      return;
    }

    preserveStoredLocaleForInitialCloudShare = false;
    if (nextLocale) setLocale(nextLocale);
  },
  { immediate: true },
);

watch(
  [() => route.name, locale, documentTitle],
  ([routeName]) => {
    const seo = getSeoDocument(
      routeName,
      locale.value,
      publicIndexingBuild,
    );
    applySeoDocument(seo);

    if (typeof document !== 'undefined' && !publicSeoRouteIds.includes(routeName as never)) {
      document.title = documentTitle.value;
    }
  },
  { immediate: true },
);

function navigate(routeId: AppRouteId): void {
  trackRouteSelection(routeId);
  void router.push(getLocalizedRouteLocation(routeId, locale.value));
}

function completeStory(): void {
  profileName.value = saveStoredProfileName(
    profileName.value,
    messages.value.title.defaultProfileName,
  );
  trackProfileNameUpdated();
  navigate('home');
}

function updateProfileName(name: string): void {
  profileName.value = saveStoredProfileName(name, messages.value.title.defaultProfileName);
  trackProfileNameUpdated();
}

function updateLocale(nextLocale: typeof locale.value): void {
  setLocale(nextLocale);
  trackLocaleChanged(nextLocale);

  if (route.name === 'entry') {
    void router.replace({
      name: 'entry',
      params: { locale: toLocalePathSegment(nextLocale) },
      query: route.query,
      hash: route.hash,
    });
  } else if (isAppRouteId(route.name)) {
    void router.replace(getLocalizedRouteLocation(route.name, nextLocale, {
      query: route.query,
      hash: route.hash,
    }));
  }
}

function recordAutoAdvance(): void {
  uninterruptedAutoAdvanceCount.value += 1;
}

function resetAutoAdvance(): void {
  uninterruptedAutoAdvanceCount.value = 0;
}

provideAppShell({
  appTitle,
  autoAdvanceDelay,
  completeStory,
  documentTitle,
  locale,
  localeOptions,
  localizedHomeEntrances,
  localizedRouteById,
  messages,
  navigate,
  profileName,
  recordAutoAdvance,
  resetAutoAdvance,
  setLocale: updateLocale,
  titleParts,
  updateProfileName,
});
</script>

<template>
  <main class="app-shell min-h-dvh text-ink-900">
    <RouterView />
  </main>
  <ContentWarningDialog :locale="contentWarningLocale" />
  <AnalyticsConsentBanner v-if="showAnalyticsConsent" />
</template>
