import type { LocaleMessages } from '../types';
import { zhHantLegal } from '../legalDocuments';
import { secretKeeperNames } from '../terminology';

const secretKeeperName = secretKeeperNames['zh-Hant'];

export const zhHantMessages: LocaleMessages = {
  analyticsConsent: {
    accept: '同意匿名分析',
    body: '同意後，我們會使用 Google Analytics 改善 Boundary Notes。我們不會傳送你的個人內容，追蹤可隨時在設定中關閉。',
    decline: '先不要',
    googleDetails: '了解 Google 如何處理這些資料',
    settingsActionDisable: '停止匿名分析',
    settingsActionEnable: '允許匿名分析',
    settingsBody: '匿名分析只記錄頁面與功能使用情況，不包含稱呼、作答、備註、檔案 ID 或分享連結。你可以隨時改變選擇。',
    settingsDisabled: '目前未允許匿名分析',
    settingsEnabled: '目前已允許匿名分析',
    settingsTitle: '匿名使用分析',
    title: `可以讓${secretKeeperName}記下匿名使用情況嗎？`,
  },
  about: {
    body: '這裡是一本溫柔、私密的筆記本，陪你整理 BDSM 界線、喜好、慾望與重要前提。',
    contentWarning: '本網頁內容可能提及性、身體、權力交換與高風險互動項目。你可以依自己的狀態決定要不要使用，也可以隨時停下來。',
    doesItems: ['陪你整理經驗、興趣與界線', '幫助你看見自己的變化', '提供一個較容易開始的對話入口'],
    doesNotItems: ['不替任何人作出同意', '不為你配對或推薦項目', '不把你分類成固定的角色'],
    doesNotTitle: `${secretKeeperName}不會做的事`,
    doesTitle: `${secretKeeperName}陪你做的事`,
    emailSupport: `寄信給${secretKeeperName}`,
    githubSupport: '前往 GitHub 回報問題',
    legalTitle: '本網站的條款與一路上的痕跡',
    missionBody: `${secretKeeperName}會陪你整理經驗、興趣與界線，在理解自己的路上可以不那麼孤單。只要你想要，這也是一張可以傳給某人、讓他認識你的一張邀請函。也請注意祕密檔案只能協助界線溝通，不能代替每一次當下、知情且自願的同意。`,
    missionTitle: '讓界線和喜好更清楚的展現',
    principles: [
      { title: '由你決定', body: '沒有正確答案，也不會替你貼上標籤。' },
      { title: '同意在當下', body: '檔案只能支援溝通，不能代替每一次確認。' },
      { title: '分享要謹慎', body: '連結可能含有敏感內容，只交給你信任的人。' },
    ],
    privacyPolicy: '隱私權政策',
    rabbitRoleBody: `${secretKeeperName}不會催促，也不替任何人作決定。牠的任務，是守在一旁，陪你把感受與界線整理成能被理解的話。`,
    rabbitRoleTitle: `${secretKeeperName}的任務`,
    replayStory: '重播前導劇情',
    supportTitle: '需要幫忙嗎？這裡可以聯繫我。',
    termsOfUse: '使用條款',
    title: '關於這隻兔子',
    versionHistory: '版本歷史',
  },
  assets: {
    aboutRabbitAlt: `白色${secretKeeperName}坐在打開的祕密檔案旁，安靜陪伴使用者整理界線。`,
    homeRabbitAlt: '白色兔子揮手，懷裡抱著秘密檔案筆記本。',
    settingsRabbitAlt: '白色兔子抱著設定板，齒輪圖案在設定板上。',
  },
  brand: {
    restartStoryAria: (title) => `${title}：重新開始前導劇情`,
  },
  common: {
    backHome: '回主頁',
    planned: '規劃中',
    skipStory: '跳過',
  },
  home: {
    copy: '今天也可以慢慢來，可以創建新的檔案，也可以從舊的檔案繼續作答。噢，還是你打算查看自己的變化，或是分享給別人這一部分的你呢？',
    kicker: '歡迎回來',
    navAria: '秘密檔案主要入口',
  },
  notFound: {
    action: '回到主頁',
    body: '這個位置沒有留下檔案。網址可能已經改變，或是不小心多帶了一段路徑。',
    kicker: '404｜找不到頁面',
    title: `${secretKeeperName}在這裡找了一圈`,
  },
  versionHistory: {
    backToAbout: '回到關於這隻兔子',
    entries: [{
      version: '1.0.0',
      items: ['正式版本釋出', '創建筆記功能', '管理舊檔案功能', '上傳分享功能'],
    }],
    eyebrow: 'Boundary Notes',
    title: '版本歷史',
  },
  routes: {
    story: {
      label: '前導劇情',
      summary: '讓兔子帶使用者進入秘密檔案的第一段互動。',
    },
    home: {
      label: '主頁',
      summary: '彙整後續主要流程入口，作為多頁功能的導覽起點。',
    },
    create: {
      label: '創建新檔案',
      summary: '開始新的測驗，整理對各個項目的經驗、興趣與備註。',
    },
    preview: {
      label: '檢視檔案',
      summary: '以唯讀方式理解一份祕密檔案的結果。',
    },
    files: {
      label: '查看舊檔案',
      summary: '檢閱、編輯本地保存的檔案，或用連結載入雲端檔案。',
    },
    timeMachine: {
      label: '搭乘時光機',
      summary: '比對不同檔案之間的變化，看看界線與感覺如何移動。',
    },
    about: {
      label: '關於',
      summary: '了解這個專案如何陪你整理界線與溝通起點。',
    },
    versionHistory: {
      label: '版本歷史',
      summary: '查看 Boundary Notes 的版本更新內容。',
    },
    settings: {
      label: '設定',
      summary: '調整語言、偏好與和本機資料相關的選項。',
    },
    terms: { label: '使用條款', summary: '了解本站的用途、使用規範與責任界線。' },
    privacy: { label: '隱私權政策', summary: '了解哪些資料留在本機、何時送上雲端，以及你的選擇。' },
  },
  legal: zhHantLegal,
  settings: {
    body: '這些設定只放在這台裝置裡。',
    languageLabel: `${secretKeeperName}要用的語言`,
    profileFieldLabel: '稱呼',
    profileLabel: '想怎麼稱呼你',
    profilePlaceholder: '兔子',
    profileSaved: '已儲存',
    saveProfile: '儲存稱呼',
    title: '設定',
  },
  story: {
    languageQuestion: '......?',
    nameFieldLabel: '稱呼',
    speakerName: '不知哪來的兔子',
    steps: {
      'self-question': {
        lines: ['嗨！不知道甚麼風把你吹來的！', '但……你了解自己嗎？'],
        choices: [
          { label: '了解', next: 'self-yes' },
          { label: '不了解', next: 'self-no' },
          { label: '不太確定', next: 'self-unsure' },
        ],
      },
      'self-yes': {
        message: '太好了，那我想你接下來一定得心應手！',
        action: '（自豪）',
      },
      'self-no': {
        message: '那我想，我可以陪你更摸得清楚自己！',
        action: '真的嗎？',
      },
      'self-unsure': {
        message: '那真是好消息，探索未知有時最迷人了！',
        action: '我也這樣覺得',
      },
      'other-question': {
        lines: ['不過……那個人了解你嗎？'],
        choices: [
          { label: '了解', next: 'other-yes' },
          { label: '不了解', next: 'other-no' },
          { label: '那個人是誰', next: 'other-who' },
        ],
      },
      'other-yes': {
        message: '那這是個玩遊戲的機會，來看看他可以得幾分！',
        action: '聽起來真酷！',
      },
      'other-no': {
        message: '沒事的，現在有個跨出第一步的機會',
        action: '那我該怎麼做呢？',
      },
      'other-who': {
        message:
          '那個人？也許是你的下個約會對象……也許是你的伴侶，也或許是任何你想要讓對方了解你的人。',
        action: '了解了',
      },
      name: {
        lines: ['該怎麼稱呼你呢？'],
        action: '寫進檔案',
      },
      file: {
        body: [
          '在這裡，我們將會好好地記錄下了你對於各個BDSM項目的喜好和接受程度。這裡沒有正確答案，只有你仍然是你，慾望仍然是慾望。',
          '你可以保存，也可以分享給心中的那個人，更可以用來和誰溝通。也許過一段時間後，我還能再次看到你的到來，到時再跟我聊聊你的變化吧！',
        ],
        action: 'OK',
      },
    },
  },
  title: {
    connector: '的',
    defaultProfileName: '兔子',
    objectLabel: '祕密檔案',
  },
};
