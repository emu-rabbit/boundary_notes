<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useI18n } from './app/i18n';
import { localizeRoutes, type AppRouteId } from './app/routes';
import { provideAppShell } from './app/useAppShell';
import { saveStoredProfileName } from './app/useProfileNameStorage';
import { useSecretFileTitle } from './app/useSecretFileTitle';
import AnalyticsConsentBanner from './components/AnalyticsConsentBanner.vue';
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
const { locale, localeOptions, messages, setLocale } = useI18n();
const { appTitle, documentTitle, titleParts } = useSecretFileTitle(profileName, messages);
const autoAdvanceDelay = computed(() => (uninterruptedAutoAdvanceCount.value >= 3 ? 1500 : 3000));
const localizedRoutes = computed(() => localizeRoutes(messages.value));
const localizedRouteById = computed(
  () => new Map(localizedRoutes.value.map((route) => [route.id, route])),
);
const localizedHomeEntrances = computed(() =>
  localizedRoutes.value.filter((route) => route.id !== 'story' && route.id !== 'home'),
);
const showAnalyticsConsent = computed(() => shouldShowAnalyticsConsent({
  consent: analyticsConsentState.value,
  routeName: route.name,
  source: route.query.source,
  uiEnabled: isAnalyticsConsentUiEnabled,
}));

watch(
  documentTitle,
  (title) => {
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  },
  { immediate: true },
);

function navigate(routeId: AppRouteId): void {
  trackRouteSelection(routeId);
  void router.push({ name: routeId });
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
  <AnalyticsConsentBanner v-if="showAnalyticsConsent" />
</template>
