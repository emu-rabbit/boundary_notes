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
    categoryAnswer: string;
    completed: string;
    detailProgress: (answered: number, total: number) => string;
    experience: string;
    firstPhaseComplete: string;
    noCategoryAnswer: string;
    preference: string;
    title: string;
    warning: (profileName: string) => string;
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
    none: '沒經驗',
    little: '少量經驗',
    some: '一些經驗',
    extensive: '大量經驗',
    veryExtensive: '非常熟悉',
    unsure: '不確定',
    seeDetails: '參考細項',
  },
  experienceLegend: '你的經驗程度',
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
      '所有的問題，我們都會分類為主動方和被動方兩種面相。',
      '前者代表你是在互動中施予/執行的那一個角色，後者則是接納/承受的那一個角色。',
    ],
    notReady: '還沒......',
    questionCountAction: '(((ﾟДﾟ;)))',
    questionCountLines: (count) => [`恩......好的，那我們這邊總共有${count}個問題！`],
    ready: '準備好了',
    readyLines: ['準備好開始第一階段的填答了嗎？'],
    speakerName: '守密兔',
    scopeChoices: [
      { label: '僅顯示主動方', suffix: '相關問題', scope: 'activeOnly' },
      { label: '僅顯示被動方', suffix: '相關問題', scope: 'passiveOnly' },
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
    reluctant: '勉強配合',
    neutral: '無感覺',
    like: '喜歡',
    love: '超級喜歡',
    unsure: '不確定',
    seeDetails: '參考細項',
  },
  preferenceLegend: '你目前的喜好程度',
  progress: (current, total) => `分類 ${current} / ${total}`,
  results: {
    categoryAnswer: '分類回答',
    completed: '第一階段完成',
    detailProgress: (answered, total) => `細項完成度 ${answered} / ${total}`,
    experience: '經驗',
    firstPhaseComplete: '分類感受已經全部存好了。細項填答這一階段先不開放。',
    noCategoryAnswer: '此分類不需要填寫分類回答。',
    preference: '喜好',
    title: '分類測驗結果',
    warning: (profileName) =>
      `這份測驗結果僅供參考，並無法完整的描述${profileName}的喜好或特質，也請勿用來替代任何必要的溝通。`,
  },
  roleLabels: {
    active: '主動方',
    passive: '被動方',
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
    none: '没经验',
    little: '少量经验',
    some: '一些经验',
    extensive: '大量经验',
    veryExtensive: '非常熟悉',
    unsure: '不确定',
    seeDetails: '参考细项',
  },
  experienceLegend: '你的经验程度',
  intro: {
    ...zhHant.intro,
    scopeLines: ['嗨，很高兴在这里看到你。开始前，我们先确定测验范围。'],
    explanationLines: [
      '所有问题都会分成主动方与被动方两个面向。',
      '前者代表在互动中施予或执行的一方，后者代表接纳或承受的一方。',
    ],
    readyLines: ['准备好开始第一阶段的填写了吗？'],
    ready: '准备好了',
    speakerName: '守密兔',
    notReady: '还没……',
    scopeChoices: [
      { label: '只显示主动方', suffix: '相关问题', scope: 'activeOnly' },
      { label: '只显示被动方', suffix: '相关问题', scope: 'passiveOnly' },
      { label: '显示所有问题', scope: 'all' },
    ],
    scopeHelp: '这些是什么？',
  },
  noteHelp: '选填，最多 80 个字符；请勿填写链接。',
  noteLabel: '想补充的小提醒',
  notePlaceholder: '不确定也可以留空',
  nextQuestion: '下一题',
  preferenceLegend: '你目前的喜好程度',
  preferenceLabels: {
    hardNo: '绝对禁止',
    reluctant: '勉强配合',
    neutral: '无感觉',
    like: '喜欢',
    love: '超级喜欢',
    unsure: '不确定',
    seeDetails: '参考细项',
  },
  results: {
    ...zhHant.results,
    detailProgress: (answered, total) => `细项完成度 ${answered} / ${total}`,
    experience: '经验',
    firstPhaseComplete: '分类感受已经全部保存。细项填写这一阶段暂不开放。',
    noCategoryAnswer: '此分类不需要填写分类回答。',
    preference: '喜好',
    title: '分类测验结果',
    warning: (profileName) =>
      `这份测验结果仅供参考，无法完整描述${profileName}的喜好或特质，也请勿用来替代任何必要的沟通。`,
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
    none: '経験なし',
    little: '少し経験あり',
    some: 'ある程度経験あり',
    extensive: '多く経験あり',
    veryExtensive: 'とても多い',
    unsure: 'わからない',
    seeDetails: '詳細項目を参照',
  },
  experienceLegend: '経験の程度',
  intro: {
    ...zhHant.intro,
    scopeLines: ['こんにちは。始める前に、質問の範囲を決めましょう。'],
    explanationLines: [
      'すべての質問には、する側と受ける側の二つの面があります。',
      '前者は行為をする側、後者はそれを受ける側を表します。',
    ],
    readyLines: ['第一段階の回答を始める準備はできましたか？'],
    ready: '準備できた',
    speakerName: '守秘うさぎ',
    notReady: 'まだ……',
    scopeChoices: [
      { label: 'する側', suffix: 'の質問だけ', scope: 'activeOnly' },
      { label: '受ける側', suffix: 'の質問だけ', scope: 'passiveOnly' },
      { label: 'すべての質問', scope: 'all' },
    ],
    scopeHelp: 'どういう意味？',
  },
  noteHelp: '任意・80文字まで。リンクは入力できません。',
  noteLabel: '小さなメモ',
  notePlaceholder: '迷っているなら空欄でも大丈夫です',
  nextQuestion: '次の質問',
  preferenceLegend: '現在の興味',
  preferenceLabels: {
    hardNo: '絶対に不可',
    reluctant: '条件次第',
    neutral: 'どちらでもない',
    like: '好き',
    love: 'とても好き',
    unsure: 'わからない',
    seeDetails: '詳細項目を参照',
  },
  progress: (current, total) => `カテゴリー ${current} / ${total}`,
  results: {
    ...zhHant.results,
    detailProgress: (answered, total) => `詳細項目 ${answered} / ${total}`, 
    experience: '経験',
    firstPhaseComplete: 'カテゴリーへの回答を保存しました。詳細項目の回答は今回は開きません。',
    noCategoryAnswer: 'このカテゴリーには全体回答がありません。',
    preference: '興味',
    title: 'カテゴリー回答結果',
    warning: (profileName) =>
      `この結果だけでは${profileName}さんの好みや特性を完全には表せません。必要な対話の代わりにはしないでください。`,
  },
  roleLabels: {
    active: 'する側',
    passive: '受ける側',
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
    none: 'No experience',
    little: 'A little experience',
    some: 'Some experience',
    extensive: 'Extensive experience',
    veryExtensive: 'Very experienced',
    unsure: 'Unsure',
    seeDetails: 'Reference details',
  },
  experienceLegend: 'Your experience',
  intro: {
    ...zhHant.intro,
    scopeLines: ['Hi, it is good to see you. Before we begin, let us choose the scope of the questionnaire.'],
    explanationLines: [
      'Every question has an active and a receptive perspective.',
      'Active means doing or applying the interaction; receptive means receiving or experiencing it.',
    ],
    readyLines: ['Ready to begin the first stage?'],
    ready: 'I am ready',
    speakerName: 'Secretkeeper Bunny',
    notReady: 'Not yet…',
    scopeChoices: [
      { label: 'Active-side', suffix: 'questions only', scope: 'activeOnly' },
      { label: 'Receptive-side', suffix: 'questions only', scope: 'passiveOnly' },
      { label: 'Show every question', scope: 'all' },
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
    seeDetails: 'Reference details',
  },
  progress: (current, total) => `Category ${current} of ${total}`,
  results: {
    ...zhHant.results,
    detailProgress: (answered, total) => `Details completed: ${answered} / ${total}`,
    experience: 'Experience',
    firstPhaseComplete: 'Your category answers are saved. Detailed questions are not opened in this stage.',
    noCategoryAnswer: 'This category does not have a category-level answer.',
    preference: 'Preference',
    title: 'Category results',
    warning: (profileName) =>
      `These results are only a reference and cannot fully describe ${profileName}'s preferences or traits. Do not use them in place of necessary communication.`,
  },
  roleLabels: {
    active: 'Active',
    passive: 'Receptive',
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
