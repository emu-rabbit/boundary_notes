import type { AppLocale } from '../../app/i18n';

export interface PreviewMessages {
  allCategories: string;
  categoryAnswer: string;
  categoryUnanswered: string;
  categorySectionKicker: string;
  categorySectionTitle: string;
  createMyFile: string;
  experience: string;
  hardNoButton: (count: number) => string;
  hardNoDialogDescription: string;
  hardNoDialogTitle: string;
  languageLabel: string;
  lastEdited: (date: string) => string;
  loadError: string;
  note: string;
  otherSummary: string;
  preference: string;
  previewActionsLabel: string;
  previewKicker: string;
  roleSwitchLabel: string;
  shareFile: string;
  sponsorWebsite: string;
  spotlightKicker: string;
  spotlightTitle: (name: string) => string;
  title: (name: string) => string;
  unanswered: string;
  unsupportedSource: string;
  viewCategory: (categoryName: string) => string;
  viewDetails: string;
  warning: (name: string) => string;
}

function formatDate(locale: AppLocale, value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

const messagesByLocale: Record<AppLocale, PreviewMessages> = {
  'zh-Hant': {
    allCategories: '返回所有分類',
    categoryAnswer: '分類結果',
    categoryUnanswered: '分類感受尚未填寫',
    categorySectionKicker: '分類相簿',
    categorySectionTitle: '從大分類快速理解這份檔案',
    createMyFile: '建立我的檔案',
    experience: '經驗',
    hardNoButton: (count) => `查看絕對禁止項目（${count}）`,
    hardNoDialogDescription: '集中列出目前方向中標示為「絕對禁止」的分類與細項。這份列表仍不能替代當下的確認與溝通。',
    hardNoDialogTitle: '絕對禁止項目',
    languageLabel: '閱覽語言',
    lastEdited: (date) => `最後編輯於 ${formatDate('zh-Hant', date)}`,
    loadError: '找不到要檢視的檔案，或檔案已不在這台裝置上。',
    note: '備註',
    preference: '喜好',
    previewActionsLabel: '檔案操作',
    previewKicker: '正在檢視',
    roleSwitchLabel: '切換互動方向',
    shareFile: '分享這份檔案',
    sponsorWebsite: '贊助本網頁',
    spotlightKicker: '焦點喜好',
    spotlightTitle: (name) => `${name}的焦點喜好！`,
    otherSummary: '這個分類從細項開始呈現結果',
    title: (name) => `${name}的祕密檔案`,
    unanswered: '未作答',
    unsupportedSource: '這個檔案來源尚未開放檢視。',
    viewCategory: (categoryName) => `查看${categoryName}的完整結果`,
    viewDetails: '查看完整結果',
    warning: (name) => `這份測驗結果僅供參考，並無法完整的描述${name}的喜好或特質，也請勿用來替代任何必要的溝通。`,
  },
  'zh-Hans': {
    allCategories: '返回所有分类',
    categoryAnswer: '分类结果',
    categoryUnanswered: '分类感受尚未填写',
    categorySectionKicker: '分类相册',
    categorySectionTitle: '从大分类快速理解这份档案',
    createMyFile: '建立我的档案',
    experience: '经验',
    hardNoButton: (count) => `查看绝对禁止项目（${count}）`,
    hardNoDialogDescription: '集中列出目前方向中标示为“绝对禁止”的分类与细项。这份列表仍不能替代当下的确认与沟通。',
    hardNoDialogTitle: '绝对禁止项目',
    languageLabel: '查看语言',
    lastEdited: (date) => `最后编辑于 ${formatDate('zh-Hans', date)}`,
    loadError: '找不到要查看的档案，或档案已不在此设备上。',
    note: '备注',
    preference: '喜好',
    previewActionsLabel: '档案操作',
    previewKicker: '正在查看',
    roleSwitchLabel: '切换互动方向',
    shareFile: '分享这份档案',
    sponsorWebsite: '赞助本网页',
    spotlightKicker: '焦点喜好',
    spotlightTitle: (name) => `${name}的焦点喜好！`,
    otherSummary: '这个分类从细项开始呈现结果',
    title: (name) => `${name}的秘密档案`,
    unanswered: '未作答',
    unsupportedSource: '这个档案来源尚未开放查看。',
    viewCategory: (categoryName) => `查看${categoryName}的完整结果`,
    viewDetails: '查看完整结果',
    warning: (name) => `这份测试结果仅供参考，无法完整描述${name}的喜好或特质，也请勿用它代替任何必要的沟通。`,
  },
  ja: {
    allCategories: 'すべてのカテゴリーへ戻る',
    categoryAnswer: 'カテゴリーの結果',
    categoryUnanswered: 'カテゴリーの感想は未入力です',
    categorySectionKicker: 'カテゴリーアルバム',
    categorySectionTitle: '大きなカテゴリーからファイルをすばやく理解する',
    createMyFile: '自分のファイルを作る',
    experience: '経験',
    hardNoButton: (count) => `絶対に不可の項目を見る（${count}）`,
    hardNoDialogDescription: '現在表示している方向で「絶対に不可」とされたカテゴリーと項目をまとめています。この一覧も、その時々の確認や対話に代わるものではありません。',
    hardNoDialogTitle: '絶対に不可の項目',
    languageLabel: '表示言語',
    lastEdited: (date) => `最終編集 ${formatDate('ja', date)}`,
    loadError: '表示するファイルが見つからないか、この端末にはもうありません。',
    note: 'メモ',
    preference: '好み',
    previewActionsLabel: 'ファイル操作',
    previewKicker: '閲覧中',
    roleSwitchLabel: '関わり方を切り替える',
    shareFile: 'このファイルを共有',
    sponsorWebsite: 'このサイトを支援する',
    spotlightKicker: '注目してほしい好み',
    spotlightTitle: (name) => `${name}の注目してほしい好み！`,
    otherSummary: 'このカテゴリーは細目から結果を表示します',
    title: (name) => `${name}の秘密ファイル`,
    unanswered: '未回答',
    unsupportedSource: 'このファイルの取得元はまだ表示に対応していません。',
    viewCategory: (categoryName) => `${categoryName}の詳しい結果を見る`,
    viewDetails: '詳しい結果を見る',
    warning: (name) => `この結果は参考情報にすぎず、${name}の好みや特性を完全に表すものではありません。必要な対話の代わりにはしないでください。`,
  },
  en: {
    allCategories: 'Back to all categories',
    categoryAnswer: 'Category result',
    categoryUnanswered: 'Category response not filled in',
    categorySectionKicker: 'Category album',
    categorySectionTitle: 'Understand this file quickly by category',
    createMyFile: 'Create my file',
    experience: 'Experience',
    hardNoButton: (count) => `View absolutely prohibited items (${count})`,
    hardNoDialogDescription: 'This gathers every category and item marked “absolutely prohibited” in the currently displayed direction. It still cannot replace a current check-in and conversation.',
    hardNoDialogTitle: 'Absolutely prohibited items',
    languageLabel: 'Viewing language',
    lastEdited: (date) => `Last edited ${formatDate('en', date)}`,
    loadError: 'The file to preview could not be found or is no longer stored on this device.',
    note: 'Note',
    preference: 'Preference',
    previewActionsLabel: 'File actions',
    previewKicker: 'Viewing',
    roleSwitchLabel: 'Switch interaction direction',
    shareFile: 'Share this file',
    sponsorWebsite: 'Support this website',
    spotlightKicker: 'Spotlight preferences',
    spotlightTitle: (name) => `${name}'s spotlight preferences!`,
    otherSummary: 'This category presents results through its individual items',
    title: (name) => `${name}'s Secret File`,
    unanswered: 'Unanswered',
    unsupportedSource: 'Previewing this file source is not available yet.',
    viewCategory: (categoryName) => `View the full ${categoryName} result`,
    viewDetails: 'View full result',
    warning: (name) => `This test result is only a reference. It cannot fully describe ${name}'s preferences or traits and must not replace any necessary communication.`,
  },
};

export function getPreviewMessages(locale: AppLocale): PreviewMessages {
  return messagesByLocale[locale];
}
