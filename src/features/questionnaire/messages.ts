import type { AppLocale } from '../../app/i18n';
import { secretKeeperNames } from '../../app/i18n/terminology';
import type {
  AnsweredSecretFileAnswer,
  ExperienceAnswer,
  PreferenceAnswer,
  QuestionRole,
  SecretFileScope,
} from '../secret-file';

export interface QuestionnaireMessages {
  answerRequired: string;
  autoAdvance: (seconds: number) => string;
  autoAdvanceAction: string;
  backQuestion: string;
  categoryVisualAlt: (categoryName: string) => string;
  completedProgress: (completed: number, total: number) => string;
  closeDetails: string;
  detailListDescription: string;
  detailSeeDetailsExplanation: string;
  detailListTitle: string;
  detailWarningPrefix: string;
  experienceLabels: Record<ExperienceAnswer, string>;
  experienceLegend: string;
  fileLimitReached: (limit: number) => string;
  fileCreateFailed: string;
  fileStatus: string;
  intro: {
    autosaveAction: string;
    autosaveLines: string[];
    categoryCountAction: string;
    categoryCountLines: (count: number) => string[];
    explanationAction: string;
    explanationLines: string[];
    notReady: string;
    questionCountAction: string;
    questionCountLines: (count: number) => string[];
    ready: string;
    readyLines: (profileName: string) => string[];
    speakerName: string;
    scopeChoices: Array<{ label: string; scope: SecretFileScope; suffix?: string }>;
    scopeHelp: string;
    scopeLines: (profileName: string) => string[];
  };
  noteHelp: string;
  noteLabel: string;
  notePlaceholder: string;
  nextQuestion: string;
  preferenceLabels: Record<PreferenceAnswer, string>;
  preferenceLegend: string;
  progress: (current: number, total: number) => string;
  results: {
    answerSummary: (experience: string, preference: string) => string;
    categorySectionTitle: string;
    detailProgress: (answered: number, total: number) => string;
    detailStartAll: string;
    detailStartCancel: string;
    detailStartTitle: string;
    detailStartUnanswered: string;
    editCategoryAria: (categoryName: string) => string;
    editHint: string;
    editing: string;
    fileActionsLabel: string;
    lastEdited: (date: string) => string;
    otherSummary: string;
    overallProgress: string;
    preview: string;
    roleSwitchLabel: string;
    sectionKicker: (roleLabel: string) => string;
    experienceSeeDetailsSummary: (preference: string) => string;
    preferenceSeeDetailsSummary: (experience: string) => string;
    seeDetailsSummary: string;
    spotlightCount: (selected: number, limit: number) => string;
    spotlightCurrent: string;
    spotlightDelete: string;
    spotlightDialogTitle: string;
    spotlightEmpty: string;
    spotlightHelp: string;
    spotlightSelect: string;
    spotlightSlotAria: (slot: number, item: string | null) => string;
    spotlightTitle: string;
    title: (profileName: string) => string;
    unansweredSummary: string;
    upload: string;
    uploadCancel: string;
    uploadClose: string;
    uploadConfigurationError: string;
    uploadConfirm: string;
    uploadConfirmBody: string;
    uploadConfirmTitle: string;
    uploadLegalAfter: string;
    uploadLegalBetween: string;
    uploadLegalBefore: string;
    uploadFailed: string;
    uploadOpenFile: string;
    uploadPopupBlocked: string;
    uploadPreviewHint: string;
    uploadDuplicateBody: string;
    uploadDuplicateTitle: string;
    uploadRateLimitTitle: string;
    uploadRateLimited: (time: string) => string;
    uploadRateLimitedUnknown: string;
    uploadSiteBusy: (time: string) => string;
    uploadSiteBusyUnknown: string;
    uploadSuccessBody: string;
    uploadSuccessBodyUnlinked: string;
    uploadSuccessTitle: string;
    uploading: string;
  };
  roleLabels: Record<QuestionRole, string>;
  storageWarning: string;
  viewDetails: string;
}

function formatTimestamp(locale: AppLocale, value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(date);
}

