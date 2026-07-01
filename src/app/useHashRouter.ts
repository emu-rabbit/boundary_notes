import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { type AppRouteId, defaultRouteId, routeFromLocation, urlForRoute } from './routes';

export function useHashRouter(basePath: string, landingRouteId: AppRouteId = defaultRouteId) {
  const currentRouteId = ref<AppRouteId>(landingRouteId);

  function resetScrollPosition(): void {
    void nextTick(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    });
  }

  function replaceRoute(routeId: AppRouteId): void {
    currentRouteId.value = routeId;
    window.history.replaceState({ routeId }, '', urlForRoute(routeId, basePath, landingRouteId));
    resetScrollPosition();
  }

  function pushRoute(routeId: AppRouteId): void {
    currentRouteId.value = routeId;
    window.history.pushState({ routeId }, '', urlForRoute(routeId, basePath, landingRouteId));
    resetScrollPosition();
  }

  function syncFromLocation(): void {
    currentRouteId.value = routeFromLocation(window.location, landingRouteId);
    resetScrollPosition();
  }

  onMounted(() => {
    const initialRoute = routeFromLocation(window.location, landingRouteId);
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
