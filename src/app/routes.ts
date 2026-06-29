export type AppRouteId = 'story' | 'home' | 'test' | 'files' | 'share' | 'timeline';

export interface AppRouteDefinition {
  id: AppRouteId;
  hashPath: string;
  label: string;
  summary: string;
  state: 'ready' | 'planned';
}

export const defaultRouteId: AppRouteId = 'story';
export const fallbackRouteId: AppRouteId = 'home';

export const appRoutes: AppRouteDefinition[] = [
  {
    id: 'story',
    hashPath: '/',
    label: '前導劇情',
    summary: '讓兔子帶使用者進入秘密檔案的第一段互動。',
    state: 'ready',
  },
  {
    id: 'home',
    hashPath: '/home',
    label: '主頁',
    summary: '彙整後續主要流程入口，作為多頁功能的導覽起點。',
    state: 'ready',
  },
  {
    id: 'test',
    hashPath: '/test',
    label: '開始測驗',
    summary: '整理互動項目的經驗、興趣與備註。',
    state: 'planned',
  },
  {
    id: 'files',
    hashPath: '/files',
    label: '秘密檔案',
    summary: '檢閱已完成或本地保存的秘密檔案。',
    state: 'planned',
  },
  {
    id: 'share',
    hashPath: '/share',
    label: '分享檢閱',
    summary: '確認分享內容，並提醒檔案不是同意書。',
    state: 'planned',
  },
  {
    id: 'timeline',
    hashPath: '/timeline',
    label: '變化時間軸',
    summary: '比較不同時間填寫的界限與興趣變化。',
    state: 'planned',
  },
];

export const appRouteById = new Map(appRoutes.map((route) => [route.id, route]));

export const homeEntrances = appRoutes.filter(
  (route) => route.id !== 'story' && route.id !== 'home',
);

function normalizeHashPath(rawHash: string): string {
  const path = rawHash.replace(/^#/, '') || '/';
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

export function routeFromLocation(location: Location): AppRouteId {
  const hashPath = normalizeHashPath(location.hash);
  const matchedHashRoute = appRoutes.find((route) => route.hashPath === hashPath);

  if (matchedHashRoute) {
    return matchedHashRoute.id;
  }

  return defaultRouteId;
}

export function urlForRoute(routeId: AppRouteId, basePath: string): string {
  const route = appRouteById.get(routeId) ?? appRouteById.get(defaultRouteId);
  const hashPath = route?.hashPath ?? '/';

  if (routeId === defaultRouteId) {
    return basePath;
  }

  return `${basePath}#${hashPath}`;
}
