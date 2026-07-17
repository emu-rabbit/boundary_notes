import type { AppLocale } from '../../app/i18n';

export interface SponsorMessages {
  close: string;
  contact: string;
  contactLabel: string;
  description: string;
  ecpayDescription: string;
  ecpayLabel: string;
  imageAlt: string;
  kofiDescription: string;
  kofiLabel: string;
  title: string;
  trigger: string;
}

const messagesByLocale: Record<AppLocale, SponsorMessages> = {
  'zh-Hant': {
    close: '關閉贊助視窗',
    contact: '若有任何疑問，也可以透過 mausu2526@gmail.com 聯絡我。',
    contactLabel: '寄信聯絡我',
    description: '噢，感謝你想點開這裡。營運網頁需要一些電費和守密兔的伙食費。不介意的話可以贊助我們，非常感謝你！',
    ecpayDescription: '綠界科技贊助管道，主要提供給台灣使用者。',
    ecpayLabel: '透過綠界科技贊助',
    imageAlt: '放著茶杯、服務鈴和粉紅色錢包的木托盤。',
    kofiDescription: 'Ko-fi 贊助管道，主要提供給台灣以外的海外使用者。',
    kofiLabel: '透過 Ko-fi 贊助',
    title: '贊助守密兔的今晚晚餐',
    trigger: '贊助本網頁',
  },
  'zh-Hans': {
    close: '关闭赞助窗口',
    contact: '如果有任何疑问，也可以通过 mausu2526@gmail.com 联系我。',
    contactLabel: '发邮件联系我',
    description: '噢，感谢你点开这里。运营网页需要一些电费和守密兔的伙食费。如果不介意的话，可以赞助我们，非常感谢你！',
    ecpayDescription: '绿界科技赞助渠道，主要提供给台湾用户。',
    ecpayLabel: '通过绿界科技赞助',
    imageAlt: '放着茶杯、服务铃和粉红色钱包的木托盘。',
    kofiDescription: 'Ko-fi 赞助渠道，主要提供给台湾以外的海外用户。',
    kofiLabel: '通过 Ko-fi 赞助',
    title: '赞助守密兔的今晚晚餐',
    trigger: '赞助本网页',
  },
  ja: {
    close: '支援ウィンドウを閉じる',
    contact: 'ご質問があれば、mausu2526@gmail.com までご連絡ください。',
    contactLabel: 'メールで問い合わせる',
    description: 'ここを開いてくださってありがとうございます。サイトの運営には電気代と守秘うさぎの食費がかかります。よろしければ、ご支援いただけるとうれしいです。本当にありがとうございます！',
    ecpayDescription: 'ECPay の支援窓口です。主に台湾の方向けです。',
    ecpayLabel: 'ECPay で支援する',
    imageAlt: 'ティーカップ、呼び鈴、ピンクの財布が載った木製トレイ。',
    kofiDescription: 'Ko-fi の支援窓口です。主に台湾以外の海外の方向けです。',
    kofiLabel: 'Ko-fi で支援する',
    title: '守秘うさぎの今夜のごはんを支援する',
    trigger: 'このサイトを支援する',
  },
  en: {
    close: 'Close support window',
    contact: 'If you have any questions, you can also contact me at mausu2526@gmail.com.',
    contactLabel: 'Contact me by email',
    description: 'Oh, thank you for opening this. Keeping the website running takes electricity and food for the Secret-Keeper Bunny. If you do not mind, you can support us. Thank you so much!',
    ecpayDescription: 'ECPay support option, mainly for people in Taiwan.',
    ecpayLabel: 'Support through ECPay',
    imageAlt: 'A wooden tray holding a teacup, a service bell, and a pink wallet.',
    kofiDescription: 'Ko-fi support option, mainly for people outside Taiwan.',
    kofiLabel: 'Support through Ko-fi',
    title: "Support the Secret-Keeper Bunny's dinner tonight",
    trigger: 'Support this website',
  },
};

export function getSponsorMessages(locale: AppLocale): SponsorMessages {
  return messagesByLocale[locale];
}
