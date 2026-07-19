import type { AppLocale } from '../../app/i18n';

export type ContentWarningMessages = {
  confirm: string;
  description: string;
  leave: string;
  title: string;
};

const messagesByLocale: Record<AppLocale, ContentWarningMessages> = {
  'zh-Hant': {
    confirm: '確定',
    description: '本網站包含 BDSM、性與親密界線、暴力意象及風險行為等敏感主題，部分內容可能不適合未成年人。請確認你了解內容性質後繼續。',
    leave: '離開',
    title: '內容提醒',
  },
  'zh-Hans': {
    confirm: '确定',
    description: '本网站包含 BDSM、性与亲密界限、暴力意象及风险行为等敏感主题，部分内容可能不适合未成年人。请确认你了解内容性质后继续。',
    leave: '离开',
    title: '内容提醒',
  },
  ja: {
    confirm: '続ける',
    description: 'このサイトには BDSM、性や親密さの境界、暴力的なイメージ、リスクを伴う行為などのセンシティブなテーマが含まれます。一部の内容は未成年者に適さない場合があります。内容の性質を理解したうえで続けてください。',
    leave: '離れる',
    title: 'コンテンツに関するお知らせ',
  },
  en: {
    confirm: 'Continue',
    description: 'This website includes sensitive themes such as BDSM, sexual and intimate boundaries, violent imagery, and risky behaviors. Some content may not be suitable for minors. Please confirm that you understand the nature of this content before continuing.',
    leave: 'Leave',
    title: 'Content Notice',
  },
};

export function getContentWarningMessages(locale: AppLocale): ContentWarningMessages {
  return messagesByLocale[locale];
}
