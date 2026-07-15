import QRCode from 'qrcode';
import secretArchiveBackgroundUrl from '../../assets/backgrounds/secret-archive-desktop.webp';
import type { AppLocale } from '../../app/i18n';
import {
  getCategoryQuestionId,
  getCategoryVisualUrl,
  getDetailQuestionId,
  type QuestionBank,
} from '../question-bank';
import type {
  AnsweredSecretFileAnswer,
  PreferenceAnswer,
  QuestionRole,
  SecretFile,
} from '../secret-file';
import type { QuestionnaireMessages } from '../questionnaire/messages';

const colors = {
  danger: '#eca2a2',
  gold: '#efc998',
  ink: '#fff5ed',
  line: '#76515a',
  muted: '#cdbcb5',
  paper: '#180d13',
  qrBackground: '#f4e7dc',
  qrInk: '#6f3442',
  rose: '#df9d9f',
} as const;

interface ExportMessages {
  brandLine: string;
  categoryTitle: string;
  date: (value: string) => string;
  hardNoKicker: string;
  hardNoSummary: (description: string, remainingCount: number) => string;
  preface: string;
  qrDomain: string;
  qrTitle: string;
  role: Record<QuestionRole, string>;
  spotlightEmpty: string;
  spotlightTitle: string;
  title: (name: string) => string;
  warning: (name: string) => string;
  warningFooter: string;
}

export interface ShareImageOptions {
  locale: AppLocale;
  questionBank: QuestionBank;
  questionnaireMessages: QuestionnaireMessages;
  role: QuestionRole;
  secretFile: SecretFile;
  shareUrl: string | null;
}

interface DisplayItem {
  categoryId: string;
  description: string;
  title: string;
}

interface CategorySummary {
  answer: AnsweredSecretFileAnswer | null;
  categoryId: string;
  title: string;
}

interface ShareImageModel {
  categories: CategorySummary[];
  hardNoDescriptions: string[];
  locale: AppLocale;
  messages: ExportMessages;
  profileName: string;
  questionnaireMessages: QuestionnaireMessages;
  role: QuestionRole;
  shareUrl: string | null;
  spotlight: DisplayItem[];
  updatedAt: string;
}

interface TextLayout {
  fontSize: number;
  lines: string[];
}

