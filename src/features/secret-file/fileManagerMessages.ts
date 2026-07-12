import type { AppLocale } from '../../app/i18n';

export interface FileManagerMessages {
  backHome: string;
  createdAt: (date: string) => string;
  delete: string;
  deleteConfirmation: (name: string) => string;
  edit: string;
  empty: string;
  emptyAction: string;
  importDescription: string;
  importJson: string;
  importLabel: string;
  importPlaceholder: string;
  importSuccess: (name: string) => string;
  overwriteConfirmation: (name: string, existingUpdatedAt: string, importedUpdatedAt: string) => string;
  progress: (answered: number, total: number) => string;
  title: string;
  view: string;
}

const messagesByLocale: Record<AppLocale, FileManagerMessages> = {
  'zh-Hant': {
    backHome: '\u56de\u5230\u4e3b\u9801',
    createdAt: (date) => `\u5efa\u7acb\u65bc ${date}`,
    delete: '\u522a\u9664',
    deleteConfirmation: (name) => `\u8981\u522a\u9664\u300c${name}\u300d\u55ce\uff1f\u9019\u53ea\u6703\u522a\u9664\u9019\u53f0\u88dd\u7f6e\u4e0a\u7684\u672c\u6a5f\u6a94\u6848\uff0c\u7121\u6cd5\u5fa9\u539f\u3002`,
    edit: '\u7de8\u8f2f\u7d50\u679c',
    empty: '\u9019\u88e1\u9084\u6c92\u6709\u5132\u5b58\u7684\u6a94\u6848\u3002\u5efa\u7acb\u4e00\u4efd\u65b0\u7684\u79d8\u5bc6\u6a94\u6848\u5f8c\uff0c\u5c31\u80fd\u5f9e\u9019\u88e1\u7e7c\u7e8c\u67e5\u770b\u6216\u7de8\u8f2f\u3002',
    emptyAction: '\u5275\u5efa\u65b0\u6a94\u6848',
    importDescription: '\u958b\u767c\u671f\u5de5\u5177\uff1a\u8cbc\u4e0a\u5b8c\u6574\u7684\u79d8\u5bc6\u6a94\u6848 JSON\uff0c\u9a57\u8b49\u5f8c\u5b58\u5165\u9019\u53f0\u88dd\u7f6e\u3002',
    importJson: '\u9a57\u8b49\u4e26\u532f\u5165',
    importLabel: '\u532f\u5165 JSON \u5b57\u4e32',
    importPlaceholder: '{ "schemaVersion": 1, ... }',
    importSuccess: (name) => `\u5df2\u532f\u5165\u300c${name}\u300d\uff0c\u6b63\u5728\u958b\u555f\u6aa2\u8996\u9801\u3002`,
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `\u300c${name}\u300d\u7684 fileId \u5df2\u5b58\u5728\uff0c\u7e7c\u7e8c\u532f\u5165\u6703\u76f4\u63a5\u8986\u84cb\u672c\u6a5f\u6a94\u6848\u3002\n\n\u672c\u6a5f\u820a\u6a94\u6700\u5f8c\u7de8\u8f2f\uff1a${existingUpdatedAt}\n\u532f\u5165\u65b0\u6a94\u6700\u5f8c\u7de8\u8f2f\uff1a${importedUpdatedAt}\n\n\u8981\u7e7c\u7e8c\u8986\u84cb\u55ce\uff1f`,
    progress: (answered, total) => `\u5df2\u586b\u7b54 ${answered} / ${total}`,
    title: '\u67e5\u770b\u820a\u6a94\u6848',
    view: '\u6aa2\u8996\u7d50\u679c',
  },
  'zh-Hans': {
    backHome: '\u8fd4\u56de\u4e3b\u9875',
    createdAt: (date) => `\u521b\u5efa\u4e8e ${date}`,
    delete: '\u5220\u9664',
    deleteConfirmation: (name) => `\u8981\u5220\u9664\u201c${name}\u201d\u5417\uff1f\u8fd9\u53ea\u4f1a\u5220\u9664\u8fd9\u53f0\u8bbe\u5907\u4e0a\u7684\u672c\u5730\u6587\u4ef6\uff0c\u4e14\u65e0\u6cd5\u6062\u590d\u3002`,
    edit: '\u7f16\u8f91\u7ed3\u679c',
    empty: '\u8fd9\u91cc\u8fd8\u6ca1\u6709\u5df2\u4fdd\u5b58\u7684\u6587\u4ef6\u3002\u521b\u5efa\u4e00\u4efd\u65b0\u7684\u79d8\u5bc6\u6587\u4ef6\u540e\uff0c\u5c31\u80fd\u4ece\u8fd9\u91cc\u7ee7\u7eed\u67e5\u770b\u6216\u7f16\u8f91\u3002',
    emptyAction: '\u521b\u5efa\u65b0\u6587\u4ef6',
    importDescription: '\u5f00\u53d1\u671f\u5de5\u5177\uff1a\u7c98\u8d34\u5b8c\u6574\u7684\u79d8\u6587\u4ef6 JSON\uff0c\u9a8c\u8bc1\u540e\u4fdd\u5b58\u5230\u6b64\u8bbe\u5907\u3002',
    importJson: '\u9a8c\u8bc1\u5e76\u5bfc\u5165',
    importLabel: '\u5bfc\u5165 JSON \u5b57\u7b26\u4e32',
    importPlaceholder: '{ "schemaVersion": 1, ... }',
    importSuccess: (name) => `\u5df2\u5bfc\u5165\u201c${name}\u201d\uff0c\u6b63\u5728\u6253\u5f00\u67e5\u770b\u9875\u3002`,
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `\u201c${name}\u201d\u7684 fileId \u5df2\u5b58\u5728\uff0c\u7ee7\u7eed\u5bfc\u5165\u4f1a\u76f4\u63a5\u8986\u76d6\u672c\u5730\u6587\u4ef6\u3002\n\n\u672c\u5730\u65e7\u6587\u4ef6\u6700\u540e\u7f16\u8f91\uff1a${existingUpdatedAt}\n\u5bfc\u5165\u65b0\u6587\u4ef6\u6700\u540e\u7f16\u8f91\uff1a${importedUpdatedAt}\n\n\u8981\u7ee7\u7eed\u8986\u76d6\u5417\uff1f`,
    progress: (answered, total) => `\u5df2\u586b\u5199 ${answered} / ${total}`,
    title: '\u67e5\u770b\u65e7\u6587\u4ef6',
    view: '\u67e5\u770b\u7ed3\u679c',
  },
  ja: {
    backHome: '\u30db\u30fc\u30e0\u3078\u623b\u308b',
    createdAt: (date) => `${date} \u306b\u4f5c\u6210`,
    delete: '\u524a\u9664',
    deleteConfirmation: (name) => `\u300c${name}\u300d\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f\u3053\u306e\u7aef\u672b\u306e\u30ed\u30fc\u30ab\u30eb\u30d5\u30a1\u30a4\u30eb\u3060\u3051\u304c\u524a\u9664\u3055\u308c\u3001\u5143\u306b\u623b\u305b\u307e\u305b\u3093\u3002`,
    edit: '\u7d50\u679c\u3092\u7de8\u96c6',
    empty: '\u4fdd\u5b58\u3055\u308c\u305f\u30d5\u30a1\u30a4\u30eb\u306f\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002\u65b0\u3057\u3044\u79d8\u5bc6\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u308b\u3068\u3001\u3053\u3053\u304b\u3089\u78ba\u8a8d\u3084\u7de8\u96c6\u3092\u7d9a\u3051\u3089\u308c\u307e\u3059\u3002',
    emptyAction: '\u65b0\u3057\u3044\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u308b',
    importDescription: '\u958b\u767a\u7528\u30c4\u30fc\u30eb\uff1a\u79d8\u5bc6\u30d5\u30a1\u30a4\u30eb\u306e JSON \u5168\u4f53\u3092\u8cbc\u308a\u4ed8\u3051\u3001\u691c\u8a3c\u5f8c\u306b\u3053\u306e\u7aef\u672b\u3078\u4fdd\u5b58\u3057\u307e\u3059\u3002',
    importJson: '\u691c\u8a3c\u3057\u3066\u30a4\u30f3\u30dd\u30fc\u30c8',
    importLabel: 'JSON \u6587\u5b57\u5217\u3092\u30a4\u30f3\u30dd\u30fc\u30c8',
    importPlaceholder: '{ "schemaVersion": 1, ... }',
    importSuccess: (name) => `\u300c${name}\u300d\u3092\u30a4\u30f3\u30dd\u30fc\u30c8\u3057\u307e\u3057\u305f\u3002\u95b2\u89a7\u30da\u30fc\u30b8\u3092\u958b\u3044\u3066\u3044\u307e\u3059\u3002`,
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `\u300c${name}\u300d\u3068\u540c\u3058 fileId \u304c\u5b58\u5728\u3057\u307e\u3059\u3002\u7d9a\u884c\u3059\u308b\u3068\u7aef\u672b\u306e\u30d5\u30a1\u30a4\u30eb\u3092\u76f4\u63a5\u4e0a\u66f8\u304d\u3057\u307e\u3059\u3002\n\n\u7aef\u672b\u306e\u65e7\u30d5\u30a1\u30a4\u30eb\u306e\u6700\u7d42\u7de8\u96c6\uff1a${existingUpdatedAt}\n\u30a4\u30f3\u30dd\u30fc\u30c8\u3059\u308b\u65b0\u30d5\u30a1\u30a4\u30eb\u306e\u6700\u7d42\u7de8\u96c6\uff1a${importedUpdatedAt}\n\n\u4e0a\u66f8\u304d\u3057\u307e\u3059\u304b\uff1f`,
    progress: (answered, total) => `${answered} / ${total} \u56de\u7b54\u6e08\u307f`,
    title: '\u4ee5\u524d\u306e\u30d5\u30a1\u30a4\u30eb',
    view: '\u7d50\u679c\u3092\u898b\u308b',
  },
  en: {
    backHome: 'Home',
    createdAt: (date) => `Created ${date}`,
    delete: 'Delete',
    deleteConfirmation: (name) => `Delete "${name}"? This only removes the local file on this device and cannot be undone.`,
    edit: 'Edit results',
    empty: 'There are no saved files yet. Create a new secret file, then return here to review or edit it.',
    emptyAction: 'Create a new file',
    importDescription: 'Development tool: paste a complete secret-file JSON document to validate and save it on this device.',
    importJson: 'Validate and import',
    importLabel: 'Import JSON string',
    importPlaceholder: '{ "schemaVersion": 1, ... }',
    importSuccess: (name) => `Imported "${name}". Opening the preview.`,
    overwriteConfirmation: (name, existingUpdatedAt, importedUpdatedAt) =>
      `A file with the same fileId as "${name}" already exists. Continuing will overwrite the local file.\n\nExisting file last edited: ${existingUpdatedAt}\nImported file last edited: ${importedUpdatedAt}\n\nContinue and overwrite it?`,
    progress: (answered, total) => `${answered} / ${total} answered`,
    title: 'Old Files',
    view: 'View results',
  },
};

export function getFileManagerMessages(locale: AppLocale): FileManagerMessages {
  return messagesByLocale[locale];
}
