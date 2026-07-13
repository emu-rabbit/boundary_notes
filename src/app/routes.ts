import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { LocaleMessages } from './i18n';

export const appRouteIds = [
  'story',
  'home',
  'create',
  'preview',
  'files',
  'timeMachine',
  'about',
  'settings',
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
    path: '/',
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
    state: 'planned',
    component: () => import('../views/PlannedRouteView.vue'),
  },
  {
    id: 'about',
    path: '/about',
    state: 'ready',
    component: () => import('../views/AboutView.vue'),
  },
  {
    id: 'settings',
    path: '/settings',
    state: 'ready',
    component: () => import('../views/SettingsView.vue'),
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

export function createRouteRecords(): RouteRecordRaw[] {
  return [
    ...appRoutes.map((route) => ({
      path: route.path,
      name: route.id,
      component: route.component,
      meta: {
        state: route.state,
      },
    })),
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ];
}
