import type { AppLocale } from '../../app/i18n';
import { secretKeeperNames } from '../../app/i18n/terminology';
import type { SecretFileScope } from './domain/types';

export interface FileManagerMessages {
  backHome: string;
  cloudEmptyBody: string;
  cloudEmptyTitle: string;
  cloudImportDescription: string;
  cloudImportLabel: string;
  cloudImportPlaceholder: string;
  cloudImportSuccess: (name: string) => string;
  cloudImportSubmit: string;
  cloudLinkStorageFailed: string;
  cloudLoadFailed: string;
  cloudLoading: string;
  cloudTab: string;
  cloudUploadedAt: (date: string) => string;
  cloudUnlink: string;
  cloudUnlinkConfirmation: (name: string) => string;
  cloudUnavailable: string;
  cloudConfigurationError: string;
  close: string;
  copyError: string;
  copyJson: string;
  copySuccess: string;
  delete: string;
  deleteConfirmation: (name: string) => string;
  edit: string;
  emptyBody: string;
  emptyTitle: string;
  importAction: string;
  importJson: string;
  importJsonDescription: string;
  importJsonLabel: string;
  importJsonPlaceholder: string;
  importSuccess: (name: string) => string;
  importTitle: string;
  intro: string;
  invalidCloudUrl: string;
  kicker: string;
  localTab: string;
  overwriteConfirmation: (name: string, existingUpdatedAt: string, importedUpdatedAt: string) => string;
  progress: (answered: number, total: number) => string;
  rabbitAlt: string;
  scope: (scope: SecretFileScope) => string;
  title: string;
  updatedAt: (date: string) => string;
  view: string;
}

const scopeLabels: Record<AppLocale, Record<SecretFileScope, string>> = {
  'zh-Hant': { activeOnly: '僅主導側', passiveOnly: '僅配合側', all: '主導側與配合側' },
  'zh-Hans': { activeOnly: '仅主导侧', passiveOnly: '仅配合侧', all: '主导侧与配合侧' },
  ja: { activeOnly: 'リード側のみ', passiveOnly: 'フォロー側のみ', all: 'リード側とフォロー側' },
  en: { activeOnly: 'Leading only', passiveOnly: 'Following only', all: 'Leading and following' },
};

