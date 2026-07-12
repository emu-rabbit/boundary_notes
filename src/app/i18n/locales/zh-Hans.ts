import type { LocaleMessages } from '../types';

export const zhHansMessages: LocaleMessages = {
  about: {
    body: '这只兔子会陪你把现在的感觉、界线和想说清楚的事整理成一份档案。它只是沟通起点，不会替任何人做决定。',
    replayStory: '重播前导剧情',
    title: '关于这只兔子',
  },
  assets: {
    homeRabbitAlt: '白色兔子挥手，怀里抱着秘密档案笔记本。',
    settingsRabbitAlt: '白色兔子抱着设置板，齿轮图案在设置板上。',
  },
  brand: {
    restartStoryAria: (title) => `${title}：重新开始前导剧情`,
  },
  common: {
    backHome: '回主页',
    planned: '规划中',
    ready: '可使用',
  },
  home: {
    copy: '今天也可以慢慢来，可以创建新档案，也可以接着旧档案继续。噢，你也想看看自己的变化，或把这一部分的你分享给别人吗？',
    kicker: '欢迎回来',
    navAria: '秘密档案主要入口',
  },
  routes: {
    story: {
      label: '前导剧情',
      summary: '让兔子带你进入秘密档案的第一段互动。',
    },
    home: {
      label: '主页',
      summary: '整理后续主要流程入口，作为多页功能的起点。',
    },
    create: {
      label: '创建新档案',
      summary: '开始新的测试，整理各项目的经验、兴趣和备注。',
    },
    preview: {
      label: '查看档案',
      summary: '以只读方式理解一份秘密档案的结果。',
    },
    files: {
      label: '查看旧档案',
      summary: '查看、编辑本地档案，或用链接载入云端档案。',
    },
    timeMachine: {
      label: '搭乘时光机',
      summary: '比对不同档案之间的变化，看看界线和感觉如何移动。',
    },
    about: {
      label: '关于这只兔子',
      summary: '了解这个项目如何陪你整理界线与沟通起点。',
    },
    settings: {
      label: '设置',
      summary: '调整语言、偏好与本机资料选项。',
    },
  },
  settings: {
    body: '这些设置只放在这台装置里。',
    languageLabel: '守密兔要用的语言',
    profileFieldLabel: '称呼',
    profileLabel: '想怎么称呼你',
    profilePlaceholder: '兔子',
    profileSaved: '已保存',
    saveProfile: '保存称呼',
    title: '设置',
  },
  story: {
    languageQuestion: '......?',
    nameFieldLabel: '称呼',
    speakerName: '不知哪来的兔子',
    steps: {
      'self-question': {
        lines: ['嗨！不知道什么风把你吹来了！', '但……你了解自己吗？'],
        choices: [
          { label: '了解', next: 'self-yes' },
          { label: '不了解', next: 'self-no' },
          { label: '不太确定', next: 'self-unsure' },
        ],
      },
      'self-yes': {
        message: '太好了，那我想你接下来一定得心应手！',
        action: '（自豪）',
      },
      'self-no': {
        message: '那我想，我可以陪你更摸清楚自己！',
        action: '真的吗？',
      },
      'self-unsure': {
        message: '那真是好消息，探索未知有时最迷人了！',
        action: '我也这样觉得',
      },
      'other-question': {
        lines: ['不过……那个人了解你吗？'],
        choices: [
          { label: '了解', next: 'other-yes' },
          { label: '不了解', next: 'other-no' },
          { label: '那个人是谁', next: 'other-who' },
        ],
      },
      'other-yes': {
        message: '那这是个玩游戏的机会，来看看他可以得几分！',
        action: '听起来真酷！',
      },
      'other-no': {
        message: '没事的，现在有个跨出第一步的机会',
        action: '那我该怎么做呢？',
      },
      'other-who': {
        message: '那个人？也许是你的下个约会对象……也许是你的伴侣，也或许是任何你想让对方了解你的人。',
        action: '了解了',
      },
      name: {
        lines: ['该怎么称呼你呢？'],
        action: '写进档案',
      },
      file: {
        body: [
          '在这里，我们会好好记录你对各个 BDSM 项目的喜好和接受程度。这里没有正确答案，只有你仍然是你，欲望仍然是欲望。',
          '你可以保存，也可以分享给心中的那个人，更可以用来和谁沟通。也许过一段时间后，我还能再次看到你的到来，到时再跟我聊聊你的变化吧！',
        ],
        action: 'OK',
      },
    },
  },
  title: {
    connector: '的',
    defaultProfileName: '兔子',
    objectLabel: '秘密档案',
  },
};
