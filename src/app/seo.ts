import type { AppLocale } from './i18n';
import { toLocalePathSegment } from './localeRouting';
import { appRouteIds, getLocalizedRoutePath, isAppRouteId, type AppRouteId } from './routes';

export const canonicalOrigin = 'https://boundarynotes.com';
export const publicSeoRouteIds = ['entry', 'about', 'terms', 'privacy'] as const;

export type PublicSeoRouteId = (typeof publicSeoRouteIds)[number];

type LocaleSeoCopy = {
  imageAlt: string;
  locale: string;
  privateDescription: string;
  privateTitle: string;
  routes: Record<PublicSeoRouteId, { description: string; title: string }>;
};

export type SeoDocument = {
  alternates: Array<{ href: string; hreflang: string }>;
  canonical: string | null;
  description: string;
  image: string;
  imageAlt: string;
  jsonLd: Record<string, unknown> | null;
  lang: AppLocale;
  ogLocale: string;
  robots: string;
  title: string;
  url: string;
};

const localeHreflang: Record<AppLocale, string> = {
  en: 'en',
  'zh-Hant': 'zh-Hant',
  'zh-Hans': 'zh-Hans',
  ja: 'ja',
};

const seoCopy: Record<AppLocale, LocaleSeoCopy> = {
  en: {
    locale: 'en_US',
    imageAlt: 'Boundary Notes, with the white bunny beside a private notebook for boundary communication.',
    privateTitle: 'Boundary Notes — A Gentle Boundary Communication Notebook',
    privateDescription: 'A private notebook for reflecting on BDSM boundaries, informed consent, and clearer boundary communication.',
    routes: {
      entry: {
        title: 'Begin Boundary Notes | BDSM Boundary Reflection Notebook',
        description: 'Choose your language and begin the private Boundary Notes introduction before reflecting on BDSM boundaries and preparing clearer informed-consent conversations.',
      },
      about: {
        title: 'About Boundary Notes | Consent & Boundary Communication',
        description: 'Learn how Boundary Notes supports private reflection, informed consent, and boundary communication without matching people or assigning roles.',
      },
      terms: {
        title: 'Terms of Use | Boundary Notes',
        description: 'Read the Boundary Notes terms, including the notebook’s purpose, responsible use, sharing limits, and important consent reminders.',
      },
      privacy: {
        title: 'Privacy Policy | Boundary Notes',
        description: 'Learn what Boundary Notes stores on your device, when information reaches the cloud, how anonymous analytics works, and what choices you have.',
      },
    },
  },
  'zh-Hant': {
    locale: 'zh_TW',
    imageAlt: 'Boundary Notes 品牌分享圖：白兔坐在協助整理界線溝通的私人筆記旁。',
    privateTitle: 'Boundary Notes｜溫柔的界線溝通筆記本',
    privateDescription: '協助整理 BDSM 界線、理解知情同意並準備界線溝通的私人筆記本。',
    routes: {
      entry: {
        title: '開始使用 Boundary Notes｜BDSM 界線整理筆記本',
        description: '選擇語言並從既有前導開始使用 Boundary Notes，再以私密筆記本整理 BDSM 界線，為更清楚的知情同意對話做準備。',
      },
      about: {
        title: '關於 Boundary Notes｜知情同意與界線溝通',
        description: '了解 Boundary Notes 如何協助私人整理、知情同意與界線溝通；不做配對、不推薦項目，也不替使用者分類角色。',
      },
      terms: {
        title: '使用條款 | Boundary Notes',
        description: '閱讀 Boundary Notes 的筆記本用途、使用責任、分享限制與知情同意提醒。',
      },
      privacy: {
        title: '隱私權政策 | Boundary Notes',
        description: '了解 Boundary Notes 在裝置上保存哪些資料、何時資料會進入雲端、匿名分析如何運作，以及你擁有的選擇。',
      },
    },
  },
  'zh-Hans': {
    locale: 'zh_CN',
    imageAlt: 'Boundary Notes 品牌分享图：白兔坐在协助整理界限沟通的私人笔记旁。',
    privateTitle: 'Boundary Notes｜温柔的界限沟通笔记本',
    privateDescription: '协助整理 BDSM 界限、理解知情同意并准备界限沟通的私人笔记本。',
    routes: {
      entry: {
        title: '开始使用 Boundary Notes｜BDSM 界限整理笔记本',
        description: '选择语言并从现有前导开始使用 Boundary Notes，再以私密笔记本整理 BDSM 界限，为更清楚的知情同意对话做准备。',
      },
      about: {
        title: '关于 Boundary Notes｜知情同意与界限沟通',
        description: '了解 Boundary Notes 如何协助私人整理、知情同意与界限沟通；不做配对、不推荐项目，也不替用户分类角色。',
      },
      terms: {
        title: '使用条款 | Boundary Notes',
        description: '阅读 Boundary Notes 的笔记本用途、使用责任、分享限制与知情同意提醒。',
      },
      privacy: {
        title: '隐私政策 | Boundary Notes',
        description: '了解 Boundary Notes 在设备上保存哪些数据、何时数据会进入云端、匿名分析如何运作，以及你拥有的选择。',
      },
    },
  },
  ja: {
    locale: 'ja_JP',
    imageAlt: 'Boundary Notes のシェア画像。境界線の対話を整理するノートのそばに白いうさぎが座っています。',
    privateTitle: 'Boundary Notes｜やさしい境界線コミュニケーションノート',
    privateDescription: 'BDSM の境界線、インフォームド・コンセント、より明確な対話を考えるためのプライベートなノートです。',
    routes: {
      entry: {
        title: 'Boundary Notesを始める｜BDSMの境界線を考えるノート',
        description: '言語を選び、既存の導入から Boundary Notes を始めます。BDSM の境界線を振り返り、インフォームド・コンセントの対話を準備するためのプライベートなノートです。',
      },
      about: {
        title: 'Boundary Notesについて｜同意と境界線の対話',
        description: 'Boundary Notes が、マッチングや役割判定をせずに、個人の振り返り、インフォームド・コンセント、境界線の対話をどう支えるか紹介します。',
      },
      terms: {
        title: '利用規約 | Boundary Notes',
        description: 'Boundary Notes の用途、利用上の責任、共有の制限、同意に関する重要な注意事項をご確認ください。',
      },
      privacy: {
        title: 'プライバシーポリシー | Boundary Notes',
        description: '端末に保存される情報、クラウドに送られる場合、匿名分析の仕組み、利用者が選べることをご確認ください。',
      },
    },
  },
};

