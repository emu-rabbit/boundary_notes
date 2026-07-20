import type { AppLocale } from '../../app/i18n';
import type { QuestionRole } from '../secret-file';

export interface ShareMessages {
  close: string;
  copied: string;
  copyFailed: string;
  copyLink: string;
  downloadFailed: string;
  downloaded: string;
  downloadImage: (role: QuestionRole) => string;
  generating: string;
  imageDescription: string;
  imageTitle: string;
  linkCloudDescription: string;
  linkLocalMatchedDescription: string;
  linkLocalMissingDescription: string;
  linkTitle: string;
  preparingLink: string;
  title: string;
}

const messagesByLocale: Record<AppLocale, ShareMessages> = {
  'zh-Hant': {
    close: '關閉',
    copied: '分享連結已複製',
    copyFailed: '無法複製連結，請稍後再試。',
    copyLink: '複製分享連結',
    downloadFailed: '圖片生成失敗，請稍後再試。',
    downloaded: '圖片已開始下載',
    downloadImage: (role) => `下載${role === 'active' ? '主導側' : '配合側'}圖片`,
    generating: '正在生成圖片…',
    imageDescription: '圖片不包含備註或經驗結果，雙向檔案會分成兩張。',
    imageTitle: '圖片分享',
    linkCloudDescription: '複製這份雲端檔案的正式檢視連結。',
    linkLocalMatchedDescription: '已找到與目前編輯版本完全相同的雲端檔案。',
    linkLocalMissingDescription: '這個編輯版本尚未上傳，因此目前沒有可分享的正式連結。',
    linkTitle: '連結分享',
    preparingLink: '正在確認是否有相同版本的雲端檔案…',
    title: '分享這份檔案',
  },
  'zh-Hans': {
    close: '关闭', copied: '分享链接已复制', copyFailed: '无法复制链接，请稍后再试。', copyLink: '复制分享链接',
    downloadFailed: '图片生成失败，请稍后再试。', downloaded: '图片已开始下载', downloadImage: (role) => `下载${role === 'active' ? '主导侧' : '配合侧'}图片`,
    generating: '正在生成图片…', imageDescription: '图片不包含备注或经验结果，双向文件会分成两张。',
    imageTitle: '图片分享', linkCloudDescription: '复制此云端文件的正式查看链接。',
    linkLocalMatchedDescription: '已找到与当前编辑版本完全相同的云端文件。', linkLocalMissingDescription: '此编辑版本尚未上传，因此目前没有可分享的正式链接。',
    linkTitle: '链接分享', preparingLink: '正在确认是否有相同版本的云端文件…', title: '分享此文件',
  },
  ja: {
    close: '閉じる', copied: '共有リンクをコピーしました', copyFailed: 'リンクをコピーできませんでした。しばらくしてからお試しください。', copyLink: '共有リンクをコピー',
    downloadFailed: '画像を生成できませんでした。しばらくしてからお試しください。', downloaded: '画像のダウンロードを開始しました', downloadImage: (role) => `${role === 'active' ? 'リード側' : 'フォロー側'}の画像を保存`,
    generating: '画像を生成しています…', imageDescription: '画像にはメモや経験の結果を含みません、両方向のファイルは2枚に分けます。',
    imageTitle: '画像で共有', linkCloudDescription: 'このクラウドファイルの正式な閲覧リンクをコピーします。',
    linkLocalMatchedDescription: '現在の編集内容と完全に同じクラウドファイルが見つかりました。', linkLocalMissingDescription: 'この編集内容はまだアップロードされていないため、共有できる正式なリンクはありません。',
    linkTitle: 'リンクで共有', preparingLink: '同じ内容のクラウドファイルを確認しています…', title: 'このファイルを共有',
  },
  en: {
    close: 'Close', copied: 'Share link copied', copyFailed: 'The link could not be copied. Please try again.', copyLink: 'Copy share link',
    downloadFailed: 'The image could not be generated. Please try again.', downloaded: 'Image download started', downloadImage: (role) => `Download ${role === 'active' ? 'leading' : 'following'} image`,
    generating: 'Generating image…', imageDescription: 'Images exclude notes and experience results. A two-direction file is split into two images.',
    imageTitle: 'Share as an image', linkCloudDescription: 'Copy the official viewing link for this cloud file.',
    linkLocalMatchedDescription: 'A cloud file with exactly the same edited content was found.', linkLocalMissingDescription: 'This edited version has not been uploaded, so it does not have an official share link yet.',
    linkTitle: 'Share by link', preparingLink: 'Checking for a cloud file of this exact version…', title: 'Share this file',
  },
};

export function getShareMessages(locale: AppLocale): ShareMessages {
  return messagesByLocale[locale];
}
