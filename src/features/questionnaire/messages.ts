import type { AppLocale } from '../../app/i18n';
import type {
  ExperienceAnswer,
  PreferenceAnswer,
  QuestionRole,
  SecretFileScope,
} from '../secret-file';

export interface QuestionnaireMessages {
  answerRequired: string;
  autoAdvance: string;
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
  home: string;
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
    readyLines: string[];
    speakerName: string;
    scopeChoices: Array<{ label: string; scope: SecretFileScope; suffix?: string }>;
    scopeHelp: string;
    scopeLines: string[];
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
    editCategoryAria: (categoryName: string) => string;
    editHint: string;
    editing: string;
    fileActionsLabel: string;
    firstPhaseComplete: string;
    otherSummary: string;
    overallProgress: string;
    preview: string;
    roleSwitchLabel: string;
    sectionKicker: (roleLabel: string) => string;
    seeDetailsSummary: string;
    spotlightCount: (selected: number, limit: number) => string;
    spotlightHelp: string;
    spotlightTitle: string;
    title: string;
    unansweredSummary: string;
    upload: string;
  };
  roleLabels: Record<QuestionRole, string>;
  storageWarning: string;
  viewDetails: string;
}

const zhHant: QuestionnaireMessages = {
  answerRequired: '請先選擇經驗程度與喜好程度。',
  autoAdvance: '答案已存好，3 秒後會自動前往下一題。',
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
  home: '回到主頁',
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
    readyLines: ['準備好開始第一階段的填答了嗎？'],
    speakerName: '守密兔',
    scopeChoices: [
      { label: '僅顯示主導側', scope: 'activeOnly' },
      { label: '僅顯示配合側', scope: 'passiveOnly' },
      { label: '顯示所有問題', scope: 'all' },
    ],
    scopeHelp: '這些是甚麼？',
    scopeLines: ['嗨，很高興在這看到你。在開始之前，我希望我們先確定測驗的範圍。'],
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
    editCategoryAria: (categoryName) => `編輯${categoryName}`,
    editHint: '點選任何分類，就能繼續編輯裡面的細項',
    editing: '正在編輯',
    fileActionsLabel: '檔案操作',
    firstPhaseComplete: '分類感受已經收好了。接下來，可以從你最在意的分類慢慢補上細項。',
    otherSummary: '從細項開始整理',
    overallProgress: '整份細項進度',
    preview: '檢視預覽',
    roleSwitchLabel: '切換互動方向',
    sectionKicker: (roleLabel) => `目前顯示・${roleLabel}`,
    seeDetailsSummary: '參考細項',
    spotlightCount: (selected, limit) => `已選 ${selected} / ${limit}`,
    spotlightHelp: '挑出最想先讓人看見的分類或項目。',
    spotlightTitle: '我的焦點喜好',
    title: '整理你的祕密檔案',
    unansweredSummary: '分類感受尚未填寫',
    upload: '上傳至雲端',
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
  autoAdvance: '答案已保存，3 秒后会自动前往下一题。',
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
  home: '回到主页',
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
    scopeLines: ['嗨，很高兴在这里看到你。开始前，我们先确定测验范围。'],
    explanationLines: [
      '所有问题都会分为主导侧与配合侧两个方向。',
      '前者代表在互动中主导、施予或执行的一方，后者代表配合、接纳或承受的一方。',
    ],
    readyLines: ['准备好开始第一阶段的填写了吗？'],
    ready: '准备好了',
    speakerName: '守密兔',
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
    editCategoryAria: (categoryName) => `编辑${categoryName}`,
    editHint: '点选任何分类，就能继续编辑里面的细项',
    editing: '正在编辑',
    fileActionsLabel: '文件操作',
    firstPhaseComplete: '分类感受已经收好了。接下来，可以从你最在意的分类慢慢补上细项。',
    otherSummary: '从细项开始整理',
    overallProgress: '整份细项进度',
    preview: '查看预览',
    roleSwitchLabel: '切换互动方向',
    sectionKicker: (roleLabel) => `当前显示・${roleLabel}`,
    seeDetailsSummary: '参考细项',
    spotlightCount: (selected, limit) => `已选 ${selected} / ${limit}`,
    spotlightHelp: '挑出最想先让人看见的分类或项目。',
    spotlightTitle: '我的焦点喜好',
    title: '整理你的秘密档案',
    unansweredSummary: '分类感受尚未填写',
    upload: '上传至云端',
  },
  storageWarning: '目前无法使用浏览器持久存储；这次填写暂时保留在当前页面，离开后可能无法恢复。',
  viewDetails: '查看细项列表',
};

