import type { AppLocale } from '../../app/i18n';

export const shareImageFontFamily = 'Microsoft JhengHei, Meiryo, Arial, sans-serif';
export const shareImageOutputSize = { height: 1600, width: 1200 } as const;

export interface TextStyle {
  fontSize: number;
  letterSpacing?: number;
  weight?: number;
}

export interface TextMeasurer {
  measure(value: string, style: TextStyle): number;
}

export interface TextLayout {
  fontSize: number;
  height: number;
  lineHeight: number;
  lines: string[];
  truncated: boolean;
  width: number;
}

export interface FitTextOptions {
  lineHeightRatio?: number;
  maxHeight?: number;
  maxLines: number;
  maxWidth: number;
  minimumFontSize: number;
  preferredFontSize: number;
  weight?: number;
}

export interface StackedTextLayout {
  contentHeight: number;
  contentTop: number;
  secondaryHeight: number;
  secondaryTop: number;
  title: TextLayout;
  titleTop: number;
}

const forbiddenLineStart = /^[!%),.:;?\]}、。，．！？：；）］｝〕〉》」』】〗〙〛’”〞々ー～〜…・／]/u;
const forbiddenLineEnd = /[([{（［｛〔〈《「『【〖〘〚‘“]$/u;

interface GraphemeSegmenter {
  segment(value: string): Iterable<{ segment: string }>;
}

type GraphemeSegmenterConstructor = new (
  locale: string,
  options: { granularity: 'grapheme' },
) => GraphemeSegmenter;

function graphemes(value: string, locale: AppLocale): string[] {
  const Segmenter = (Intl as unknown as {
    Segmenter?: GraphemeSegmenterConstructor;
  }).Segmenter;
  if (typeof Segmenter === 'function') {
    return Array.from(
      new Segmenter(locale, { granularity: 'grapheme' }).segment(value),
      (part) => part.segment,
    );
  }
  return Array.from(value);
}

function styleFor(fontSize: number, weight = 400): TextStyle {
  return { fontSize, weight };
}

function trimLine(value: string): string {
  return value.trim().replace(/\s+/gu, ' ');
}

function wrapGraphemes(
  value: string,
  maxWidth: number,
  style: TextStyle,
  locale: AppLocale,
  measurer: TextMeasurer,
): string[] {
  const units = graphemes(value, locale);
  const lines: string[] = [];
  let start = 0;

  while (start < units.length) {
    let end = start;
    let lastFit = start;

    while (end < units.length) {
      const candidate = trimLine(units.slice(start, end + 1).join(''));
      if (candidate && measurer.measure(candidate, style) > maxWidth) break;
      lastFit = end + 1;
      end += 1;
    }

    if (lastFit === start) lastFit = start + 1;
    let breakAt = lastFit;

    if (
      breakAt < units.length
      && forbiddenLineStart.test(units[breakAt] ?? '')
      && breakAt - start > 1
    ) {
      breakAt -= 1;
    }
    if (
      breakAt - start > 1
      && forbiddenLineEnd.test(units[breakAt - 1] ?? '')
    ) {
      breakAt -= 1;
    }

    const line = trimLine(units.slice(start, breakAt).join(''));
    if (line) lines.push(line);
    start = breakAt;
    while (/^\s$/u.test(units[start] ?? '')) start += 1;
  }

  return lines;
}

function wrapEnglish(
  value: string,
  maxWidth: number,
  style: TextStyle,
  locale: AppLocale,
  measurer: TextMeasurer,
): string[] {
  const words = value.trim().split(/\s+/u).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measurer.measure(candidate, style) <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) {
      lines.push(line);
      line = '';
    }
    if (measurer.measure(word, style) <= maxWidth) {
      line = word;
      continue;
    }

    const chunks = wrapGraphemes(word, maxWidth, style, locale, measurer);
    lines.push(...chunks.slice(0, -1));
    line = chunks[chunks.length - 1] ?? '';
  }

  if (line) lines.push(line);
  return lines;
}

function balancedLineUnits(value: string, locale: AppLocale, lineCount: number): {
  joiner: string;
  units: string[];
} {
  if (locale === 'en') {
    const words = value.trim().split(/\s+/u).filter(Boolean);
    if (words.length >= lineCount) return { joiner: ' ', units: words };
  }
  return { joiner: '', units: graphemes(value.trim(), locale) };
}

function balanceWrappedLines(
  value: string,
  lineCount: number,
  maxWidth: number,
  style: TextStyle,
  locale: AppLocale,
  measurer: TextMeasurer,
): string[] | null {
  if (lineCount <= 1 || value.includes('\n')) return null;
  const { joiner, units } = balancedLineUnits(value, locale, lineCount);
  if (units.length < lineCount) return null;
  const memo = new Map<string, { cost: number; lines: string[] } | null>();

  function findBest(start: number, remainingLines: number): {
    cost: number;
    lines: string[];
  } | null {
    const key = `${start}:${remainingLines}`;
    if (memo.has(key)) return memo.get(key) ?? null;
    if (remainingLines === 1) {
      const line = units.slice(start).join(joiner);
      const width = measurer.measure(line, style);
      const result = width <= maxWidth
        ? { cost: (maxWidth - width) ** 2, lines: [line] }
        : null;
      memo.set(key, result);
      return result;
    }

    let best: { cost: number; lines: string[] } | null = null;
    const maximumEnd = units.length - remainingLines + 1;
    for (let end = start + 1; end <= maximumEnd; end += 1) {
      const line = units.slice(start, end).join(joiner);
      const width = measurer.measure(line, style);
      if (width > maxWidth) break;
      if (forbiddenLineEnd.test(line) || forbiddenLineStart.test(units[end] ?? '')) continue;

      const remainder = findBest(end, remainingLines - 1);
      if (!remainder) continue;
      const semanticBreakBonus = /[&/・／]$/u.test(line) ? maxWidth ** 2 * 0.4 : 0;
      const cost = (maxWidth - width) ** 2 - semanticBreakBonus + remainder.cost;
      if (!best || cost < best.cost) {
        best = { cost, lines: [line, ...remainder.lines] };
      }
    }
    memo.set(key, best);
    return best;
  }

  return findBest(0, lineCount)?.lines ?? null;
}

export function createCanvasTextMeasurer(): TextMeasurer {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas text measurement is unavailable.');
  const widthCache = new Map<string, number>();
  let activeFont = '';

  return {
    measure(value, style) {
      const weight = style.weight ?? 400;
      const letterSpacing = style.letterSpacing ?? 0;
      const font = `${weight} ${style.fontSize}px "Microsoft JhengHei", Meiryo, Arial, sans-serif`;
      const cacheKey = `${font}|${letterSpacing}|${value}`;
      const cached = widthCache.get(cacheKey);
      if (cached !== undefined) return cached;
      if (activeFont !== font) {
        context.font = font;
        activeFont = font;
      }
      const spacing = letterSpacing === 0
        ? 0
        : Math.max(0, graphemes(value, 'en').length - 1) * letterSpacing;
      const width = context.measureText(value).width + spacing;
      widthCache.set(cacheKey, width);
      return width;
    },
  };
}

export function wrapTextToWidth(
  value: string,
  maxWidth: number,
  style: TextStyle,
  locale: AppLocale,
  measurer: TextMeasurer,
): string[] {
  const paragraphs = value.replace(/\r\n?/gu, '\n').split('\n');
  const lines = paragraphs.flatMap((paragraph) => {
    const normalized = trimLine(paragraph);
    if (!normalized) return [''];
    return locale === 'en'
      ? wrapEnglish(normalized, maxWidth, style, locale, measurer)
      : wrapGraphemes(normalized, maxWidth, style, locale, measurer);
  });
  return lines.length ? lines : [''];
}

export function truncateTextToWidth(
  value: string,
  maxWidth: number,
  style: TextStyle,
  locale: AppLocale,
  measurer: TextMeasurer,
): string {
  const ellipsis = '…';
  const units = graphemes(value.replace(/…+$/u, '').trimEnd(), locale);
  while (units.length && measurer.measure(`${units.join('')}${ellipsis}`, style) > maxWidth) {
    units.pop();
  }
  return `${units.join('').trimEnd()}${ellipsis}`;
}

function createTextLayout(
  lines: string[],
  fontSize: number,
  lineHeight: number,
  truncated: boolean,
  style: TextStyle,
  measurer: TextMeasurer,
): TextLayout {
  return {
    fontSize,
    height: lines.length * lineHeight,
    lineHeight,
    lines,
    truncated,
    width: Math.max(0, ...lines.map((line) => measurer.measure(line, style))),
  };
}

export function fitWrappedText(
  value: string,
  options: FitTextOptions,
  locale: AppLocale,
  measurer: TextMeasurer,
): TextLayout {
  const {
    lineHeightRatio = 1.18,
    maxHeight = Number.POSITIVE_INFINITY,
    maxLines,
    maxWidth,
    minimumFontSize,
    preferredFontSize,
    weight = 400,
  } = options;

  for (let fontSize = preferredFontSize; fontSize >= minimumFontSize; fontSize -= 1) {
    const style = styleFor(fontSize, weight);
    const wrappedLines = wrapTextToWidth(value, maxWidth, style, locale, measurer);
    const lineHeight = Math.ceil(fontSize * lineHeightRatio);
    if (wrappedLines.length <= maxLines && wrappedLines.length * lineHeight <= maxHeight) {
      const lines = balanceWrappedLines(
        value,
        wrappedLines.length,
        maxWidth,
        style,
        locale,
        measurer,
      ) ?? wrappedLines;
      return createTextLayout(lines, fontSize, lineHeight, false, style, measurer);
    }
  }

  const fontSize = minimumFontSize;
  const style = styleFor(fontSize, weight);
  const lineHeight = Math.ceil(fontSize * lineHeightRatio);
  const heightLimitedLines = Math.max(1, Math.floor(maxHeight / lineHeight));
  const visibleLineCount = Math.min(maxLines, heightLimitedLines);
  const wrapped = wrapTextToWidth(value, maxWidth, style, locale, measurer);
  const lines = wrapped.slice(0, visibleLineCount);
  const truncated = wrapped.length > visibleLineCount;
  if (truncated) {
    lines[visibleLineCount - 1] = truncateTextToWidth(
      lines[visibleLineCount - 1] ?? '',
      maxWidth,
      style,
      locale,
      measurer,
    );
  }
  return createTextLayout(lines, fontSize, lineHeight, truncated, style, measurer);
}

export function layoutStackedText(
  title: string,
  titleOptions: FitTextOptions,
  secondaryHeight: number,
  gap: number,
  areaTop: number,
  areaHeight: number,
  locale: AppLocale,
  measurer: TextMeasurer,
): StackedTextLayout {
  let titleLayout = fitWrappedText(title, titleOptions, locale, measurer);
  let contentHeight = titleLayout.height + gap + secondaryHeight;

  if (contentHeight > areaHeight && titleLayout.fontSize > titleOptions.minimumFontSize) {
    titleLayout = fitWrappedText(title, {
      ...titleOptions,
      maxHeight: Math.max(1, areaHeight - gap - secondaryHeight),
      preferredFontSize: titleLayout.fontSize - 1,
    }, locale, measurer);
    contentHeight = titleLayout.height + gap + secondaryHeight;
  }

  const contentTop = areaTop + Math.max(0, (areaHeight - contentHeight) / 2);
  return {
    contentHeight,
    contentTop,
    secondaryHeight,
    secondaryTop: contentTop + titleLayout.height + gap,
    title: titleLayout,
    titleTop: contentTop,
  };
}