const zhHant: QuestionnaireMessages = {
  answerRequired: '請先選擇經驗程度與喜好程度。',
  autoAdvance: (seconds) => `答案已存好，${seconds} 秒後會自動前往下一題。`,
  autoAdvanceAction: '自動進入中',
  backQuestion: '上一題',
  categoryVisualAlt: (categoryName) => `${categoryName}的分類示意圖`,
  completedProgress: (completed, total) => `已完成 ${completed} / ${total}`,
  closeDetails: '關閉詳細列表',
  detailListDescription: '這裡只供閱覽，先看看每一項在這個分類裡的描述。',
  detailSeeDetailsExplanation: '若選擇參考細項，代表你希望閱讀者用你未來在細項的填答來了解，而非為整個分類選擇一種狀態。',
  detailListTitle: '細項列表',
  detailWarningPrefix: '高風險項目：',
  experienceLabels: {
    none: '無',
    little: '少量',
    some: '一些',
    extensive: '大量',
    veryExtensive: '熟練',
    unsure: '不確定',
    seeDetails: '參考詳細',
  },
  experienceLegend: '你的經驗程度',
  fileLimitReached: (limit) => `這台裝置已保存 ${limit} 份祕密檔案。請先從舊檔案刪除一份，再建立新的檔案。`,
  fileCreateFailed: '暫時無法建立檔案，請稍後再試一次。',
  fileStatus: '回到檔案狀態',
  intro: {
    autosaveAction: '太.....太好了',
    autosaveLines: [
      '填答過程是即時儲存的，你可以隨時離開，也可以隨時回來繼續填答。',
      '甚至也可以把你的檔案傳送到其他裝置繼續作答！',
    ],
    categoryCountAction: '(驚魂未定)',
    categoryCountLines: (count) => [
      `哈？嚇到你了？沒事的我們將這些問題整理成了${count}個分類。`,
      '你只需要先把你對每個分類的感受告訴我就好。',
    ],
    explanationAction: '我了解了',
    explanationLines: [
      '所有的問題，我們都會分類為主導側和配合側兩種方向。',
      '前者代表你是在互動中主導/施予/執行的那一個角色，後者則是配合/接納/承受的那一個角色。',
    ],
    notReady: '還沒......',
    questionCountAction: '(((ﾟДﾟ;)))',
    questionCountLines: (count) => [`恩......好的，那我們這邊總共有${count}個問題！`],
    ready: '準備好了',
    readyLines: (profileName) => [`${profileName}，準備好開始第一階段的填答了嗎？`],
    speakerName: secretKeeperNames['zh-Hant'],
    scopeChoices: [
      { label: '僅顯示主導側', scope: 'activeOnly' },
      { label: '僅顯示配合側', scope: 'passiveOnly' },
      { label: '顯示所有問題', scope: 'all' },
    ],
    scopeHelp: '這些是甚麼？',
    scopeLines: (profileName) => [
      `嗨，${profileName}！很高興在這裡看到你。開始之前，我希望我們先確定測驗的範圍。`,
    ],
  },
  noteHelp: '選填，最多 80 個字；請不要填入連結。',
  noteLabel: '想補充的小提醒',
  notePlaceholder: '不確定也可以留白',
  nextQuestion: '下一題',
  preferenceLabels: {
    hardNo: '絕對禁止',
    reluctant: '勉強',
    neutral: '中立',
    like: '喜歡',
    love: '很喜歡',
    unsure: '不確定',
    seeDetails: '參考詳細',
  },
  preferenceLegend: '你目前的喜好程度',
  progress: (current, total) => `分類 ${current} / ${total}`,
  results: {
    answerSummary: (experience, preference) => `經驗${experience}，${preference}`,
    categorySectionTitle: '分類整理',
    detailProgress: (answered, total) => `細項 ${answered} / ${total}`,
    detailStartAll: '顯示本分類所有題目',
    detailStartCancel: '取消',
    detailStartTitle: '要從那些題目開始作答呢？',
    detailStartUnanswered: '僅顯示未作答的題目',
    editCategoryAria: (categoryName) => `編輯${categoryName}`,
    editHint: '點選任何分類，就能繼續編輯裡面的細項',
    editing: '正在編輯',
    fileActionsLabel: '檔案操作',
    lastEdited: (date) => `最後編輯於 ${formatTimestamp('zh-Hant', date)}`,
    otherSummary: '從細項開始整理',
    overallProgress: '整份細項進度',
    preview: '檢視預覽',
    roleSwitchLabel: '切換互動方向',
    sectionKicker: (roleLabel) => `目前顯示・${roleLabel}`,
    experienceSeeDetailsSummary: (preference) => `經驗參考詳細，${preference}`,
    preferenceSeeDetailsSummary: (experience) => `經驗${experience}，喜好參考詳細`,
    seeDetailsSummary: '參考詳細',
    spotlightCount: (selected, limit) => `已選 ${selected} / ${limit}`,
    spotlightCurrent: '目前選擇',
    spotlightDelete: '刪除這個焦點喜好',
    spotlightDialogTitle: '選擇焦點喜好',
    spotlightEmpty: '目前還沒有填寫「喜歡」或「很喜歡」的項目。',
    spotlightHelp: '挑出最想先讓人看見的分類或項目。',
    spotlightSelect: '選擇這個項目',
    spotlightSlotAria: (slot, item) => item ? `編輯第 ${slot} 個焦點喜好：${item}` : `新增第 ${slot} 個焦點喜好`,
    spotlightTitle: '你的焦點喜好',
    title: (profileName) => `${profileName}的祕密檔案`,
    unansweredSummary: '分類感受尚未填寫',
    upload: '上傳至雲端',
    uploadCancel: '取消',
    uploadClose: '關閉',
    uploadConfigurationError: '雲端分享尚未完成設定，請稍後再試。',
    uploadConfirm: '了解並建立分享連結',
    uploadConfirmBody: '建立後，任何取得完整連結的人都能查看這份敏感檔案。雲端檔案會長期保存，且目前無法由一般使用者自行修改或刪除。',
    uploadConfirmTitle: '確定要上傳嗎？',
    uploadLegalBefore: '按下「了解並建立分享連結」，表示你已閱讀',
    uploadLegalBetween: '與',
    uploadLegalAfter: '，並明確同意將這份可能含有敏感內容的檔案上傳為雲端分享版本。',
    uploadFailed: '這次無法完成上傳，請確認網路連線後再試一次。',
    uploadOpenFile: '檢視雲端檔案',
    uploadPopupBlocked: '瀏覽器沒有開啟新分頁，你仍可使用下方連結檢視雲端檔案。',
    uploadPreviewHint: '你也可以先透過檢視預覽的按鈕，先查看檔案發布後會有的呈現。',
    uploadDuplicateBody: '這份檔案目前的內容已經上傳過了，因此沒有建立重複的雲端檔案。你可以直接開啟先前的雲端檔案。',
    uploadDuplicateTitle: '這份內容已經上傳過了',
    uploadRateLimitTitle: '暫時無法再次上傳',
    uploadRateLimited: (time) => `已達目前的上傳次數上限，約${time}後重置。`,
    uploadRateLimitedUnknown: '已達目前的上傳次數上限，請稍後再試。',
    uploadSiteBusy: (time) => `網站目前的上傳量已達上限，約${time}後重置。`,
    uploadSiteBusyUnknown: '網站目前的上傳量已達上限，請稍後再試。',
    uploadSuccessBody: '這份不可修改的雲端檔案已建立，並已連結到這台裝置的檔案庫。',
    uploadSuccessBodyUnlinked: '雲端檔案已建立，但無法把連結保存到這台裝置。請先保留或開啟下方連結。',
    uploadSuccessTitle: '上傳完成',
    uploading: '正在安全地建立雲端檔案…',
  },
  roleLabels: {
    active: '主導側',
    passive: '配合側',
  },
  storageWarning: '目前無法使用瀏覽器持久儲存；這次作答暫時保留在目前頁面，離開後可能無法恢復。',
  viewDetails: '查看細項列表',
};