function isPublicSeoRouteId(value: unknown): value is PublicSeoRouteId {
  return typeof value === 'string' && publicSeoRouteIds.includes(value as PublicSeoRouteId);
}

function absoluteRouteUrl(routeId: AppRouteId, locale: AppLocale): string {
  return `${canonicalOrigin}${getLocalizedRoutePath(routeId, locale)}`;
}

function absolutePublicRouteUrl(routeId: PublicSeoRouteId, locale: AppLocale): string {
  if (routeId === 'entry') {
    return `${canonicalOrigin}/${toLocalePathSegment(locale)}`;
  }

  return absoluteRouteUrl(routeId, locale);
}

function getImageUrl(locale: AppLocale): string {
  const suffix: Record<AppLocale, string> = {
    en: 'en',
    'zh-Hant': 'zh-hant',
    'zh-Hans': 'zh-hans',
    ja: 'ja',
  };
  return `${canonicalOrigin}/seo/boundary-notes-${suffix[locale]}.png`;
}

export function getSeoDocument(
  routeName: unknown,
  locale: AppLocale,
  publicIndexing: boolean,
): SeoDocument {
  const copy = seoCopy[locale] ?? seoCopy.en;
  const publicRoute = isPublicSeoRouteId(routeName) ? routeName : null;
  const canonical = publicRoute ? absolutePublicRouteUrl(publicRoute, locale) : null;
  const title = publicRoute ? copy.routes[publicRoute].title : copy.privateTitle;
  const description = publicRoute ? copy.routes[publicRoute].description : copy.privateDescription;
  const robots = publicRoute && publicIndexing
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, nofollow, noarchive';
  const alternates = publicRoute
    ? (Object.keys(localeHreflang) as AppLocale[]).map((alternateLocale) => ({
        hreflang: localeHreflang[alternateLocale],
        href: absolutePublicRouteUrl(publicRoute, alternateLocale),
      })).concat({ hreflang: 'x-default', href: absolutePublicRouteUrl(publicRoute, 'en') })
    : [];
  const url = canonical ?? absolutePublicRouteUrl('entry', locale);
  const jsonLd = publicRoute
    ? {
        '@context': 'https://schema.org',
        '@type': publicRoute === 'entry' ? 'WebApplication' : 'WebPage',
        name: title,
        description,
        url,
        inLanguage: localeHreflang[locale],
        isPartOf: {
          '@type': 'WebSite',
          name: 'Boundary Notes',
          url: canonicalOrigin,
        },
        ...(publicRoute === 'entry' ? {
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        } : {}),
      }
    : null;

  return {
    alternates,
    canonical,
    description,
    image: getImageUrl(locale),
    imageAlt: copy.imageAlt,
    jsonLd,
    lang: locale,
    ogLocale: copy.locale,
    robots,
    title,
    url,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#039;');
}

export function createSeoHeadHtml(seo: SeoDocument): string {
  const meta = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta name="robots" content="${seo.robots}">`,
    `<meta name="googlebot" content="${seo.robots}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Boundary Notes">',
    `<meta property="og:locale" content="${seo.ogLocale}">`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${seo.url}">`,
    `<meta property="og:image" content="${seo.image}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="twitter:image" content="${seo.image}">`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}">`,
  ];

  if (seo.canonical) {
    meta.push(`<link rel="canonical" href="${seo.canonical}" data-seo-link="true">`);
  }

  for (const alternate of seo.alternates) {
    meta.push(`<link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" data-seo-link="true">`);
  }

  if (seo.jsonLd) {
    meta.push(`<script type="application/ld+json" data-seo-json-ld="true">${JSON.stringify(seo.jsonLd).replace(/</gu, '\\u003c')}</script>`);
  }

  return meta.join('\n    ');
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }

  element.content = content;
  element.dataset.seoManaged = 'true';
}

