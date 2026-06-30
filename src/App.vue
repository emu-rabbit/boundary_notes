<script setup lang="ts">
import { computed, ref } from 'vue';
import { appRouteById, fallbackRouteId, homeEntrances, type AppRouteId } from './app/routes';
import { useHashRouter } from './app/useHashRouter';
import { loadStoredProfileName, saveStoredProfileName } from './app/useProfileNameStorage';
import { useSecretFileTitle } from './app/useSecretFileTitle';
import AboutView from './views/AboutView.vue';
import HomeView from './views/HomeView.vue';
import PlannedRouteView from './views/PlannedRouteView.vue';
import StoryView from './views/StoryView.vue';

const storedProfileName = loadStoredProfileName();
const profileName = ref(storedProfileName);
const { appTitle, titleParts } = useSecretFileTitle(profileName);
const { currentRouteId, pushRoute } = useHashRouter(
  import.meta.env.BASE_URL,
  storedProfileName ? 'home' : 'story',
);
const activeRoute = computed(() => appRouteById.get(currentRouteId.value) ?? appRouteById.get(fallbackRouteId));

function navigate(routeId: AppRouteId): void {
  pushRoute(routeId);
}

function completeStory(): void {
  profileName.value = saveStoredProfileName(profileName.value);
  navigate('home');
}
</script>

<template>
  <main class="app-shell min-h-dvh overflow-hidden text-ink-900">
    <StoryView
      v-if="currentRouteId === 'story'"
      v-model:profile-name="profileName"
      :app-title="appTitle"
      :title-parts="titleParts"
      @complete="completeStory"
      @restart="navigate('story')"
    />

    <HomeView
      v-else-if="currentRouteId === 'home'"
      :entrances="homeEntrances"
      :title-parts="titleParts"
      @navigate="navigate"
    />

    <AboutView
      v-else-if="currentRouteId === 'about'"
      :app-title="appTitle"
      @navigate="navigate"
    />

    <PlannedRouteView
      v-else-if="activeRoute"
      :app-title="appTitle"
      :route="activeRoute"
      @navigate="navigate"
    />
  </main>
</template>