const zhHans: QuestionnaireMessages = {
  ...zhHant,
  answerRequired: '请先选择经验程度与喜好程度。',
  autoAdvance: (seconds) => `答案已保存，${seconds} 秒后会自动前往下一题。`,
  autoAdvanceAction: '自动进入中',
  backQuestion: '上一题',
  categoryVisualAlt: (categoryName) => `${categoryName}的分类示意图`,
  completedProgress: (completed, total) => `已完成 ${completed} / ${total}`,
  closeDetails: '关闭详细列表',
  detailListDescription: '这里只供阅览，先看看这个分类中每一项的描述。',
  detailSeeDetailsExplanation: '若选择参考细项，代表你希望阅读者通过你未来的细项填写来了解，而非为整个分类选择一种状态。',
  detailListTitle: '细项列表',
  detailWarningPrefix: '高风险项目：',
  experienceLabels: {
    none: '无',
    little: '少量',
    some: '一些',
    extensive: '大量',
    veryExtensive: '熟练',
    unsure: '不确定',
    seeDetails: '参考详细',
  },
  experienceLegend: '你的经验程度',
  fileLimitReached: (limit) => `这台装置已保存 ${limit} 份秘密档案。请先从旧档案删除一份，再创建新的档案。`,
  fileCreateFailed: '暂时无法创建档案，请稍后再试一次。',
  fileStatus: '返回档案状态',
  intro: {
    ...zhHant.intro,
    autosaveAction: '太……太好了',
    autosaveLines: [
      '填写过程会即时保存，你可以随时离开，也可以随时回来继续。',
      '甚至还可以把档案传到其他装置继续填写！',
    ],
    categoryCountAction: '（惊魂未定）',
    categoryCountLines: (count) => [
      `吓到你了吗？没事，我们已经把这些问题整理成${count}个分类。`,
      '你只需要先告诉我，你对每个分类的感受。',
    ],
    explanationAction: '我了解了',
    scopeLines: (profileName) => [
      `嗨，${profileName}！很高兴在这里看到你。开始前，我们先确定测验范围。`,
    ],
    explanationLines: [
      '所有问题都会分为主导侧与配合侧两个方向。',
      '前者代表在互动中主导、施予或执行的一方，后者代表配合、接纳或承受的一方。',
    ],
    readyLines: (profileName) => [`${profileName}，准备好开始第一阶段的填写了吗？`],
    ready: '准备好了',
    speakerName: secretKeeperNames['zh-Hans'],
    notReady: '还没……',
    questionCountAction: '(((ﾟДﾟ;)))',
    questionCountLines: (count) => [`嗯……好的，这里总共有${count}个问题！`],
    scopeChoices: [
      { label: '仅显示主导侧', scope: 'activeOnly' },
      { label: '仅显示配合侧', scope: 'passiveOnly' },
      { label: '显示所有问题', scope: 'all' },
    ],
    scopeHelp: '这些是什么？',
  },
  roleLabels: {
    active: '主导侧',
    passive: '配合侧',
  },
  noteHelp: '选填，最多 80 个字符；请勿填写链接。',
  noteLabel: '想补充的小提醒',
  notePlaceholder: '不确定也可以留空',
  nextQuestion: '下一题',
  preferenceLegend: '你目前的喜好程度',
  preferenceLabels: {
    hardNo: '绝对禁止',
    reluctant: '勉强',
    neutral: '中立',
    like: '喜欢',
    love: '很喜欢',
    unsure: '不确定',
    seeDetails: '参考详细',
  },
  results: {
    ...zhHant.results,
    answerSummary: (experience, preference) => `经验${experience}，${preference}`,
    categorySectionTitle: '分类整理',
    detailProgress: (answered, total) => `细项 ${answered} / ${total}`,
    detailStartAll: '显示本分类所有问题',
    detailStartCancel: '取消',
    detailStartTitle: '要从哪些问题开始作答呢？',
    detailStartUnanswered: '仅显示未作答的问题',
    editCategoryAria: (categoryName) => `编辑${categoryName}`,
    editHint: '点选任何分类，就能继续编辑里面的细项',
    editing: '正在编辑',
    fileActionsLabel: '文件操作',
    lastEdited: (date) => `最后编辑于 ${formatTimestamp('zh-Hans', date)}`,
    otherSummary: '从细项开始整理',
    overallProgress: '整份细项进度',
    preview: '查看预览',
    roleSwitchLabel: '切换互动方向',
    sectionKicker: (roleLabel) => `当前显示・${roleLabel}`,
    experienceSeeDetailsSummary: (preference) => `经验参考详细，${preference}`,
    preferenceSeeDetailsSummary: (experience) => `经验${experience}，喜好参考详细`,
    seeDetailsSummary: '参考详细',
    spotlightCount: (selected, limit) => `已选 ${selected} / ${limit}`,
    spotlightCurrent: '当前选择',
    spotlightDelete: '删除这个焦点喜好',
    spotlightDialogTitle: '选择焦点喜好',
    spotlightEmpty: '目前还没有填写“喜欢”或“很喜欢”的项目。',
    spotlightHelp: '挑出最想先让人看见的分类或项目。',
    spotlightSelect: '选择这个项目',
    spotlightSlotAria: (slot, item) => item ? `编辑第 ${slot} 个焦点喜好：${item}` : `新增第 ${slot} 个焦点喜好`,
    spotlightTitle: '你的焦点喜好',
    title: (profileName) => `${profileName}的秘密档案`,
    unansweredSummary: '分类感受尚未填写',
    upload: '上传至云端',
    uploadCancel: '取消',
    uploadClose: '关闭',
    uploadConfigurationError: '云端分享尚未完成设置，请稍后再试。',
    uploadConfirm: '了解并建立分享链接',
    uploadConfirmBody: '建立后，任何取得完整链接的人都能查看这份敏感档案。云端文件会长期保存，且目前无法由一般使用者自行修改或删除。',
    uploadConfirmTitle: '确定要上传吗？',
    uploadLegalBefore: '按下“了解并建立分享链接”，表示你已阅读',
    uploadLegalBetween: '与',
    uploadLegalAfter: '，并明确同意将这份可能含有敏感内容的档案上传为云端分享版本。',
    uploadFailed: '本次无法完成上传，请确认网络连接后再试。',
    uploadOpenFile: '查看云端文件',
    uploadPopupBlocked: '浏览器未打开新标签页，你仍可使用下方链接查看云端文件。',
    uploadPreviewHint: '你也可以先使用查看预览按钮，确认文件发布后的呈现方式。',
    uploadDuplicateBody: '此文件的当前内容已经上传过，因此没有建立重复的云端文件。你可以直接打开之前的云端文件。',
    uploadDuplicateTitle: '此内容已经上传过',
    uploadRateLimitTitle: '暂时无法再次上传',
    uploadRateLimited: (time) => `已达到当前的上传次数上限，约${time}后重置。`,
    uploadRateLimitedUnknown: '已达到当前的上传次数上限，请稍后重试。',
    uploadSiteBusy: (time) => `网站当前的上传量已达到上限，约${time}后重置。`,
    uploadSiteBusyUnknown: '网站当前的上传量已达到上限，请稍后重试。',
    uploadSuccessBody: '不可修改的云端文件已建立，并已连接到此设备的文件库。',
    uploadSuccessBodyUnlinked: '云端文件已建立，但无法将链接保存到此设备。请先保留或打开下方链接。',
    uploadSuccessTitle: '上传完成',
    uploading: '正在安全地建立云端文件…',
  },
  storageWarning: '目前无法使用浏览器持久存储；这次填写暂时保留在当前页面，离开后可能无法恢复。',
  viewDetails: '查看细项列表',
};

