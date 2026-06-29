<script setup lang="ts">
import { computed, ref } from 'vue';
import { appRouteById, fallbackRouteId, homeEntrances, type AppRouteId } from './app/routes';
import { useHashRouter } from './app/useHashRouter';
import { useSecretFileTitle } from './app/useSecretFileTitle';
import HomeView from './views/HomeView.vue';
import PlannedRouteView from './views/PlannedRouteView.vue';
import StoryView from './views/StoryView.vue';

const profileName = ref('');
const { appTitle } = useSecretFileTitle(profileName);
const { currentRouteId, pushRoute } = useHashRouter(import.meta.env.BASE_URL);
const activeRoute = computed(() => appRouteById.get(currentRouteId.value) ?? appRouteById.get(fallbackRouteId));

function navigate(routeId: AppRouteId): void {
  pushRoute(routeId);
}
</script>

<template>
  <main class="app-shell min-h-dvh overflow-hidden text-ink-900">
    <StoryView
      v-if="currentRouteId === 'story'"
      v-model:profile-name="profileName"
      :app-title="appTitle"
      @complete="navigate('home')"
      @restart="navigate('story')"
    />

    <HomeView
      v-else-if="currentRouteId === 'home'"
      :app-title="appTitle"
      :entrances="homeEntrances"
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
