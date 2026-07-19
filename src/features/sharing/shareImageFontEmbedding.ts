import type { AppLocale } from '../../app/i18n';

const primaryFontFamily: Record<AppLocale, string> = {
  'zh-Hant': 'Huninn',
  'zh-Hans': 'Noto Sans SC',
  ja: 'Noto Sans JP',
  en: 'Huninn',
};

interface UnicodeRange {
  end: number;
  start: number;
}

function parseUnicodeRange(value: string): UnicodeRange | null {
  const normalized = value.trim().replace(/^U\+/iu, '');
  if (!normalized) return null;

  if (normalized.includes('?')) {
    const start = Number.parseInt(normalized.replace(/\?/gu, '0'), 16);
    const end = Number.parseInt(normalized.replace(/\?/gu, 'F'), 16);
    return Number.isNaN(start) || Number.isNaN(end) ? null : { end, start };
  }

  const [startValue, endValue = startValue] = normalized.split('-');
  const start = Number.parseInt(startValue, 16);
  const end = Number.parseInt(endValue, 16);
  return Number.isNaN(start) || Number.isNaN(end) ? null : { end, start };
}

function fontFaceCoversSample(fontFace: string, sampleCodePoints: Set<number>): boolean {
  const unicodeRange = fontFace.match(/unicode-range\s*:\s*([^;}]*)/iu)?.[1];
  if (!unicodeRange) return true;

  const ranges = unicodeRange
    .split(',')
    .map(parseUnicodeRange)
    .filter((range): range is UnicodeRange => range !== null);

  return [...sampleCodePoints].some((codePoint) => (
    ranges.some((range) => codePoint >= range.start && codePoint <= range.end)
  ));
}

function getFontStylesheetUrl(): string | null {
  if (typeof document === 'undefined') return null;
  const stylesheet = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]')]
    .find((link) => link.href.includes('fonts.googleapis.com/css2'));
  return stylesheet?.href ?? null;
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return `data:${blob.type || 'font/woff2'};base64,${btoa(binary)}`;
}

const fontDataUrlCache = new Map<string, Promise<string>>();

function loadFontDataUrl(url: string): Promise<string> {
  const cached = fontDataUrlCache.get(url);
  if (cached) return cached;

  const pending = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load share image font: ${response.status}`);
      return response.blob();
    })
    .then(blobToDataUrl);
  fontDataUrlCache.set(url, pending);
  void pending.catch(() => fontDataUrlCache.delete(url));
  return pending;
}

export async function createEmbeddedShareImageFontStyle(
  locale: AppLocale,
  sample: string,
  stylesheetUrl = getFontStylesheetUrl(),
): Promise<string> {
  if (!stylesheetUrl) return '';

  try {
    const response = await fetch(stylesheetUrl);
    if (!response.ok) return '';
    const stylesheet = await response.text();
    const family = primaryFontFamily[locale];
    const escapedFamily = family.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    const familyPattern = new RegExp(
      `font-family\\s*:\\s*['"]?${escapedFamily}['"]?\\s*;`,
      'iu',
    );
    const sampleCodePoints = new Set([...sample].map((character) => character.codePointAt(0) ?? 0));
    const fontFaces = stylesheet.match(/@font-face\s*\{[^}]*\}/giu) ?? [];
    const applicableFaces = fontFaces.filter((fontFace) => (
      familyPattern.test(fontFace) && fontFaceCoversSample(fontFace, sampleCodePoints)
    ));

    const embeddedFaces = await Promise.all(applicableFaces.map(async (fontFace) => {
      const fontUrl = fontFace.match(/url\((['"]?)(https?:\/\/[^)'"\s]+)\1\)/iu)?.[2];
      if (!fontUrl) return '';
      try {
        const dataUrl = await loadFontDataUrl(fontUrl);
        const embeddedFace = fontFace.replace(fontUrl, dataUrl);
        if (/font-display\s*:/iu.test(embeddedFace)) {
          return embeddedFace.replace(
            /font-display\s*:\s*[^;}]*(;?)/iu,
            'font-display: block$1',
          );
        }
        return embeddedFace.replace(/\}\s*$/u, 'font-display: block; }');
      } catch {
        return '';
      }
    }));

    const embeddedCss = embeddedFaces.filter(Boolean).join('\n');
    return embeddedCss ? `<style><![CDATA[${embeddedCss}]]></style>` : '';
  } catch {
    return '';
  }
}
