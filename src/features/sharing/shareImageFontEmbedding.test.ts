import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmbeddedShareImageFontStyle } from './shareImageFontEmbedding';

describe('share image font embedding', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('只嵌入目前語系與實際字元需要的 WOFF2 區段', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(`
        @font-face { font-family: 'Huninn'; src: url(https://fonts.gstatic.com/huninn-latin.woff2) format('woff2'); unicode-range: U+0000-00FF; }
        @font-face { font-family: 'Huninn'; src: url(https://fonts.gstatic.com/huninn-cjk.woff2) format('woff2'); unicode-range: U+4E00-9FFF; }
        @font-face { font-family: 'Noto Sans JP'; src: url(https://fonts.gstatic.com/noto-jp.woff2) format('woff2'); unicode-range: U+4E00-9FFF; }
      `))
      .mockResolvedValueOnce(new Response(new Blob(['latin-font'], { type: 'font/woff2' })))
      .mockResolvedValueOnce(new Response(new Blob(['cjk-font'], { type: 'font/woff2' })));

    const style = await createEmbeddedShareImageFontStyle(
      'zh-Hant',
      'Boundary 檔案',
      'https://fonts.googleapis.com/css2?family=Huninn',
    );

    expect(style).toContain("font-family: 'Huninn'");
    expect(style).toContain('data:font/woff2;base64,');
    expect(style).toContain('font-display: block');
    expect(style).not.toContain('font-display: swap');
    expect(style).not.toContain('Noto Sans JP');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('遠端字型不可用時保留空樣式，讓既有系統字型 fallback 接手', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('offline'));

    await expect(createEmbeddedShareImageFontStyle(
      'zh-Hant',
      '祕密檔案',
      'https://fonts.googleapis.com/css2?family=Huninn',
    ))
      .resolves.toBe('');
  });

  it('單一 WOFF2 分段失敗時仍保留其他已載入分段', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(`
        @font-face { font-family: 'Huninn'; src: url(https://fonts.gstatic.com/huninn-latin-ok.woff2) format('woff2'); unicode-range: U+0000-00FF; }
        @font-face { font-family: 'Huninn'; src: url(https://fonts.gstatic.com/huninn-cjk-failed.woff2) format('woff2'); unicode-range: U+4E00-9FFF; }
      `))
      .mockResolvedValueOnce(new Response(new Blob(['latin-font'], { type: 'font/woff2' })))
      .mockRejectedValueOnce(new Error('font segment unavailable'));

    const style = await createEmbeddedShareImageFontStyle(
      'zh-Hant',
      'Boundary 檔案',
      'https://fonts.googleapis.com/css2?family=Huninn',
    );

    expect(style).toContain('data:font/woff2;base64,');
    expect(style).not.toContain('huninn-cjk-failed.woff2');
  });
});