const exportMessages: Record<AppLocale, ExportMessages> = {
  'zh-Hant': {
    brandLine: '把界限留成一份好好閱讀的筆記',
    categoryTitle: '大分類的摘要',
    date: (value) => `最後編輯於 ${formatDate('zh-Hant', value)}`,
    hardNoKicker: '絕對禁止項目',
    hardNoSummary: (description, remainingCount) =>
      `${description}${remainingCount > 0 ? `與其他${remainingCount}個項目` : ''}`,
    preface: '閱讀前請留意',
    qrDomain: 'boundarynotes.com',
    qrTitle: '掃描查看完整檔案',
    role: { active: '主導側', passive: '配合側' },
    spotlightEmpty: '尚未設定焦點喜好',
    spotlightTitle: '焦點喜好',
    title: (name) => `${name}的祕密檔案`,
    warning: (name) => `這份測驗結果僅供參考，並無法完整的描述${name}的喜好或特質，也請勿用來替代任何必要的溝通。面對擁有風險的項目，互動時也請注意安全。`,
    warningFooter: '這份檔案是溝通的起點，不是同意書。',
  },
  'zh-Hans': {
    brandLine: '把界限留成一份方便阅读的笔记',
    categoryTitle: '大分类摘要',
    date: (value) => `最后编辑于 ${formatDate('zh-Hans', value)}`,
    hardNoKicker: '绝对禁止项目',
    hardNoSummary: (description, remainingCount) =>
      `${description}${remainingCount > 0 ? `及其他${remainingCount}个项目` : ''}`,
    preface: '阅读前请留意',
    qrDomain: 'boundarynotes.com',
    qrTitle: '扫码查看完整文件',
    role: { active: '主导侧', passive: '配合侧' },
    spotlightEmpty: '尚未设置焦点喜好',
    spotlightTitle: '焦点喜好',
    title: (name) => `${name}的秘密档案`,
    warning: (name) => `这份测试结果仅供参考，无法完整描述${name}的喜好或特质，也请勿用它代替任何必要的沟通。面对有风险的项目，互动时也请注意安全。`,
    warningFooter: '这份档案是沟通的起点，不是同意书。',
  },
  ja: {
    brandLine: '境界線を、落ち着いて読めるノートに',
    categoryTitle: '大カテゴリーの概要',
    date: (value) => `最終編集 ${formatDate('ja', value)}`,
    hardNoKicker: '絶対にしない項目',
    hardNoSummary: (description, remainingCount) =>
      `${description}${remainingCount > 0 ? `、ほか${remainingCount}項目` : ''}`,
    preface: '読む前に',
    qrDomain: 'boundarynotes.com',
    qrTitle: '完全版を開く',
    role: { active: 'リード側', passive: 'フォロー側' },
    spotlightEmpty: '注目してほしい好みは未設定です',
    spotlightTitle: '注目してほしい好み',
    title: (name) => `${name}の秘密ファイル`,
    warning: (name) => `この結果は参考情報にすぎず、${name}の好みや特性を完全に表すものではありません。必要な対話の代わりにはしないでください。リスクのある項目では、安全にも注意してください。`,
    warningFooter: 'このファイルは対話の出発点であり、同意書ではありません。',
  },
  en: {
    brandLine: 'A calm, readable note about boundaries',
    categoryTitle: 'Category summary',
    date: (value) => `Last edited ${formatDate('en', value)}`,
    hardNoKicker: 'Hard-no items',
    hardNoSummary: (description, remainingCount) => `${description}${remainingCount > 0
      ? ` and ${remainingCount} other ${remainingCount === 1 ? 'item' : 'items'}`
      : ''}`,
    preface: 'Before you read',
    qrDomain: 'boundarynotes.com',
    qrTitle: 'Scan for the full file',
    role: { active: 'Leading', passive: 'Following' },
    spotlightEmpty: 'No spotlight preferences selected',
    spotlightTitle: 'Spotlight preferences',
    title: (name) => `${name}'s Secret File`,
    warning: (name) => `This test result is only a reference. It cannot fully describe ${name}'s preferences or traits and must not replace any necessary communication. Please also pay attention to safety when an item carries risk.`,
    warningFooter: 'This file begins a conversation. It is not consent.',
  },
};

const assetDataUrlCache = new Map<string, Promise<string>>();

function formatDate(locale: AppLocale, value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
}

function getAnswer(
  secretFile: SecretFile,
  questionId: string,
): AnsweredSecretFileAnswer | null {
  const answer = secretFile.answers[questionId];
  return answer?.state === 'answered' ? answer : null;
}

function createDisplayModel(options: ShareImageOptions): ShareImageModel {
  const itemIndex = new Map<string, DisplayItem>();

  for (const category of options.questionBank.categories) {
    if (category.includeInCategoryRound) {
      itemIndex.set(getCategoryQuestionId(category.categoryId, options.role), {
        categoryId: category.categoryId,
        description: category.roles[options.role].description,
        title: category.name,
      });
    }

    for (const detail of category.detailItems) {
      itemIndex.set(getDetailQuestionId(category.categoryId, detail.detailId, options.role), {
        categoryId: category.categoryId,
        description: detail.roles[options.role].description,
        title: detail.roles[options.role].title,
      });
    }
  }

  const spotlight = options.secretFile.spotlight[options.role].selectedQuestionIds
    .map((questionId) => itemIndex.get(questionId))
    .filter((item): item is DisplayItem => item !== undefined)
    .slice(0, 5);
  const categories = options.questionBank.categories
    .filter((category) => category.includeInCategoryRound)
    .map((category) => ({
      answer: getAnswer(
        options.secretFile,
        getCategoryQuestionId(category.categoryId, options.role),
      ),
      categoryId: category.categoryId,
      title: category.name,
    }));
  const hardNoDescriptions: string[] = [];

  for (const category of options.questionBank.categories) {
    if (
      category.includeInCategoryRound
      && getAnswer(
        options.secretFile,
        getCategoryQuestionId(category.categoryId, options.role),
      )?.preference === 'hardNo'
    ) {
      hardNoDescriptions.push(category.roles[options.role].description);
    }

    for (const detail of category.detailItems) {
      if (getAnswer(
        options.secretFile,
        getDetailQuestionId(category.categoryId, detail.detailId, options.role),
      )?.preference === 'hardNo') {
        hardNoDescriptions.push(detail.roles[options.role].description);
      }
    }
  }

  return {
    categories,
    hardNoDescriptions,
    locale: options.locale,
    messages: exportMessages[options.locale],
    profileName: options.secretFile.profileName,
    questionnaireMessages: options.questionnaireMessages,
    role: options.role,
    shareUrl: options.shareUrl,
    spotlight,
    updatedAt: options.secretFile.updatedAt,
  };
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/gu, (character) => ({
    '"': '&quot;',
    '&': '&amp;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
  })[character] ?? character);
}

