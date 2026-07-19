import { describe, expect, it } from 'vitest';
import {
  fitWrappedText,
  getShareImageFontFamily,
  getShareImageFontRange,
  layoutStackedText,
  shareImageOutputSize,
  wrapTextToWidth,
  type TextMeasurer,
  type TextStyle,
} from './shareImageLayout';

const measurer: TextMeasurer = {
  measure(value: string, style: TextStyle) {
    const glyphWidth = Array.from(value).reduce((width, character) => {
      if (/\s/u.test(character)) return width + style.fontSize * 0.34;
      if (/[\x00-\x7F]/u.test(character)) return width + style.fontSize * 0.6;
      return width + style.fontSize;
    }, 0);
    return glyphWidth + Math.max(0, Array.from(value).length - 1)
      * (style.letterSpacing ?? 0);
  },
};

describe('share image text layout', () => {
  it('輸出維持兼顧閱讀與生成成本的 1200 × 1600', () => {
    expect(shareImageOutputSize).toEqual({ height: 1600, width: 1200 });
  });

  it('各語系分享圖沿用網頁指定的優先字體', () => {
    expect(getShareImageFontFamily('zh-Hant')).toMatch(/^"?Huninn/);
    expect(getShareImageFontFamily('en')).toMatch(/^"?Huninn/);
    expect(getShareImageFontFamily('zh-Hans')).toMatch(/^"?Noto Sans SC/);
    expect(getShareImageFontFamily('ja')).toMatch(/^"?Noto Sans JP/);
  });

  it('CJK 小字保留比英文更高的辨識下限，不被英文長度綁定', () => {
    for (const locale of ['zh-Hant', 'zh-Hans', 'ja'] as const) {
      expect(getShareImageFontRange(locale, 'spotlightDescription').minimumFontSize)
        .toBeGreaterThan(getShareImageFontRange('en', 'spotlightDescription').minimumFontSize);
      expect(getShareImageFontRange(locale, 'warning').minimumFontSize)
        .toBeGreaterThan(getShareImageFontRange('en', 'warning').minimumFontSize);
    }
  });

  it('繁中分類與警語在最小適應尺寸仍高於原有小字門檻', () => {
    expect(getShareImageFontRange('zh-Hant', 'categoryTitle').minimumFontSize).toBe(17);
    expect(getShareImageFontRange('zh-Hant', 'categoryPreference').minimumFontSize).toBe(16);
    expect(getShareImageFontRange('zh-Hant', 'warning').minimumFontSize).toBe(19);
  });

  it('英文焦點描述只在兩行放不下時才擴充成三行', () => {
    const value = 'Receive services that meet your everyday needs or desires';
    const fontRange = getShareImageFontRange('en', 'spotlightDescription');
    const compact = fitWrappedText(value, {
      lineHeightRatio: 1.2,
      maxHeight: 44,
      maxLines: 2,
      maxWidth: 186,
      ...fontRange,
      weight: 400,
    }, 'en', measurer);
    const expanded = fitWrappedText(value, {
      lineHeightRatio: 1.2,
      maxHeight: 60,
      maxLines: 3,
      maxWidth: 186,
      ...fontRange,
      weight: 400,
    }, 'en', measurer);

    expect(compact.truncated).toBe(true);
    expect(expanded.truncated).toBe(false);
    expect(expanded.lines).toHaveLength(3);
  });

  it.each([
    ['zh-Hant', '自己扮演獸或寵物相關的項目'],
    ['zh-Hans', '自己扮演动物或宠物'],
    ['ja', '自分が動物やペットの役を演じる'],
    ['en', 'Receive services that meet your everyday needs or desires'],
  ] as const)('%s 焦點描述依自身字寬在最多三行內完整適應', (locale, value) => {
    const fontRange = getShareImageFontRange(locale, 'spotlightDescription');
    const compact = fitWrappedText(value, {
      lineHeightRatio: 1.2,
      maxHeight: 44,
      maxLines: 2,
      maxWidth: 186,
      ...fontRange,
      weight: 400,
    }, locale, measurer);
    const layout = compact.truncated
      ? fitWrappedText(value, {
        lineHeightRatio: 1.2,
        maxHeight: 60,
        maxLines: 3,
        maxWidth: 186,
        ...fontRange,
        weight: 400,
      }, locale, measurer)
      : compact;

    expect(layout.truncated).toBe(false);
    expect(layout.fontSize).toBeGreaterThanOrEqual(fontRange.minimumFontSize);
    expect(layout.lines.length).toBeGreaterThan(0);
    expect(layout.lines.length).toBeLessThanOrEqual(3);
    expect(layout.lines.every((line) => measurer.measure(line, {
      fontSize: layout.fontSize,
      weight: 400,
    }) <= 186)).toBe(true);
  });

  it.each([
    ['zh-Hant', '獸/寵物化類項目'],
    ['zh-Hans', '兽化／宠物化类项目'],
    ['ja', 'アニマル／ペットプレイ'],
    ['en', 'Animal and pet play'],
  ] as const)('%s 分類標題依指定字型寬度保留完整內容', (locale, value) => {
    const fontRange = getShareImageFontRange(locale, 'categoryTitle');
    const layout = fitWrappedText(value, {
      lineHeightRatio: 1.12,
      maxLines: 2,
      maxWidth: 155,
      ...fontRange,
      weight: 500,
    }, locale, measurer);

    expect(layout.truncated).toBe(false);
    expect(layout.lines.join('').replace(/\s+/gu, '')).toBe(value.replace(/\s+/gu, ''));
    expect(layout.lines.every((line) => measurer.measure(line, {
      fontSize: layout.fontSize,
      weight: 500,
    }) <= 155)).toBe(true);
  });

  it('英文未回答短標籤可完整顯示，不需要省略號', () => {
    const layout = fitWrappedText('Not answered', {
      lineHeightRatio: 1.15,
      maxLines: 1,
      maxWidth: 155,
      ...getShareImageFontRange('en', 'categoryPreference'),
    }, 'en', measurer);

    expect(layout.truncated).toBe(false);
    expect(layout.lines).toEqual(['Not answered']);
  });

  it('完整保留嵌入 32 個全形字元的最大名稱標題', () => {
    const value = `${'界'.repeat(32)}的祕密檔案`;
    const layout = fitWrappedText(value, {
      lineHeightRatio: 1.08,
      maxHeight: 80,
      maxLines: 2,
      maxWidth: 784,
      minimumFontSize: 34,
      preferredFontSize: 53,
      weight: 500,
    }, 'zh-Hant', measurer);

    expect(layout.truncated).toBe(false);
    expect(layout.lines).toHaveLength(2);
    expect(layout.lines.join('')).toBe(value);
    expect(layout.height).toBeLessThanOrEqual(80);
    expect(layout.lines.every((line) => measurer.measure(line, {
      fontSize: layout.fontSize,
      weight: 500,
    }) <= 784)).toBe(true);
  });

  it('可拆分沒有空白的極長英文內容，且每行都留在寬度內', () => {
    const value = 'W'.repeat(64);
    const style = { fontSize: 14, weight: 500 };
    const lines = wrapTextToWidth(value, 155, style, 'en', measurer);

    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join('')).toBe(value);
    expect(lines.every((line) => measurer.measure(line, style) <= 155)).toBe(true);
  });

  it('日文換行不會讓分隔標點懸掛在新行開頭', () => {
    const lines = wrapTextToWidth(
      'スパンキング／パドル',
      102,
      { fontSize: 17, weight: 500 },
      'ja',
      measurer,
    );

    expect(lines.length).toBeGreaterThan(1);
    expect(lines.some((line) => line.startsWith('／'))).toBe(false);
    expect(lines.join('')).toBe('スパンキング／パドル');
  });

  it('分類標題會優先使用語意斷點，避免尾行只剩孤字', () => {
    const layout = fitWrappedText('スパンキング／パドル', {
      lineHeightRatio: 1.12,
      maxLines: 2,
      maxWidth: 155,
      minimumFontSize: 13,
      preferredFontSize: 17,
      weight: 500,
    }, 'ja', measurer);

    expect(layout.lines).toEqual(['スパンキング／', 'パドル']);
    expect(layout.lines[1]?.length).toBeGreaterThan(1);
  });

  it('斜線前只有單一字時不會把短前綴孤立成一行', () => {
    const layout = fitWrappedText('獸/寵物化類項目', {
      lineHeightRatio: 1.12,
      maxLines: 2,
      maxWidth: 155,
      minimumFontSize: 17,
      preferredFontSize: 21,
      weight: 500,
    }, 'zh-Hant', measurer);

    expect(layout.lines).toEqual(['獸/寵物', '化類項目']);
  });

  it.each([
    ['單行標題', '鞭打ち'],
    ['雙行標題', 'スパンキング／パドル'],
  ])('%s 與喜好列維持固定間距，並一起對齊卡片中心', (_, title) => {
    const layout = layoutStackedText(title, {
      lineHeightRatio: 1.12,
      maxLines: 2,
      maxWidth: 155,
      minimumFontSize: 13,
      preferredFontSize: 17,
      weight: 500,
    }, 30, 5, 8, 78, 'ja', measurer);

    expect(layout.secondaryTop - (layout.titleTop + layout.title.height)).toBe(5);
    expect(layout.contentTop + layout.contentHeight / 2).toBe(47);
    expect(layout.contentTop).toBeGreaterThanOrEqual(8);
    expect(layout.contentTop + layout.contentHeight).toBeLessThanOrEqual(86);
  });

  it('焦點小卡的標題與描述會以整個文字群置中且不互相重疊', () => {
    const layout = layoutStackedText('A very long spotlight preference title', {
      lineHeightRatio: 1.1,
      maxLines: 3,
      maxWidth: 170,
      minimumFontSize: 12,
      preferredFontSize: 21,
      weight: 500,
    }, 30, 5, 13, 102, 'en', measurer);

    expect(layout.secondaryTop - (layout.titleTop + layout.title.height)).toBe(5);
    expect(layout.contentTop + layout.contentHeight / 2).toBe(64);
    expect(layout.contentTop).toBeGreaterThanOrEqual(13);
    expect(layout.contentTop + layout.contentHeight).toBeLessThanOrEqual(115);
  });

  it('最大名稱嵌入警語後仍能完整留在警語區塊', () => {
    const name = '界'.repeat(32);
    const warning = `這份測驗結果僅供參考，並無法完整的描述${name}的喜好或特質，也請勿用來替代任何必要的溝通。面對擁有風險的項目，互動時也請注意安全。`;
    const layout = fitWrappedText(warning, {
      lineHeightRatio: 1.3,
      maxHeight: 100,
      maxLines: 4,
      maxWidth: 744,
      ...getShareImageFontRange('zh-Hant', 'warning'),
    }, 'zh-Hant', measurer);

    expect(layout.truncated).toBe(false);
    expect(layout.fontSize).toBeGreaterThanOrEqual(19);
    expect(layout.height).toBeLessThanOrEqual(100);
    expect(layout.lines.every((line) => measurer.measure(line, {
      fontSize: layout.fontSize,
    }) <= 744)).toBe(true);
  });
});
