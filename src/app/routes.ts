import type { Component } from 'vue';
import type { LocationQueryRaw, RouteParamsRawGeneric, RouteRecordRaw } from 'vue-router';
import type { AppLocale, LocaleMessages } from './i18n';
import { localeParamPattern, toLocalePathSegment } from './localeRouting';

export const appRouteIds = [
  'story',
  'home',
  'create',
  'preview',
  'files',
  'timeMachine',
  'about',
  'versionHistory',
  'settings',
  'terms',
  'privacy',
] as const;

export type AppRouteId = (typeof appRouteIds)[number];

export interface AppRouteDefinition {
  id: AppRouteId;
  path: string;
  state: 'ready' | 'planned';
  component: () => Promise<{ default: Component }>;
}

export type LocalizedAppRouteDefinition = Pick<AppRouteDefinition, 'id' | 'path' | 'state'> & {
  label: string;
  summary: string;
};

export const defaultRouteId: AppRouteId = 'story';
export const fallbackRouteId: AppRouteId = 'home';

export const appRoutes = [
  {
    id: 'story',
    path: '/intro',
    state: 'ready',
    component: () => import('../views/StoryView.vue'),
  },
  {
    id: 'home',
    path: '/home',
    state: 'ready',
    component: () => import('../views/HomeView.vue'),
  },
  {
    id: 'create',
    path: '/create',
    state: 'ready',
    component: () => import('../views/CreateFileView.vue'),
  },
  {
    id: 'preview',
    path: '/preview',
    state: 'ready',
    component: () => import('../views/SecretFilePreviewView.vue'),
  },
  {
    id: 'files',
    path: '/files',
    state: 'ready',
    component: () => import('../views/FilesView.vue'),
  },
  {
    id: 'timeMachine',
    path: '/time-machine',
    state: 'ready',
    component: () => import('../views/TimeMachineView.vue'),
  },
  {
    id: 'about',
    path: '/about',
    state: 'ready',
    component: () => import('../views/AboutView.vue'),
  },
  {
    id: 'versionHistory',
    path: '/version-history',
    state: 'ready',
    component: () => import('../views/VersionHistoryView.vue'),
  },
  {
    id: 'settings',
    path: '/settings',
    state: 'ready',
    component: () => import('../views/SettingsView.vue'),
  },
  {
    id: 'terms',
    path: '/terms',
    state: 'ready',
    component: () => import('../views/TermsView.vue'),
  },
  {
    id: 'privacy',
    path: '/privacy',
    state: 'ready',
    component: () => import('../views/PrivacyView.vue'),
  },
] as const satisfies readonly AppRouteDefinition[];

const appRouteIdSet = new Set<AppRouteId>(appRouteIds);

export function isAppRouteId(value: unknown): value is AppRouteId {
  return typeof value === 'string' && appRouteIdSet.has(value as AppRouteId);
}

export function localizeRoutes(messages: LocaleMessages): LocalizedAppRouteDefinition[] {
  return appRoutes.map((route) => ({
    id: route.id,
    path: route.path,
    state: route.state,
    ...messages.routes[route.id],
  }));
}

export function getLocalizedRouteLocation(
  name: AppRouteId,
  locale: AppLocale,
  options: {
    hash?: string;
    params?: RouteParamsRawGeneric;
    query?: LocationQueryRaw;
  } = {},
) {
  return {
    ...options,
    name,
    params: {
      ...options.params,
      locale: toLocalePathSegment(locale),
    },
  };
}

export function getLocalizedRoutePath(routeId: AppRouteId, locale: AppLocale): string {
  const route = appRoutes.find(({ id }) => id === routeId);

  if (!route) {
    return `/${toLocalePathSegment(locale)}`;
  }

  return `/${toLocalePathSegment(locale)}${route.path}`;
}

export function createRouteRecords(preferredLocale: AppLocale): RouteRecordRaw[] {
  const preferredLocaleSegment = toLocalePathSegment(preferredLocale);
  const localizedRoutes = appRoutes.map((route) => ({
    path: `/:locale(${localeParamPattern})${route.path}`,
    name: route.id,
    component: route.component,
    meta: {
      state: route.state,
    },
  }));
  const legacyRoutes = appRoutes.map((route) => ({
    path: route.path || '/',
    redirect: (to: { hash: string; query: LocationQueryRaw }) => ({
      name: route.id,
      params: { locale: preferredLocaleSegment },
      query: to.query,
      hash: to.hash,
      replace: true,
    }),
  }));

  return [
    {
      path: `/:locale(${localeParamPattern})`,
      name: 'entry',
      component: () => import('../views/StoryView.vue'),
      meta: { state: 'ready' },
    },
    ...localizedRoutes,
    ...legacyRoutes,
    {
      path: '/',
      name: 'rootEntry',
      redirect: (to) => ({
        name: 'entry',
        params: { locale: preferredLocaleSegment },
        query: to.query,
        hash: to.hash,
        replace: true,
      }),
    },
    {
      path: `/:locale(${localeParamPattern})/:pathMatch(.*)*`,
      name: 'localizedNotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ];
}