function glyphWidthEm(character: string): number {
  if (/\s/u.test(character)) return 0.34;
  if (/[\u1100-\u115f\u2329\u232a\u2e80-\u303e\u3040-\u30ff\u3100-\u312f\u3130-\u318f\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe19\ufe30-\ufe6f\uff00-\uff60\uffe0-\uffe6]/u.test(character)) return 1;
  if (/\p{Extended_Pictographic}/u.test(character)) return 1;
  if (/[A-Z]/u.test(character)) return 0.68;
  if (/[a-z0-9]/u.test(character)) return 0.56;
  return 0.46;
}

function estimateTextWidth(value: string, fontSize: number): number {
  return Array.from(value)
    .reduce((width, character) => width + glyphWidthEm(character) * fontSize, 0);
}

function truncateTextToWidth(value: string, maxWidth: number, fontSize: number): string {
  if (estimateTextWidth(value, fontSize) <= maxWidth) return value;
  const characters = Array.from(value);
  while (
    characters.length
    && estimateTextWidth(`${characters.join('')}…`, fontSize) > maxWidth
  ) characters.pop();
  return `${characters.join('').trimEnd()}…`;
}

function wrapTextToWidth(
  value: string,
  maxWidth: number,
  fontSize: number,
  locale: AppLocale,
): string[] {
  if (locale === 'en') {
    const words = value.trim().split(/\s+/u);
    const lines: string[] = [];
    let line = '';

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (estimateTextWidth(candidate, fontSize) <= maxWidth) {
        line = candidate;
      } else if (line) {
        lines.push(line);
        line = word;
      } else {
        const chunkSize = Math.max(1, Math.floor(maxWidth / (fontSize * 0.56)));
        const characters = Array.from(word);
        while (characters.length > chunkSize) lines.push(characters.splice(0, chunkSize).join(''));
        line = characters.join('');
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  const lines: string[] = [];
  let line = '';
  for (const character of Array.from(value)) {
    if (line && estimateTextWidth(`${line}${character}`, fontSize) > maxWidth) {
      lines.push(line);
      line = character;
    } else {
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function limitedWrappedLines(
  value: string,
  maxWidth: number,
  fontSize: number,
  maxLines: number,
  locale: AppLocale,
): string[] {
  const lines = wrapTextToWidth(value, maxWidth, fontSize, locale);
  if (lines.length <= maxLines) return lines;
  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = truncateTextToWidth(
    `${visible[maxLines - 1] ?? ''}…`,
    maxWidth,
    fontSize,
  ).replace(/……$/u, '…');
  return visible;
}

function fitWrappedText(
  value: string,
  maxWidth: number,
  maxLines: number,
  preferredFontSize: number,
  minimumFontSize: number,
  locale: AppLocale,
): TextLayout {
  for (let fontSize = preferredFontSize; fontSize >= minimumFontSize; fontSize -= 1) {
    const lines = wrapTextToWidth(value, maxWidth, fontSize, locale);
    if (lines.length <= maxLines) return { fontSize, lines };
  }
  return {
    fontSize: minimumFontSize,
    lines: limitedWrappedLines(value, maxWidth, minimumFontSize, maxLines, locale),
  };
}

function textLines(
  lines: readonly string[],
  x: number,
  y: number,
  fontSize: number,
  lineHeight: number,
  options: {
    anchor?: 'end' | 'middle' | 'start';
    fill?: string;
    letterSpacing?: number;
    weight?: number;
  } = {},
): string {
  const {
    anchor = 'start',
    fill = colors.ink,
    letterSpacing = 0,
    weight = 400,
  } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fontSize}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}" font-family="Microsoft JhengHei, Meiryo, Arial, sans-serif">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join('')}</text>`;
}

function roundedImage(
  id: string,
  image: string,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/></clipPath><image href="${image}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="none" stroke="#fff" stroke-opacity=".13"/>`;
}

function preferenceIcon(value: PreferenceAnswer, x: number, y: number): string {
  const outline = `transform="translate(${x} ${y})" stroke="${colors.rose}" fill="none" stroke-linejoin="round"`;
  if (value === 'hardNo') return `<g ${outline}><circle cx="15" cy="15" r="10" stroke-width="2.2"/><path d="M8 22 22 8" stroke-linecap="round" stroke-width="2.6"/></g>`;
  if (value === 'reluctant') return `<g ${outline}><path d="M15 4 6.5 12.2a6 6 0 0 0 8.3 8.6l.2-.2.2.2a6 6 0 0 0 8.3-8.6L15 4Z" stroke-width="2.1"/></g>`;
  if (value === 'neutral') return `<g ${outline}><circle cx="15" cy="15" r="10" stroke-width="2"/><path d="M9.5 15h11" stroke-linecap="round" stroke-width="2.4"/></g>`;
  if (value === 'like') return `<g ${outline}><path d="M15 25 6.5 16.8a6 6 0 0 1 8.3-8.6l.2.2.2-.2a6 6 0 0 1 8.3 8.6L15 25Z" stroke-width="2.2"/></g>`;
  if (value === 'love') return `<g transform="translate(${x} ${y})"><path d="M14 26 5.8 18.1a6.1 6.1 0 0 1 8.5-8.8l.2.2.2-.2a6.1 6.1 0 0 1 8.5 8.8L15 26Z" fill="${colors.rose}"/><path d="M24 3.5v5M21.5 6h5" stroke="${colors.rose}" stroke-linecap="round" stroke-width="2"/></g>`;
  return `<g ${outline}><path d="M5 8.5h20M5 15h20M5 21.5h14" stroke-linecap="round" stroke-width="2.3"/></g>`;
}

function loadAssetDataUrl(url: string): Promise<string> {
  const cached = assetDataUrlCache.get(url);
  if (cached) return cached;

  const pending = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load share image asset: ${response.status}`);
      return response.blob();
    })
    .then((blob) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(String(reader.result)), { once: true });
      reader.addEventListener('error', () => reject(reader.error), { once: true });
      reader.readAsDataURL(blob);
    }));
  assetDataUrlCache.set(url, pending);
  return pending;
}

async function loadRasterAssets(questionBank: QuestionBank): Promise<{
  background: string;
  categories: Record<string, string>;
}> {
  const categoryIds = [...new Set(questionBank.categories.map((category) => category.categoryId))];
  const [background, categoryEntries] = await Promise.all([
    loadAssetDataUrl(secretArchiveBackgroundUrl),
    Promise.all(categoryIds.map(async (categoryId) => [
      categoryId,
      await loadAssetDataUrl(getCategoryVisualUrl(categoryId)),
    ] as const)),
  ]);
  return { background, categories: Object.fromEntries(categoryEntries) };
}

function createTitleLayout(title: string, locale: AppLocale): TextLayout & {
  dateY: number;
  lineHeight: number;
  y: number;
} {
  if (estimateTextWidth(title, 53) <= 820) {
    return { dateY: 194, fontSize: 53, lineHeight: 58, lines: [title], y: 145 };
  }
  return {
    dateY: 207,
    fontSize: 38,
    lineHeight: 42,
    lines: limitedWrappedLines(title, 820, 38, 2, locale),
    y: 126,
  };
}

async function renderSvg(model: ShareImageModel, questionBank: QuestionBank): Promise<string> {
  const rasterAssets = await loadRasterAssets(questionBank);
  const qrCode = model.shareUrl ? await QRCode.toDataURL(model.shareUrl, {
    color: { dark: colors.qrInk, light: colors.qrBackground },
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 420,
  }) : null;
  let spotlightSvg = '';

  model.spotlight.forEach((item, index) => {
    const image = rasterAssets.categories[item.categoryId];
    if (!image) return;
    if (index === 0) {
      const x = 84;
      const y = 322;
      spotlightSvg += `<rect x="${x}" y="${y}" width="340" height="278" rx="22" fill="#6b5638" fill-opacity=".46" stroke="#f0c98a" stroke-opacity=".62"/>`;
      spotlightSvg += roundedImage('spot-0', image, x + 20, y + 22, 132, 132, 20);
      spotlightSvg += `<circle cx="${x + 305}" cy="${y + 35}" r="18" fill="#efc998" fill-opacity=".12" stroke="${colors.gold}" stroke-opacity=".75"/><text x="${x + 305}" y="${y + 42}" fill="${colors.gold}" font-size="18" font-weight="700" text-anchor="middle" font-family="Arial, sans-serif">1</text>`;
      spotlightSvg += textLines(limitedWrappedLines(item.title, 300, 28, 2, model.locale), x + 20, y + 192, 28, 34, { weight: 700 });
      spotlightSvg += textLines(limitedWrappedLines(item.description, 300, 17, 3, model.locale), x + 20, y + 235, 17, 24, { fill: colors.muted, weight: 700 });
      return;
    }

    const compactIndex = index - 1;
    const x = 448 + (compactIndex % 2) * 334;
    const y = 322 + Math.floor(compactIndex / 2) * 139;
    spotlightSvg += `<rect x="${x}" y="${y}" width="326" height="128" rx="18" fill="#fff5ed" fill-opacity=".065" stroke="#eebe91" stroke-opacity=".22"/>`;
    spotlightSvg += roundedImage(`spot-${index}`, image, x + 14, y + 22, 82, 82, 16);
    spotlightSvg += `<circle cx="${x + 300}" cy="${y + 25}" r="14" fill="none" stroke="${colors.gold}" stroke-opacity=".58"/><text x="${x + 300}" y="${y + 31}" fill="${colors.gold}" font-size="14" font-weight="700" text-anchor="middle" font-family="Arial, sans-serif">${index + 1}</text>`;
    spotlightSvg += textLines([truncateTextToWidth(item.title, 170, 21)], x + 112, y + 42, 21, 25, { weight: 700 });
    spotlightSvg += textLines(limitedWrappedLines(item.description, 186, 14, 2, model.locale), x + 112, y + 73, 14, 20, { fill: colors.muted, weight: 700 });
  });

  if (model.spotlight.length === 0) {
    spotlightSvg = `<circle cx="600" cy="428" r="34" fill="none" stroke="${colors.gold}" stroke-opacity=".35"/><circle cx="600" cy="428" r="5" fill="${colors.gold}" fill-opacity=".48"/>${textLines([model.messages.spotlightEmpty], 600, 500, 22, 26, { anchor: 'middle', fill: colors.muted, weight: 700 })}`;
  }

  let categorySvg = '';
  model.categories.forEach((item, index) => {
    const image = rasterAssets.categories[item.categoryId];
    if (!image) return;
    const x = 84 + (index % 4) * 261;
    const y = 716 + Math.floor(index / 4) * 104;
    const preference = item.answer
      ? model.questionnaireMessages.preferenceLabels[item.answer.preference]
      : model.questionnaireMessages.results.unansweredSummary;
    const isLove = item.answer?.preference === 'love';
    const titleLayout = fitWrappedText(item.title, 155, 2, 17, 14, model.locale);
    const wrapped = titleLayout.lines.length > 1;
    categorySvg += `<rect x="${x}" y="${y}" width="249" height="94" rx="16" fill="${isLove ? '#7a3c4d' : '#fff5ed'}" fill-opacity="${isLove ? '.28' : '.055'}" stroke="${isLove ? '#e7a4a9' : '#ecc6bb'}" stroke-opacity="${isLove ? '.52' : '.15'}"/>`;
    categorySvg += roundedImage(`cat-${index}`, image, x + 11, y + 18, 58, 58, 13);
    categorySvg += textLines(titleLayout.lines, x + 81, y + (wrapped ? 23 : 30), titleLayout.fontSize, 17, { weight: 500 });
    if (item.answer) {
      categorySvg += preferenceIcon(item.answer.preference, x + 81, y + (wrapped ? 54 : 45));
      categorySvg += textLines([preference], x + 115, y + (wrapped ? 77 : 68), 14, 18, { fill: isLove ? '#ffd5d0' : colors.muted, weight: isLove ? 500 : 400 });
    } else {
      categorySvg += textLines([preference], x + 81, y + (wrapped ? 76 : 65), 14, 18, { fill: colors.muted });
    }
  });

  const firstHardNoDescription = model.hardNoDescriptions[0] ?? '';
  const hardNoSummary = firstHardNoDescription
    ? model.messages.hardNoSummary(firstHardNoDescription, model.hardNoDescriptions.length - 1)
    : '';
  const hardNoLayout = fitWrappedText(hardNoSummary, 960, 3, 18, 14, model.locale);
  const hasQrCode = qrCode !== null;
  const warningPanelWidth = hasQrCode ? 816 : 1076;
  const warningTextWidth = hasQrCode ? 744 : 1000;
  const warningLines = limitedWrappedLines(model.messages.warning(model.profileName), warningTextWidth, 17, 4, model.locale);
  const titleLayout = createTitleLayout(model.messages.title(model.profileName), model.locale);
  const dateLabel = model.messages.date(model.updatedAt);
  const roleLabel = model.messages.role[model.role];
  const roleBoxWidth = Math.max(104, Math.ceil(estimateTextWidth(roleLabel, 17) + 54));
  const roleBoxX = Math.ceil(66 + estimateTextWidth(dateLabel, 19) + 18);
  const roleBoxY = titleLayout.dateY - 27;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
    <defs><linearGradient id="bgOverlay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#170a10" stop-opacity=".42"/><stop offset="1" stop-color="#10070c" stop-opacity=".92"/></linearGradient><radialGradient id="glowA"><stop offset="0" stop-color="#9a4a5b" stop-opacity=".32"/><stop offset="1" stop-color="#9a4a5b" stop-opacity="0"/></radialGradient><radialGradient id="glowB"><stop offset="0" stop-color="#b3744e" stop-opacity=".2"/><stop offset="1" stop-color="#b3744e" stop-opacity="0"/></radialGradient><linearGradient id="panelGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#321d27"/><stop offset="1" stop-color="#211219"/></linearGradient><linearGradient id="spotlightGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8f7040" stop-opacity=".3"/><stop offset=".48" stop-color="#6f522e" stop-opacity=".22"/><stop offset="1" stop-color="#4e3527" stop-opacity=".18"/></linearGradient></defs>
    <rect width="1200" height="1600" fill="${colors.paper}"/><image href="${rasterAssets.background}" width="1200" height="1600" preserveAspectRatio="xMidYMid slice" opacity=".28"/><rect width="1200" height="1600" fill="url(#bgOverlay)"/><ellipse cx="130" cy="120" rx="450" ry="410" fill="url(#glowA)"/><ellipse cx="1100" cy="1510" rx="430" ry="340" fill="url(#glowB)"/><rect x="22" y="22" width="1156" height="1556" rx="38" fill="none" stroke="#efc998" stroke-opacity=".25"/>
    ${textLines(['SECRET FILE · SHARE SUMMARY'], 66, 80, 18, 22, { fill: colors.gold, letterSpacing: 3.1 })}${textLines(titleLayout.lines, 66, titleLayout.y, titleLayout.fontSize, titleLayout.lineHeight, { weight: 500 })}${textLines([dateLabel], 66, titleLayout.dateY, 19, 22, { fill: colors.muted })}
    <rect x="${roleBoxX}" y="${roleBoxY}" width="${roleBoxWidth}" height="37" rx="18.5" fill="#a15c45" fill-opacity=".2" stroke="#eebe91" stroke-opacity=".58"/><circle cx="${roleBoxX + 20}" cy="${roleBoxY + 18.5}" r="5" fill="${colors.gold}"/>${textLines([roleLabel], roleBoxX + 34, roleBoxY + 25, 17, 20, { fill: '#ffe2b9' })}
    ${textLines(['Boundary Notes'], 1135, 132, 23, 28, { anchor: 'end', weight: 500, letterSpacing: 1.4 })}${textLines([model.messages.brandLine], 1135, 165, 15, 20, { anchor: 'end', fill: colors.muted })}<line x1="66" y1="220" x2="1134" y2="220" stroke="${colors.line}"/>
    <rect x="62" y="246" width="1076" height="380" rx="25" fill="#2b1c1d" stroke="${colors.gold}" stroke-opacity=".48"/><rect x="63" y="247" width="1074" height="378" rx="24" fill="url(#spotlightGradient)"/>${textLines([model.messages.spotlightTitle], 84, 294, 32, 36, { weight: 700 })}${spotlightSvg}
    <rect x="62" y="646" width="1076" height="594" rx="25" fill="url(#panelGradient)" stroke="${colors.line}"/>${textLines([model.messages.categoryTitle], 84, 692, 26, 30, { weight: 500 })}${categorySvg}
    <rect x="62" y="1250" width="1076" height="96" rx="20" fill="#802e3b" fill-opacity=".22" stroke="${colors.danger}" stroke-opacity=".4"/><circle cx="101" cy="1298" r="21" fill="none" stroke="${colors.danger}" stroke-opacity=".55"/><path d="M92 1307l18-18" stroke="${colors.danger}" stroke-width="2.7" stroke-linecap="round"/>${textLines([model.messages.hardNoKicker], 136, 1279, 14, 18, { fill: colors.danger, letterSpacing: 1.8 })}${textLines(hardNoLayout.lines, 136, 1308, hardNoLayout.fontSize, 19, { weight: 500 })}
    <rect x="62" y="1356" width="${warningPanelWidth}" height="204" rx="23" fill="#1d1016" fill-opacity=".9" stroke="${colors.line}"/><circle cx="101" cy="1394" r="12" fill="none" stroke="${colors.gold}" stroke-opacity=".6"/>${textLines(['i'], 101, 1400, 14, 17, { anchor: 'middle', fill: colors.gold })}${textLines([model.messages.preface], 124, 1401, 16, 20, { fill: colors.gold, letterSpacing: 1.6 })}${textLines(warningLines, 88, 1438, 17, 25, { fill: '#e4d6cf' })}${textLines([model.messages.warningFooter], 88, 1535, 16, 20, { fill: colors.muted })}
    ${qrCode ? `<rect x="898" y="1356" width="240" height="204" rx="23" fill="${colors.qrBackground}" stroke="${colors.gold}" stroke-opacity=".55"/><image href="${qrCode}" x="947" y="1368" width="142" height="142" preserveAspectRatio="xMidYMid meet"/>${textLines([model.messages.qrTitle], 1018, 1530, 15, 19, { anchor: 'middle', weight: 500, fill: colors.qrInk })}${textLines([model.messages.qrDomain], 1018, 1550, 12, 16, { anchor: 'middle', fill: colors.qrInk, letterSpacing: 0.5 })}` : ''}
  </svg>`;
}

async function renderSvgToPng(svg: string): Promise<Blob> {
  await document.fonts?.ready;
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = svgUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas rendering is unavailable.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('The share image could not be encoded.'));
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export async function prewarmShareImageGenerator(questionBank: QuestionBank): Promise<void> {
  await Promise.all([loadRasterAssets(questionBank), document.fonts?.ready]);
}

export async function generateShareImage(options: ShareImageOptions): Promise<Blob> {
  const model = createDisplayModel(options);
  return renderSvgToPng(await renderSvg(model, options.questionBank));
}
