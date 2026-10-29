import { describe, expect, it } from 'vitest';
import { resolveBrowserLocale, resolveInitialLocale } from './index';

describe('initial locale resolution', () => {
  it('preserves an existing viewer locale for a cloud share entry', () => {
    expect(resolveInitialLocale('ja', 'zh-Hant', true)).toBe('zh-Hant');
  });

  it('uses the cloud share URL locale when the viewer has no stored locale', () => {
    expect(resolveInitialLocale('ja', null, true)).toBe('ja');
  });

  it('keeps URL locale priority for ordinary localized routes', () => {
    expect(resolveInitialLocale('ja', 'zh-Hant', false)).toBe('ja');
  });

  it('uses English when neither source can identify a locale', () => {
    expect(resolveInitialLocale(null, null, false)).toBe('en');
  });

  it('uses the first supported browser language for an unlocalized first visit', () => {
    const browserLocale = resolveBrowserLocale(['zh-TW', 'zh', 'en-US', 'en']);

    expect(browserLocale).toBe('zh-Hant');
    expect(resolveInitialLocale(null, null, false, browserLocale)).toBe('zh-Hant');
  });

  it('keeps an already stored locale ahead of browser preferences on root entry', () => {
    const browserLocale = resolveBrowserLocale(['zh-TW', 'zh', 'en-US', 'en']);

    expect(resolveInitialLocale(null, 'en', false, browserLocale)).toBe('en');
  });
});