export function applySeoDocument(seo: SeoDocument): void {
  if (typeof document === 'undefined') return;

  document.documentElement.lang = seo.lang;
  document.title = seo.title;
  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', seo.robots);
  upsertMeta('name', 'googlebot', seo.robots);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', 'Boundary Notes');
  upsertMeta('property', 'og:locale', seo.ogLocale);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:url', seo.url);
  upsertMeta('property', 'og:image', seo.image);
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');
  upsertMeta('property', 'og:image:alt', seo.imageAlt);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', seo.image);
  upsertMeta('name', 'twitter:image:alt', seo.imageAlt);

  document.head.querySelectorAll('[data-seo-link], [data-seo-json-ld]').forEach((element) => element.remove());

  if (seo.canonical) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = seo.canonical;
    canonical.dataset.seoLink = 'true';
    document.head.append(canonical);
  }

  for (const alternate of seo.alternates) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = alternate.hreflang;
    link.href = alternate.href;
    link.dataset.seoLink = 'true';
    document.head.append(link);
  }

  if (seo.jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(seo.jsonLd);
    script.dataset.seoJsonLd = 'true';
    document.head.append(script);
  }
}

export function normalizeSeoRouteName(value: unknown): AppRouteId | null {
  return isAppRouteId(value) && appRouteIds.includes(value) ? value : null;
}
