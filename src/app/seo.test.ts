import { describe, expect, it } from 'vitest';
import { createSeoHeadHtml, getSeoDocument } from './seo';

describe('SEO documents', () => {
  it('indexes only approved public routes in production', () => {
    const entry = getSeoDocument('entry', 'en', true);
    const preview = getSeoDocument('preview', 'en', true);

    expect(entry.robots).toContain('index, follow');
    expect(entry.canonical).toBe('https://boundarynotes.com/en');
    expect(entry.alternates).toHaveLength(5);
    expect(preview.robots).toBe('noindex, nofollow, noarchive');
    expect(preview.canonical).toBeNull();
    expect(preview.alternates).toEqual([]);
  });

  it('keeps every route noindex outside the production indexing build', () => {
    expect(getSeoDocument('entry', 'zh-Hant', false).robots).toBe(
      'noindex, nofollow, noarchive',
    );
    expect(getSeoDocument('about', 'ja', false).robots).toBe(
      'noindex, nofollow, noarchive',
    );
  });

  it('uses locale-specific public copy and an English fallback card path', () => {
    const zhHant = getSeoDocument('entry', 'zh-Hant', true);
    const unknownPrivate = getSeoDocument('preview', 'en', true);

    expect(zhHant.title).toContain('BDSM 界線');
    expect(zhHant.image.endsWith('/seo/boundary-notes-zh-hant.png')).toBe(true);
    expect(unknownPrivate.image.endsWith('/seo/boundary-notes-en.png')).toBe(true);
  });

  it('never serializes private identifiers into generic share metadata', () => {
    const head = createSeoHeadHtml(getSeoDocument('preview', 'ja', true));

    expect(head).not.toContain('file=');
    expect(head).not.toContain('source=');
    expect(head).not.toContain('public-share-id');
    expect(head).toContain('noindex, nofollow, noarchive');
  });

  it('marks prerendered canonical, alternate, and JSON-LD nodes for SPA replacement', () => {
    const head = createSeoHeadHtml(getSeoDocument('entry', 'en', true));

    expect(head.match(/data-seo-link="true"/gu)).toHaveLength(6);
    expect(head).toContain('data-seo-json-ld="true"');
  });

  it('presents the product as a notebook without making educational claims', () => {
    const locales = ['en', 'zh-Hant', 'zh-Hans', 'ja'] as const;
    const routeIds = ['entry', 'about', 'terms', 'privacy'] as const;

    for (const locale of locales) {
      for (const routeId of routeIds) {
        const head = createSeoHeadHtml(getSeoDocument(routeId, locale, true));

        expect(head).not.toMatch(/educational|education|教育/u);
        expect(head).not.toContain('EducationalApplication');
      }
    }

    expect(getSeoDocument('preview', 'en', true).title).toContain('Notebook');
    expect(getSeoDocument('preview', 'zh-Hant', true).title).toContain('筆記本');
    expect(getSeoDocument('preview', 'zh-Hans', true).title).toContain('笔记本');
    expect(getSeoDocument('preview', 'ja', true).title).toContain('ノート');
  });
});