const ja: QuestionnaireMessages = {
  ...zhHant,
  answerRequired: '経験と興味の両方を選んでください。',
  autoAdvance: (seconds) => `回答を保存しました。${seconds} 秒後に次の質問へ進みます。`,
  autoAdvanceAction: '自動で次へ',
  backQuestion: '前の質問',
  categoryVisualAlt: (categoryName) => `${categoryName}のカテゴリーイメージ`,
  completedProgress: (completed, total) => `${completed} / ${total} 回答済み`,
  closeDetails: '詳細リストを閉じる',
  detailListDescription: 'ここでは回答せず、このカテゴリーに含まれる項目の説明だけを確認できます。',
  detailSeeDetailsExplanation: '詳細項目を参照する場合は、カテゴリー全体に一つの状態を選ぶのではなく、読む人に後で各詳細項目への回答から理解してもらいたいという意味です。',
  detailListTitle: '詳細リスト',
  detailWarningPrefix: '高リスク項目：',
  experienceLabels: {
    none: 'なし',
    little: '少し',
    some: 'ある程度',
    extensive: '多い',
    veryExtensive: '熟練',
    unsure: 'わからない',
    seeDetails: '詳細を参照',
  },
  experienceLegend: '経験の程度',
  fileLimitReached: (limit) => `この端末にはすでに${limit}件の秘密ファイルがあります。古いファイルを1件削除してから、新しいファイルを作成してください。`,
  fileCreateFailed: 'ファイルを作成できませんでした。しばらくしてから、もう一度お試しください。',
  fileStatus: 'ファイルの状態に戻る',
  intro: {
    ...zhHant.intro,
    autosaveAction: 'そ、それなら安心した……',
    autosaveLines: [
      '回答はその都度保存されます。いつ離れても、戻って続きから再開できます。',
      'ファイルを別の端末へ移して、そちらで続きを回答することもできます。',
    ],
    categoryCountAction: '（まだ少し驚いている）',
    categoryCountLines: (count) => [
      `びっくりした？大丈夫。質問は${count}個のカテゴリーに整理してあるよ。`,
      'まずは、それぞれのカテゴリーについて今の気持ちを教えてください。',
    ],
    explanationAction: 'わかった',
    scopeLines: (profileName) => [
      `こんにちは、${profileName}。会えてうれしいよ。始める前に、質問の範囲を決めましょう。`,
    ],
    explanationLines: [
      'すべての質問は、リード側とフォロー側の二つの方向に分けています。',
      '前者はやり取りで主導・施与・実行を担う側、後者はそれに合わせて受け止める側を表します。',
    ],
    readyLines: (profileName) => [
      `${profileName}、第一段階の回答を始める準備はできましたか？`,
    ],
    ready: '準備できた',
    speakerName: secretKeeperNames.ja,
    notReady: 'まだ……',
    questionCountAction: '(((ﾟДﾟ;)))',
    questionCountLines: (count) => [`ええと……全部で${count}問あります！`],
    scopeChoices: [
      { label: 'リード側のみ', scope: 'activeOnly' },
      { label: 'フォロー側のみ', scope: 'passiveOnly' },
      { label: 'すべて表示', scope: 'all' },
    ],
    scopeHelp: 'どういう意味？',
  },
  noteHelp: '任意・80文字まで。リンクは入力できません。',
  noteLabel: '小さなメモ',
  notePlaceholder: '迷っているなら空欄でも大丈夫です',
  nextQuestion: '次の質問',
  preferenceLegend: '現在の興味',
  preferenceLabels: {
    hardNo: '絶対不可',
    reluctant: '条件次第',
    neutral: '中立',
    like: '好き',
    love: '大好き',
    unsure: 'わからない',
    seeDetails: '詳細を参照',
  },
  progress: (current, total) => `カテゴリー ${current} / ${total}`,
  results: {
    ...zhHant.results,
    answerSummary: (experience, preference) => `経験は${experience}、好みは${preference}`,
    categorySectionTitle: 'カテゴリー整理',
    detailProgress: (answered, total) => `詳細 ${answered} / ${total}`,
    detailStartAll: 'このカテゴリーのすべての質問を表示',
    detailStartCancel: 'キャンセル',
    detailStartTitle: 'どの質問から回答しますか？',
    detailStartUnanswered: '未回答の質問のみ表示',
    editCategoryAria: (categoryName) => `${categoryName}を編集`,
    editHint: 'カテゴリーを選ぶと、その中の詳細を編集できます',
    editing: '編集中',
    fileActionsLabel: 'ファイル操作',
    lastEdited: (date) => `${formatTimestamp('ja', date)} に最終編集`,
    otherSummary: '詳細から整理する',
    overallProgress: '詳細全体の進捗',
    preview: 'プレビュー',
    roleSwitchLabel: '役割を切り替える',
    sectionKicker: (roleLabel) => `表示中・${roleLabel}`,
    experienceSeeDetailsSummary: (preference) => `経験は詳細を参照、好みは${preference}`,
    preferenceSeeDetailsSummary: (experience) => `経験は${experience}、好みは詳細を参照`,
    seeDetailsSummary: '詳細を参照',
    spotlightCount: (selected, limit) => `${selected} / ${limit} 選択済み`,
    spotlightCurrent: '現在の選択',
    spotlightDelete: 'この注目ポイントを削除',
    spotlightDialogTitle: '注目ポイントを選ぶ',
    spotlightEmpty: '「好き」または「大好き」と回答した項目はまだありません。',
    spotlightHelp: '最初に見てほしいカテゴリーや項目を選びます。',
    spotlightSelect: 'この項目を選ぶ',
    spotlightSlotAria: (slot, item) => item ? `${slot} 番目の注目ポイントを編集：${item}` : `${slot} 番目の注目ポイントを追加`,
    spotlightTitle: 'あなたの注目ポイント',
    title: (profileName) => `${profileName}の秘密ファイル`,
    unansweredSummary: 'カテゴリー回答は未入力',
    upload: 'クラウドへアップロード',
    uploadCancel: 'キャンセル',
    uploadClose: '閉じる',
    uploadConfigurationError: 'クラウド共有の設定がまだ完了していません。しばらくしてからお試しください。',
    uploadConfirm: '確認して共有リンクを作成',
    uploadConfirmBody: '作成後は、完全なリンクを持つ人なら誰でもこの機微なファイルを閲覧できます。クラウドファイルは長期保存され、現在は一般利用者が変更・削除できません。',
    uploadConfirmTitle: 'アップロードしますか？',
    uploadLegalBefore: '「確認して共有リンクを作成」を押すと、',
    uploadLegalBetween: 'と',
    uploadLegalAfter: 'を読み、機微な内容を含む可能性のあるファイルをクラウド共有版としてアップロードすることに明示的に同意したものとします。',
    uploadFailed: 'アップロードできませんでした。通信状態を確認して、もう一度お試しください。',
    uploadOpenFile: 'クラウドファイルを見る',
    uploadPopupBlocked: '新しいタブを開けませんでした。下のリンクからクラウドファイルを表示できます。',
    uploadPreviewHint: '先に「プレビューを見る」ボタンから、公開後の表示を確認することもできます。',
    uploadDuplicateBody: 'このファイルの現在の内容はすでにアップロード済みのため、重複するクラウドファイルは作成しませんでした。先ほどのクラウドファイルをそのまま開けます。',
    uploadDuplicateTitle: 'この内容はアップロード済みです',
    uploadRateLimitTitle: '現在は再アップロードできません',
    uploadRateLimited: (time) => `現在のアップロード上限に達しました。約${time}後にリセットされます。`,
    uploadRateLimitedUnknown: '現在のアップロード上限に達しました。しばらくしてからお試しください。',
    uploadSiteBusy: (time) => `現在、サイト全体のアップロード上限に達しています。約${time}後にリセットされます。`,
    uploadSiteBusyUnknown: '現在、サイト全体のアップロード上限に達しています。しばらくしてからお試しください。',
    uploadSuccessBody: '変更できないクラウドファイルを作成し、この端末のファイルライブラリにリンクしました。',
    uploadSuccessBodyUnlinked: 'クラウドファイルは作成されましたが、この端末にリンクを保存できませんでした。下のリンクを控えるか、先に開いてください。',
    uploadSuccessTitle: 'アップロード完了',
    uploading: '安全なクラウドファイルを作成しています…',
  },
  roleLabels: {
    active: 'リード側',
    passive: 'フォロー側',
  },
  storageWarning: 'ブラウザーに保存できません。現在のページには残りますが、離れると復元できない可能性があります。',
  viewDetails: '詳細リストを見る',
};