const ja: QuestionnaireMessages = {
  ...zhHant,
  answerRequired: '経験と興味の両方を選んでください。',
  autoAdvance: '回答を保存しました。3 秒後に次の質問へ進みます。',
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
  home: 'ホームへ戻る',
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
    scopeLines: ['こんにちは。始める前に、質問の範囲を決めましょう。'],
    explanationLines: [
      'すべての質問は、リード側とフォロー側の二つの方向に分けています。',
      '前者はやり取りで主導・施与・実行を担う側、後者はそれに合わせて受け止める側を表します。',
    ],
    readyLines: ['第一段階の回答を始める準備はできましたか？'],
    ready: '準備できた',
    speakerName: '守秘うさぎ',
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
    editCategoryAria: (categoryName) => `${categoryName}を編集`,
    editHint: 'カテゴリーを選ぶと、その中の詳細を編集できます',
    editing: '編集中',
    fileActionsLabel: 'ファイル操作',
    firstPhaseComplete: 'カテゴリーへの回答を保存しました。気になるカテゴリーから、詳細を少しずつ整理できます。',
    otherSummary: '詳細から整理する',
    overallProgress: '詳細全体の進捗',
    preview: 'プレビュー',
    roleSwitchLabel: '役割を切り替える',
    sectionKicker: (roleLabel) => `表示中・${roleLabel}`,
    seeDetailsSummary: '詳細を参照',
    spotlightCount: (selected, limit) => `${selected} / ${limit} 選択済み`,
    spotlightHelp: '最初に見てほしいカテゴリーや項目を選びます。',
    spotlightTitle: '私の注目ポイント',
    title: '秘密ファイルを整理する',
    unansweredSummary: 'カテゴリー回答は未入力',
    upload: 'クラウドへアップロード',
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
  autoAdvance: 'Your answer is saved. The next question opens in 3 seconds.',
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
  home: 'Return home',
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
    scopeLines: ['Hi, it is good to see you. Before we begin, let us choose the scope of the questionnaire.'],
    explanationLines: [
      'Every question is grouped into a Leading and a Following direction.',
      'Leading means taking the lead, giving, or carrying out the interaction; Following means joining in, receiving, or experiencing it.',
    ],
    readyLines: ['Ready to begin the first stage?'],
    ready: 'I am ready',
    speakerName: 'Secretkeeper Bunny',
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
    editCategoryAria: (categoryName) => `Edit ${categoryName}`,
    editHint: 'Choose any category to continue editing its details',
    editing: 'Editing',
    fileActionsLabel: 'File actions',
    firstPhaseComplete: 'Your category answers are saved. Continue with the details in whichever category matters most to you.',
    otherSummary: 'Start with the details',
    overallProgress: 'Overall detail progress',
    preview: 'View preview',
    roleSwitchLabel: 'Switch interaction role',
    sectionKicker: (roleLabel) => `Showing · ${roleLabel}`,
    seeDetailsSummary: 'See details',
    spotlightCount: (selected, limit) => `${selected} of ${limit} selected`,
    spotlightHelp: 'Choose the categories or items you most want people to notice first.',
    spotlightTitle: 'My highlights',
    title: 'Organize your secret file',
    unansweredSummary: 'Category answer not filled in',
    upload: 'Upload to cloud',
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
