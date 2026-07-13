<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useI18n } from './app/i18n';
import { localizeRoutes, type AppRouteId } from './app/routes';
import { provideAppShell } from './app/useAppShell';
import { saveStoredProfileName } from './app/useProfileNameStorage';
import { useSecretFileTitle } from './app/useSecretFileTitle';

const props = defineProps<{
  initialProfileName: string;
}>();

const router = useRouter();
const profileName = ref(props.initialProfileName);
const { locale, localeOptions, messages, setLocale } = useI18n();
const { appTitle, documentTitle, titleParts } = useSecretFileTitle(profileName, messages);
const localizedRoutes = computed(() => localizeRoutes(messages.value));
const localizedRouteById = computed(
  () => new Map(localizedRoutes.value.map((route) => [route.id, route])),
);
const localizedHomeEntrances = computed(() =>
  localizedRoutes.value.filter((route) => route.id !== 'story' && route.id !== 'home'),
);

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
  void router.push({ name: routeId });
}

function completeStory(): void {
  profileName.value = saveStoredProfileName(
    profileName.value,
    messages.value.title.defaultProfileName,
  );
  navigate('home');
}

function updateProfileName(name: string): void {
  profileName.value = saveStoredProfileName(name, messages.value.title.defaultProfileName);
}

provideAppShell({
  appTitle,
  completeStory,
  documentTitle,
  locale,
  localeOptions,
  localizedHomeEntrances,
  localizedRouteById,
  messages,
  navigate,
  profileName,
  setLocale,
  titleParts,
  updateProfileName,
});
</script>

<template>
  <main class="app-shell min-h-dvh text-ink-900">
    <RouterView />
  </main>
</template>
