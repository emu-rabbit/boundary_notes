import { onMounted, onUnmounted, ref } from 'vue';
import { type AppRouteId, defaultRouteId, routeFromLocation, urlForRoute } from './routes';

export function useHashRouter(basePath: string) {
  const currentRouteId = ref<AppRouteId>(defaultRouteId);

  function replaceRoute(routeId: AppRouteId): void {
    currentRouteId.value = routeId;
    window.history.replaceState({ routeId }, '', urlForRoute(routeId, basePath));
  }

  function pushRoute(routeId: AppRouteId): void {
    currentRouteId.value = routeId;
    window.history.pushState({ routeId }, '', urlForRoute(routeId, basePath));
  }

  function syncFromLocation(): void {
    currentRouteId.value = routeFromLocation(window.location);
  }

  onMounted(() => {
    const initialRoute = routeFromLocation(window.location);
    replaceRoute(initialRoute);
    syncFromLocation();

    window.addEventListener('hashchange', syncFromLocation);
    window.addEventListener('popstate', syncFromLocation);
  });

  onUnmounted(() => {
    window.removeEventListener('hashchange', syncFromLocation);
    window.removeEventListener('popstate', syncFromLocation);
  });

  return {
    currentRouteId,
    pushRoute,
  };
}
