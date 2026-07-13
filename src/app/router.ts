import { createRouter, createWebHistory } from 'vue-router';
import {
  createRouteRecords,
  defaultRouteId,
  type AppRouteId,
} from './routes';

export function createAppRouter(basePath: string, landingRouteId: AppRouteId) {
  const router = createRouter({
    history: createWebHistory(basePath),
    routes: createRouteRecords(),
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });
  let isInitialNavigation = true;

  router.beforeEach((to) => {
    const shouldUseLandingRoute =
      isInitialNavigation &&
      to.name === defaultRouteId &&
      landingRouteId !== defaultRouteId;

    isInitialNavigation = false;

    if (shouldUseLandingRoute) {
      return { name: landingRouteId, replace: true };
    }

    return true;
  });

  return router;
}
