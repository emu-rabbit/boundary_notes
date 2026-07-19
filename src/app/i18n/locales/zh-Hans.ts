import type { LocaleMessages } from '../types';
import { zhHansLegal } from '../legalDocuments';
import { secretKeeperNames } from '../terminology';

const secretKeeperName = secretKeeperNames['zh-Hans'];

export const zhHansMessages: LocaleMessages = {
  analyticsConsent: {
    accept: '同意匿名分析',
    body: '同意后，我们会使用 Google Analytics 改进 Boundary Notes。我们不会发送你的个人内容，追踪可随时在设置中关闭。',
    decline: '暂时不要',
    googleDetails: '了解 Google 如何处理这些数据',
    settingsActionDisable: '停止匿名分析',
    settingsActionEnable: '允许匿名分析',
    settingsBody: '匿名分析只记录页面与功能使用情况，不包含称呼、作答、备注、文件 ID 或分享链接。你可以随时改变选择。',
    settingsDisabled: '目前未允许匿名分析',
    settingsEnabled: '目前已允许匿名分析',
    settingsTitle: '匿名使用分析',
    title: `可以让${secretKeeperName}记下匿名使用情况吗？`,
  },
  about: {
    body: '这里是一本温柔、私密的笔记本，陪你整理 BDSM 界限、喜好、欲望与重要前提。',
    contentWarning: '本网页内容可能提及性、身体、权力交换与高风险互动项目。你可以依自己的状态决定要不要使用，也可以随时停下来。',
    doesItems: ['陪你整理经验、兴趣与界限', '帮助你看见自己的变化', '提供一个较容易开始的对话入口'],
    doesNotItems: ['不替任何人作出同意', '不为你配对或推荐项目', '不把你分类成固定的角色'],
    doesNotTitle: `${secretKeeperName}不会做的事`, doesTitle: `${secretKeeperName}陪你做的事`, emailSupport: `写信给${secretKeeperName}`, githubSupport: '前往 GitHub 报告问题', legalTitle: '本网站的条款与一路上的痕迹',
    missionBody: `${secretKeeperName}会陪你整理经验、兴趣与界限，在理解自己的路上可以不那么孤单。只要你想要，这也是一张可以传给某人、让他认识你的邀请函。也请注意，秘密档案只能协助界限沟通，不能代替每一次当下、知情且自愿的同意。`, missionTitle: '让界限和喜好更清楚地展现',
    principles: [{ title: '由你决定', body: '没有正确答案，也不会替你贴上标签。' }, { title: '同意在当下', body: '档案只能支持沟通，不能代替每一次确认。' }, { title: '分享要谨慎', body: '链接可能含有敏感内容，只交给你信任的人。' }],
    privacyPolicy: '隐私权政策', rabbitRoleBody: `${secretKeeperName}不会催促，也不替任何人作决定。它的任务，是守在一旁，陪你把感受与界限整理成能被理解的话。`, rabbitRoleTitle: `${secretKeeperName}的任务`,
    replayStory: '重播前导剧情',
    supportTitle: '需要帮助吗？可以在这里联系我。', termsOfUse: '使用条款',
    title: '关于这只兔子',
    versionHistory: '版本历史',
  },
  assets: {
    aboutRabbitAlt: `白色${secretKeeperName}坐在打开的秘密档案旁，安静陪伴使用者整理界限。`,
    homeRabbitAlt: '白色兔子挥手，怀里抱着秘密档案笔记本。',
    settingsRabbitAlt: '白色兔子抱着设置板，齿轮图案在设置板上。',
  },
  brand: {
    restartStoryAria: (title) => `${title}：重新开始前导剧情`,
  },
  common: {
    backHome: '回主页',
    planned: '规划中',
    skipStory: '跳过',
  },
  home: {
    copy: '今天也可以慢慢来，可以创建新档案，也可以接着旧档案继续。噢，你也想看看自己的变化，或把这一部分的你分享给别人吗？',
    kicker: '欢迎回来',
    navAria: '秘密档案主要入口',
  },
  notFound: {
    action: '回到主页',
    body: '这个位置没有留下档案。网址可能已经改变，或是不小心多带了一段路径。',
    kicker: '404｜找不到页面',
    title: `${secretKeeperName}在这里找了一圈`,
  },
  versionHistory: {
    backToAbout: '回到关于这只兔子',
    entries: [{
      version: '1.0.0',
      items: ['正式版本发布', '创建笔记功能', '管理旧档案功能', '上传分享功能'],
    }],
    eyebrow: 'Boundary Notes',
    title: '版本历史',
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
      label: '关于',
      summary: '了解这个项目如何陪你整理界线与沟通起点。',
    },
    versionHistory: {
      label: '版本历史',
      summary: '查看 Boundary Notes 的版本更新内容。',
    },
    settings: {
      label: '设置',
      summary: '调整语言、偏好与本机资料选项。',
    },
    terms: { label: '使用条款', summary: '了解本站的用途、使用规范与责任界限。' },
    privacy: { label: '隐私权政策', summary: '了解哪些数据留在本机、何时送上云端，以及你的选择。' },
  },
  legal: zhHansLegal,
  settings: {
    body: '这些设置只放在这台装置里。',
    languageLabel: `${secretKeeperName}要用的语言`,
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
