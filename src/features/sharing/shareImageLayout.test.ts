import { describe, expect, it } from 'vitest';
import {
  fitWrappedText,
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
      weight: 700,
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
      maxHeight: 88,
      maxLines: 4,
      maxWidth: 744,
      minimumFontSize: 14,
      preferredFontSize: 17,
    }, 'zh-Hant', measurer);

    expect(layout.truncated).toBe(false);
    expect(layout.height).toBeLessThanOrEqual(88);
    expect(layout.lines.every((line) => measurer.measure(line, {
      fontSize: layout.fontSize,
    }) <= 744)).toBe(true);
  });
});
