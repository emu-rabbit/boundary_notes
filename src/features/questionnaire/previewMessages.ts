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
  cloudAppCheckUnavailable: string;
  cloudLoadError: string;
  cloudLinkCopied: string;
  cloudLinkCopyFailed: string;
  copyCloudLink: string;
  cloudUnavailable: string;
  localLoadError: string;
  loading: string;
  loveButton: (count: number) => string;
  loveDialogDescription: string;
  loveDialogTitle: string;
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
    cloudAppCheckUnavailable: '網站的安全驗證未能完成，因此目前無法讀取這份雲端檔案。有些網路或瀏覽器可能會阻擋驗證，請換個網路或瀏覽器再開啟連結。',
    cloudLoadError: '找不到這份雲端檔案。',
    cloudLinkCopied: '目前的分享連結已複製。',
    cloudLinkCopyFailed: '無法自動複製連結，請從瀏覽器網址列複製。',
    cloudUnavailable: '目前無法連線讀取這份雲端檔案，請稍後再試；若持續失敗，也可以換個網路或瀏覽器再開啟連結。',
    copyCloudLink: '複製目前的分享連結',
    localLoadError: '找不到要檢視的本地檔案。它可能已從這台裝置刪除，或不在這個瀏覽器的儲存空間中。',
    loading: '正在安全地讀取檔案…',
    loveButton: (count) => `查看 ${count} 個很喜歡的項目`,
    loveDialogDescription: '集中列出目前方向中標示為「很喜歡」的分類與細項。這份列表仍只是目前的自我描述，不能替代當下的確認與溝通。',
    loveDialogTitle: '很喜歡的項目',
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
    cloudAppCheckUnavailable: '网站的安全验证未能完成，因此目前无法读取此云端文件。有些网络或浏览器可能会阻止验证，请更换网络或浏览器后重新打开链接。',
    cloudLoadError: '找不到此云端文件。',
    cloudLinkCopied: '当前分享链接已复制。',
    cloudLinkCopyFailed: '无法自动复制链接，请从浏览器地址栏复制。',
    cloudUnavailable: '目前无法连接并读取此云端文件，请稍后再试；如果持续失败，也可以更换网络或浏览器后重新打开链接。',
    copyCloudLink: '复制当前分享链接',
    localLoadError: '找不到要查看的本地文件。它可能已从此设备删除，或不在此浏览器的存储空间中。',
    loading: '正在安全地读取文件…',
    loveButton: (count) => `查看 ${count} 个很喜欢的项目`,
    loveDialogDescription: '集中列出目前方向中标示为“很喜欢”的分类与细项。这份列表仍只是目前的自我描述，不能替代当下的确认与沟通。',
    loveDialogTitle: '很喜欢的项目',
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
    cloudAppCheckUnavailable: 'サイトの安全確認を完了できなかったため、このクラウドファイルを読み込めません。一部のネットワークやブラウザでは確認が妨げられることがあります。別のネットワークまたはブラウザでリンクを開き直してください。',
    cloudLoadError: 'このクラウドファイルは見つかりません。',
    cloudLinkCopied: '現在の共有リンクをコピーしました。',
    cloudLinkCopyFailed: 'リンクを自動でコピーできませんでした。ブラウザのアドレスバーからコピーしてください。',
    cloudUnavailable: '現在このクラウドファイルに接続して読み込めません。しばらくしてからお試しください。解決しない場合は、別のネットワークまたはブラウザでリンクを開き直してください。',
    copyCloudLink: '現在の共有リンクをコピー',
    localLoadError: '表示するローカルファイルが見つかりません。この端末から削除されたか、このブラウザの保存領域にない可能性があります。',
    loading: 'ファイルを安全に読み込んでいます…',
    loveButton: (count) => `${count} 個の「とても好き」な項目を見る`,
    loveDialogDescription: '現在表示している方向で「とても好き」とされたカテゴリーと項目をまとめています。この一覧も、今の確認や対話に代わるものではありません。',
    loveDialogTitle: 'とても好きな項目',
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
    cloudAppCheckUnavailable: 'The site could not complete its security check, so this cloud file cannot be loaded. Some networks or browsers may block the check. Please open the link with another network or browser.',
    cloudLoadError: 'This cloud file could not be found.',
    cloudLinkCopied: 'The current share link has been copied.',
    cloudLinkCopyFailed: 'The link could not be copied automatically. Please copy it from the browser address bar.',
    cloudUnavailable: 'This cloud file cannot be reached right now. Please try again later. If it keeps failing, open the link with another network or browser.',
    copyCloudLink: 'Copy current share link',
    localLoadError: 'The local file could not be found. It may have been deleted from this device or may not exist in this browser storage.',
    loading: 'Securely loading the file…',
    loveButton: (count) => `View ${count} much-loved items`,
    loveDialogDescription: 'This gathers every category and item marked “love” in the currently displayed direction. It is still only a current self-description and cannot replace a current check-in and conversation.',
    loveDialogTitle: 'Much-loved items',
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
    viewCategory: (categoryName) => `View the full ${categoryName} result`,
    viewDetails: 'View full result',
    warning: (name) => `This test result is only a reference. It cannot fully describe ${name}'s preferences or traits and must not replace any necessary communication.`,
  },
};

export function getPreviewMessages(locale: AppLocale): PreviewMessages {
  return messagesByLocale[locale];
}