const en: QuestionnaireMessages = {
  ...zhHant,
  answerRequired: 'Choose both an experience level and a preference level.',
  autoAdvance: (seconds) => `Your answer is saved. The next question opens in ${seconds} seconds.`,
  autoAdvanceAction: 'Opening automatically',
  backQuestion: 'Previous question',
  categoryVisualAlt: (categoryName) => `${categoryName} category illustration`,
  completedProgress: (completed, total) => `${completed} of ${total} completed`,
  closeDetails: 'Close detail list',
  detailListDescription: 'This is read-only. Review the descriptions for the items in this category.',
  detailSeeDetailsExplanation: 'Choosing Reference details means you would rather readers understand this through your future detailed answers than choose one status for the whole category.',
  detailListTitle: 'Detail list',
  detailWarningPrefix: 'Higher-risk item: ',
  experienceLabels: {
    none: 'None',
    little: 'Little',
    some: 'Some',
    extensive: 'Extensive',
    veryExtensive: 'Expert',
    unsure: 'Unsure',
    seeDetails: 'See details',
  },
  experienceLegend: 'Your experience',
  fileLimitReached: (limit) => `This device already has ${limit} secret files. Delete one old file before creating a new one.`,
  fileCreateFailed: 'The file could not be created. Please try again in a moment.',
  fileStatus: 'Return to file status',
  intro: {
    ...zhHant.intro,
    autosaveAction: 'That is… a relief',
    autosaveLines: [
      'Your answers are saved as you go. You can leave at any time and return whenever you are ready.',
      'You can even move your file to another device and continue there.',
    ],
    categoryCountAction: '(Still recovering)',
    categoryCountLines: (count) => [
      `Did that number startle you? It is okay—we have organized the questions into ${count} categories.`,
      'For now, you only need to tell me how you feel about each category.',
    ],
    explanationAction: 'I understand',
    scopeLines: (profileName) => [
      `Hi, ${profileName}! It is good to see you. Before we begin, let us choose the scope of the questionnaire.`,
    ],
    explanationLines: [
      'Every question is grouped into a Leading and a Following direction.',
      'Leading means taking the lead, giving, or carrying out the interaction; Following means joining in, receiving, or experiencing it.',
    ],
    readyLines: (profileName) => [`${profileName}, are you ready to begin the first stage?`],
    ready: 'I am ready',
    speakerName: secretKeeperNames.en,
    notReady: 'Not yet…',
    questionCountAction: '(((ﾟДﾟ;)))',
    questionCountLines: (count) => [`All right… there are ${count} questions in total!`],
    scopeChoices: [
      { label: 'Leading only', scope: 'activeOnly' },
      { label: 'Following only', scope: 'passiveOnly' },
      { label: 'Show all', scope: 'all' },
    ],
    scopeHelp: 'What does that mean?',
  },
  noteHelp: 'Optional, up to 80 characters. Links are not allowed.',
  noteLabel: 'A small note',
  notePlaceholder: 'It is okay to leave this blank',
  nextQuestion: 'Next question',
  preferenceLegend: 'Your current preference',
  preferenceLabels: {
    hardNo: 'Hard no',
    reluctant: 'Reluctant',
    neutral: 'Neutral',
    like: 'Like',
    love: 'Love',
    unsure: 'Unsure',
    seeDetails: 'See details',
  },
  progress: (current, total) => `Category ${current} of ${total}`,
  results: {
    ...zhHant.results,
    answerSummary: (experience, preference) => `${experience} experience, ${preference}`,
    categorySectionTitle: 'Categories',
    detailProgress: (answered, total) => `Details ${answered} / ${total}`,
    detailStartAll: 'Show all questions in this category',
    detailStartCancel: 'Cancel',
    detailStartTitle: 'Which questions would you like to answer?',
    detailStartUnanswered: 'Show unanswered questions only',
    editCategoryAria: (categoryName) => `Edit ${categoryName}`,
    editHint: 'Choose any category to continue editing its details',
    editing: 'Editing',
    fileActionsLabel: 'File actions',
    lastEdited: (date) => `Last edited ${formatTimestamp('en', date)}`,
    otherSummary: 'Start with the details',
    overallProgress: 'Overall detail progress',
    preview: 'View preview',
    roleSwitchLabel: 'Switch interaction role',
    sectionKicker: (roleLabel) => `Showing · ${roleLabel}`,
    experienceSeeDetailsSummary: (preference) => `See details for experience, ${preference}`,
    preferenceSeeDetailsSummary: (experience) => `${experience} experience, see details for preference`,
    seeDetailsSummary: 'See details',
    spotlightCount: (selected, limit) => `${selected} of ${limit} selected`,
    spotlightCurrent: 'Current selection',
    spotlightDelete: 'Remove this highlight',
    spotlightDialogTitle: 'Choose a highlight',
    spotlightEmpty: 'You have not answered Like or Love for any items yet.',
    spotlightHelp: 'Choose the categories or items you most want people to notice first.',
    spotlightSelect: 'Choose this item',
    spotlightSlotAria: (slot, item) => item ? `Edit highlight ${slot}: ${item}` : `Add highlight ${slot}`,
    spotlightTitle: 'Your highlights',
    title: (profileName) => `${profileName}'s secret file`,
    unansweredSummary: 'Category answer not filled in',
    upload: 'Upload to cloud',
    uploadCancel: 'Cancel',
    uploadClose: 'Close',
    uploadConfigurationError: 'Cloud sharing has not been configured yet. Please try again later.',
    uploadConfirm: 'Understand and create sharing link',
    uploadConfirmBody: 'After creation, anyone with the complete link can view this sensitive file. The cloud file is retained long-term and cannot currently be changed or deleted by an ordinary user.',
    uploadConfirmTitle: 'Upload this file?',
    uploadLegalBefore: 'By selecting “Understand and create sharing link,” you confirm that you have read the',
    uploadLegalBetween: 'and',
    uploadLegalAfter: ', and expressly consent to uploading this file—which may contain sensitive content—as a cloud sharing copy.',
    uploadFailed: 'The upload could not be completed. Check your connection and try again.',
    uploadOpenFile: 'View cloud file',
    uploadPopupBlocked: 'The browser did not open a new tab. You can still use the link below to view the cloud file.',
    uploadPreviewHint: 'You can also use View Preview first to check how the file will look after it is published.',
    uploadDuplicateBody: 'This version of the file has already been uploaded, so no duplicate cloud file was created. You can open the existing cloud file instead.',
    uploadDuplicateTitle: 'This version is already uploaded',
    uploadRateLimitTitle: 'Another upload is not available yet',
    uploadRateLimited: (time) => `The current upload limit will reset in about ${time}.`,
    uploadRateLimitedUnknown: 'The current upload limit has been reached. Please try again later.',
    uploadSiteBusy: (time) => `The site-wide upload limit will reset in about ${time}.`,
    uploadSiteBusyUnknown: 'The site-wide upload limit has been reached. Please try again later.',
    uploadSuccessBody: 'An immutable cloud file was created and linked in the file library on this device.',
    uploadSuccessBodyUnlinked: 'The cloud file was created, but its link could not be saved on this device. Please keep or open the link below first.',
    uploadSuccessTitle: 'Upload complete',
    uploading: 'Securely creating the cloud file…',
  },
  roleLabels: {
    active: 'Leading',
    passive: 'Following',
  },
  storageWarning: 'Browser storage is unavailable. This session is still here for now, but it may not be recoverable after you leave.',
  viewDetails: 'View detail list',
};

const messagesByLocale: Record<AppLocale, QuestionnaireMessages> = {
  'zh-Hant': zhHant,
  'zh-Hans': zhHans,
  ja,
  en,
};

export function getQuestionnaireMessages(locale: AppLocale): QuestionnaireMessages {
  return messagesByLocale[locale];
}

export function getResultsAnswerSummary(
  messages: QuestionnaireMessages,
  answer: AnsweredSecretFileAnswer,
): string {
  if (answer.experience === 'seeDetails' && answer.preference === 'seeDetails') {
    return messages.results.seeDetailsSummary;
  }

  if (answer.experience === 'seeDetails') {
    return messages.results.experienceSeeDetailsSummary(
      messages.preferenceLabels[answer.preference],
    );
  }

  if (answer.preference === 'seeDetails') {
    return messages.results.preferenceSeeDetailsSummary(
      messages.experienceLabels[answer.experience],
    );
  }

  return messages.results.answerSummary(
    messages.experienceLabels[answer.experience],
    messages.preferenceLabels[answer.preference],
  );
}
