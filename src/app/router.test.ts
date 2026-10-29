import { describe, expect, it } from 'vitest';
import { createMemoryHistory } from 'vue-router';
import { resolveBrowserLocale } from './i18n';
import { createAppRouter } from './router';

async function navigate(
  path: string,
  entry: 'story' | 'home',
  locale: 'en' | 'zh-Hant' | 'zh-Hans' | 'ja',
) {
  const router = createAppRouter('/', entry, locale, createMemoryHistory('/'));
  await router.push(path);
  await router.isReady();
  return router.currentRoute.value;
}

describe('localized entry routing', () => {
  it('keeps the original first-time root flow and uses English as the fallback', async () => {
    const route = await navigate('/', 'story', 'en');
    expect(route.name).toBe('entry');
    expect(route.fullPath).toBe('/en');
  });

  it('resolves the root entry from browser languages when no locale is stored', async () => {
    const browserLocale = resolveBrowserLocale(['zh-TW', 'zh', 'en-US', 'en']);
    expect(browserLocale).toBe('zh-Hant');

    const route = await navigate('/', 'story', browserLocale ?? 'en');

    expect(route.name).toBe('entry');
    expect(route.fullPath).toBe('/zh-hant');
    expect(route.redirectedFrom?.name).toBe('rootEntry');
  });

  it('sends a returning root visit to Home in the stored locale', async () => {
    const route = await navigate('/', 'home', 'zh-Hant');
    expect(route.name).toBe('home');
    expect(route.fullPath).toBe('/zh-hant/home');
  });

  it('lets an explicit URL locale override the stored locale', async () => {
    const route = await navigate('/ja', 'home', 'zh-Hant');
    expect(route.name).toBe('home');
    expect(route.fullPath).toBe('/ja/home');
  });

  it('keeps the original first-time flow at a localized root', async () => {
    const route = await navigate('/ja', 'story', 'zh-Hant');
    expect(route.name).toBe('entry');
    expect(route.fullPath).toBe('/ja');
  });

  it('does not intercept an explicit intro replay for returning users', async () => {
    const route = await navigate('/ja/intro', 'home', 'zh-Hant');
    expect(route.name).toBe('story');
    expect(route.fullPath).toBe('/ja/intro');
  });

  it('preserves query and hash while localizing a legacy share URL', async () => {
    const route = await navigate(
      '/preview?file=public-share-id&source=cloud#results',
      'story',
      'zh-Hans',
    );
    expect(route.name).toBe('preview');
    expect(route.fullPath).toBe('/zh-hans/preview?file=public-share-id&source=cloud#results');
  });

  it('keeps a localized cloud share URL and its query stable', async () => {
    const route = await navigate(
      '/ja/preview?file=public-share-id&source=cloud',
      'story',
      'zh-Hant',
    );
    expect(route.name).toBe('preview');
    expect(route.fullPath).toBe('/ja/preview?file=public-share-id&source=cloud');
  });

  it('keeps direct localized app routes stable', async () => {
    const route = await navigate('/en/home', 'home', 'ja');
    expect(route.name).toBe('home');
    expect(route.fullPath).toBe('/en/home');
  });
});