const messagesByLocale: Record<AppLocale, FileManagerMessages> = {
  'zh-Hant': {
    backHome: '回到主頁',
    cloudEmptyBody: '上傳檔案或匯入分享連結後，就能從這台裝置快速回到雲端檔案。',
    cloudEmptyTitle: '這台裝置還沒有連結雲端檔案',
    cloudImportDescription: '貼上 Boundary Notes 的雲端檔案分享網址或 share ID。這裡只會保存連結，不會建立可編輯的副本。',
    cloudImportLabel: '雲端檔案網址或 share ID',
    cloudImportPlaceholder: 'https://boundarynotes.com/preview?source=cloud&file=…',
    cloudImportSuccess: (name) => `已將「${name}」連結到這台裝置。`,
    cloudImportSubmit: '匯入雲端檔案',
    cloudLinkStorageFailed: '無法把雲端檔案連結保存到這台裝置，請檢查瀏覽器儲存空間後再試。',
    cloudLoadFailed: '目前無法讀取這份雲端檔案。',
    cloudLoading: '正在讀取這份雲端檔案…',
    cloudTab: '雲端檔案',
    cloudUploadedAt: (date) => `上傳於 ${date}`,
    cloudUnlink: '從這台裝置移除連結',
    cloudUnlinkConfirmation: (name) => `要從這台裝置移除「${name}」的雲端連結嗎？這不會刪除網路上的檔案。`,
    cloudUnavailable: '已連結的雲端檔案',
    cloudConfigurationError: '雲端分享尚未完成設定，請稍後再試。',
    close: '關閉',
    copyError: '無法複製 JSON，請確認瀏覽器已允許剪貼簿存取。',
    copyJson: '複製 JSON',
    copySuccess: '已將完整 JSON 複製到剪貼簿。',
    delete: '刪除本地檔案',
    deleteConfirmation: (name) => `要刪除「${name}」嗎？這只會刪除這台裝置上的本地檔案，且無法復原。`,
    edit: '編輯檔案',
    emptyBody: '建立新檔案後，就能從這裡繼續填答或檢視。',
    emptyTitle: '這台裝置還沒有保存的檔案',
    importAction: '匯入檔案',
    importJson: '驗證並匯入',
    importJsonDescription: '貼上完整的秘密檔案 JSON，再保存到這台裝置。',
    importJsonLabel: '秘密檔案 JSON',
    importJsonPlaceholder: '{ "schemaVersion": 2, ... }',
    importSuccess: (name) => `已匯入「${name}」，檔案已保存到這台裝置。`,
    importTitle: '匯入舊檔案',
    intro: '在這裡整理保存在本地或與雲端連結的檔案。',
    invalidCloudUrl: '無法辨識這個雲端分享網址或 share ID。',
    kicker: '秘密檔案櫃',
    localTab: '本地檔案',
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `「${name}」的 fileId 已存在，繼續匯入會直接覆蓋本地檔案。\n\n本地舊檔最後編輯：${existingUpdatedAt}\n匯入新檔最後編輯：${importedUpdatedAt}\n\n要繼續覆蓋嗎？`,
    progress: (answered, total) => `已填答 ${answered} / ${total}`,
    rabbitAlt: `白色${secretKeeperNames['zh-Hant']}抱著一份上鎖的秘密檔案。`,
    scope: (scope) => scopeLabels['zh-Hant'][scope],
    title: '查看舊檔案',
    updatedAt: (date) => `最後編輯 ${date}`,
    view: '檢視檔案',
  },
  'zh-Hans': {
    backHome: '返回主页',
    cloudEmptyBody: '上传文件或导入分享链接后，就能从此设备快速返回云端文件。',
    cloudEmptyTitle: '此设备尚未连接云端文件',
    cloudImportDescription: '粘贴 Boundary Notes 的云端文件分享网址或 share ID。这里只保存链接，不会建立可编辑副本。',
    cloudImportLabel: '云端文件网址或 share ID',
    cloudImportPlaceholder: 'https://boundarynotes.com/preview?source=cloud&file=…',
    cloudImportSuccess: (name) => `已将“${name}”连接到此设备。`,
    cloudImportSubmit: '导入云端文件',
    cloudLinkStorageFailed: '无法将云端文件链接保存到此设备，请检查浏览器存储空间后重试。',
    cloudLoadFailed: '目前无法读取此云端文件。',
    cloudLoading: '正在读取此云端文件…',
    cloudTab: '云端文件',
    cloudUploadedAt: (date) => `上传于 ${date}`,
    cloudUnlink: '从此设备移除链接',
    cloudUnlinkConfirmation: (name) => `要从此设备移除“${name}”的云端链接吗？这不会删除网络上的文件。`,
    cloudUnavailable: '已连接的云端文件',
    cloudConfigurationError: '云端分享尚未完成设置，请稍后再试。',
    close: '关闭',
    copyError: '无法复制 JSON，请确认浏览器已允许访问剪贴板。',
    copyJson: '复制 JSON',
    copySuccess: '已将完整 JSON 复制到剪贴板。',
    delete: '删除本地文件',
    deleteConfirmation: (name) => `要删除“${name}”吗？这只会删除此设备上的本地文件，且无法恢复。`,
    edit: '编辑文件',
    emptyBody: '创建新文件后，就能从这里继续填写或查看。',
    emptyTitle: '此设备还没有保存的文件',
    importAction: '导入文件',
    importJson: '验证并导入',
    importJsonDescription: '粘贴完整的秘密文件 JSON，再保存到此设备。',
    importJsonLabel: '秘密文件 JSON',
    importJsonPlaceholder: '{ "schemaVersion": 2, ... }',
    importSuccess: (name) => `已导入“${name}”，文件已保存到此设备。`,
    importTitle: '导入旧文件',
    intro: '在这里整理保存在本地或与云端连接的文件。',
    invalidCloudUrl: '无法识别此云端分享网址或 share ID。',
    kicker: '秘密文件柜',
    localTab: '本地文件',
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `“${name}”的 fileId 已存在，继续导入会直接覆盖本地文件。\n\n本地旧文件最后编辑：${existingUpdatedAt}\n导入新文件最后编辑：${importedUpdatedAt}\n\n要继续覆盖吗？`,
    progress: (answered, total) => `已填写 ${answered} / ${total}`,
    rabbitAlt: `白色${secretKeeperNames['zh-Hans']}抱着一份上锁的秘密文件。`,
    scope: (scope) => scopeLabels['zh-Hans'][scope],
    title: '查看旧文件',
    updatedAt: (date) => `最后编辑 ${date}`,
    view: '查看文件',
  },
  ja: {
    backHome: 'ホームへ戻る',
    cloudEmptyBody: 'ファイルをアップロードするか共有リンクを取り込むと、この端末からクラウドファイルへ戻れます。',
    cloudEmptyTitle: 'この端末にリンクしたクラウドファイルはありません',
    cloudImportDescription: 'Boundary Notes のクラウド共有 URL または share ID を貼り付けます。編集用のコピーは作らず、リンクだけを保存します。',
    cloudImportLabel: 'クラウドファイル URL または share ID',
    cloudImportPlaceholder: 'https://boundarynotes.com/preview?source=cloud&file=…',
    cloudImportSuccess: (name) => `「${name}」をこの端末にリンクしました。`,
    cloudImportSubmit: 'クラウドファイルを取り込む',
    cloudLinkStorageFailed: 'クラウドファイルのリンクをこの端末に保存できません。ブラウザの保存領域を確認して、もう一度お試しください。',
    cloudLoadFailed: 'このクラウドファイルは現在読み込めません。',
    cloudLoading: 'このクラウドファイルを読み込んでいます…',
    cloudTab: 'クラウド',
    cloudUploadedAt: (date) => `アップロード ${date}`,
    cloudUnlink: 'この端末からリンクを削除',
    cloudUnlinkConfirmation: (name) => `「${name}」のクラウドリンクをこの端末から削除しますか？インターネット上のファイルは削除されません。`,
    cloudUnavailable: 'リンク済みのクラウドファイル',
    cloudConfigurationError: 'クラウド共有の設定がまだ完了していません。しばらくしてからお試しください。',
    close: '閉じる',
    copyError: 'JSON をコピーできませんでした。ブラウザのクリップボード権限を確認してください。',
    copyJson: 'JSON をコピー',
    copySuccess: '完全な JSON をクリップボードにコピーしました。',
    delete: '端末から削除',
    deleteConfirmation: (name) => `「${name}」を削除しますか？この端末のローカルファイルだけが削除され、元に戻せません。`,
    edit: 'ファイルを編集',
    emptyBody: '新しいファイルを作ると、ここから回答や確認を続けられます。',
    emptyTitle: 'この端末に保存されたファイルはまだありません',
    importAction: 'ファイルを取り込む',
    importJson: '検証して取り込む',
    importJsonDescription: '秘密ファイルの完全な JSON を貼り付けて、この端末へ保存します。',
    importJsonLabel: '秘密ファイル JSON',
    importJsonPlaceholder: '{ "schemaVersion": 2, ... }',
    importSuccess: (name) => `「${name}」を取り込み、この端末へ保存しました。`,
    importTitle: '以前のファイルを取り込む',
    intro: 'ローカルに保存したファイルや、クラウドにリンクしたファイルをここで整理できます。',
    invalidCloudUrl: 'クラウド共有 URL または share ID を認識できません。',
    kicker: '秘密ファイル棚',
    localTab: 'ローカル',
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `「${name}」と同じ fileId が存在します。続行するとローカルファイルを上書きします。\n\n既存ファイルの最終編集：${existingUpdatedAt}\n取り込むファイルの最終編集：${importedUpdatedAt}\n\n上書きしますか？`,
    progress: (answered, total) => `${answered} / ${total} 回答済み`,
    rabbitAlt: `白い${secretKeeperNames.ja}が鍵付きの秘密ファイルを抱えている。`,
    scope: (scope) => scopeLabels.ja[scope],
    title: '以前のファイル',
    updatedAt: (date) => `最終編集 ${date}`,
    view: 'ファイルを見る',
  },
  en: {
    backHome: 'Home',
    cloudEmptyBody: 'Upload a file or import a share link to return to cloud files from this device.',
    cloudEmptyTitle: 'No cloud files are linked on this device',
    cloudImportDescription: 'Paste a Boundary Notes cloud share URL or share ID. This saves only the link and does not create an editable copy.',
    cloudImportLabel: 'Cloud file URL or share ID',
    cloudImportPlaceholder: 'https://boundarynotes.com/preview?source=cloud&file=…',
    cloudImportSuccess: (name) => `Linked “${name}” on this device.`,
    cloudImportSubmit: 'Import cloud file',
    cloudLinkStorageFailed: 'The cloud file link could not be saved on this device. Check browser storage and try again.',
    cloudLoadFailed: 'This cloud file cannot be loaded right now.',
    cloudLoading: 'Loading this cloud file…',
    cloudTab: 'Cloud files',
    cloudUploadedAt: (date) => `Uploaded ${date}`,
    cloudUnlink: 'Remove link from this device',
    cloudUnlinkConfirmation: (name) => `Remove the cloud link for “${name}” from this device? This will not delete the file from the internet.`,
    cloudUnavailable: 'Linked cloud file',
    cloudConfigurationError: 'Cloud sharing has not been configured yet. Please try again later.',
    close: 'Close',
    copyError: 'Could not copy the JSON. Check that clipboard access is allowed in this browser.',
    copyJson: 'Copy JSON',
    copySuccess: 'The complete JSON was copied to the clipboard.',
    delete: 'Delete local file',
    deleteConfirmation: (name) => `Delete “${name}”? This only removes the local file on this device and cannot be undone.`,
    edit: 'Edit file',
    emptyBody: 'Create one to continue answering or review it here.',
    emptyTitle: 'There are no files saved on this device yet',
    importAction: 'Import file',
    importJson: 'Validate and import',
    importJsonDescription: 'Paste a complete secret-file JSON document to save it on this device.',
    importJsonLabel: 'Secret-file JSON',
    importJsonPlaceholder: '{ "schemaVersion": 2, ... }',
    importSuccess: (name) => `Imported “${name}” and saved it on this device.`,
    importTitle: 'Import an old file',
    intro: 'Manage files saved locally or linked from the cloud.',
    invalidCloudUrl: 'This cloud share URL or share ID is not recognized.',
    kicker: 'Secret-file cabinet',
    localTab: 'Local files',
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `A file with the same fileId as “${name}” already exists. Continuing will overwrite the local file.\n\nExisting file last edited: ${existingUpdatedAt}\nImported file last edited: ${importedUpdatedAt}\n\nContinue and overwrite it?`,
    progress: (answered, total) => `${answered} / ${total} answered`,
    rabbitAlt: `The white ${secretKeeperNames.en} holds a locked secret file.`,
    scope: (scope) => scopeLabels.en[scope],
    title: 'Old Files',
    updatedAt: (date) => `Last edited ${date}`,
    view: 'View file',
  },
};

export function getFileManagerMessages(locale: AppLocale): FileManagerMessages {
  return messagesByLocale[locale];
}
