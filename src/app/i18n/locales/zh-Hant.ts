import type { LocaleMessages } from '../types';

export const zhHantMessages: LocaleMessages = {
  about: {
    body: '這隻兔子會陪你把目前的感覺、界線與想說清楚的事整理成一份檔案。它只是溝通起點，不會替任何人做決定。',
    replayStory: '重播前導劇情',
    title: '關於這隻兔子',
  },
  assets: {
    homeRabbitAlt: '白色兔子揮手，懷裡抱著秘密檔案筆記本。',
    settingsRabbitAlt: '白色兔子抱著設定板，齒輪圖案在設定板上。',
  },
  brand: {
    restartStoryAria: (title) => `${title}：重新開始前導劇情`,
  },
  common: {
    backHome: '回主頁',
    planned: '規劃中',
    ready: '可使用',
  },
  home: {
    copy: '今天也可以慢慢來，可以創建新的檔案，也可以從舊的檔案繼續作答。噢，還是你打算查看自己的變化，或是分享給別人這一部分的你呢？',
    kicker: '歡迎回來',
    navAria: '秘密檔案主要入口',
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
      label: '關於這隻兔子',
      summary: '了解這個專案如何陪你整理界線與溝通起點。',
    },
    settings: {
      label: '設定',
      summary: '調整語言、偏好與和本機資料相關的選項。',
    },
  },
  settings: {
    body: '這些設定只放在這台裝置裡。',
    languageLabel: '守密兔要用的語言',
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
