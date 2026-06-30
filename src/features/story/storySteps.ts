import type { RabbitPose } from './rabbitAssets';

export type StepId =
  | 'self-question'
  | 'self-yes'
  | 'self-no'
  | 'self-unsure'
  | 'other-question'
  | 'other-yes'
  | 'other-no'
  | 'other-who'
  | 'name'
  | 'file';

export type StepKind = 'choice' | 'message' | 'name' | 'file';
export type SceneTone = 'welcome' | 'mirror' | 'naming' | 'archive';

export interface Choice {
  label: string;
  next: StepId;
}

export interface StoryStep {
  id: StepId;
  kind: StepKind;
  showSpeaker?: boolean;
  lines?: string[];
  message?: string;
  body?: string[];
  choices?: Choice[];
  action?: string;
  next?: StepId;
  pose: RabbitPose;
  tone: SceneTone;
}

export const storySteps: StoryStep[] = [
  {
    id: 'self-question',
    kind: 'choice',
    lines: ['嗨！不知道甚麼風把你吹來的！', '但……你了解自己嗎？'],
    choices: [
      { label: '了解', next: 'self-yes' },
      { label: '不了解', next: 'self-no' },
      { label: '不太確定', next: 'self-unsure' },
    ],
    pose: 'greeting',
    tone: 'welcome',
  },
  {
    id: 'self-yes',
    kind: 'message',
    message: '太好了，那我想你接下來一定得心應手！',
    action: '（自豪）',
    next: 'other-question',
    pose: 'greeting',
    tone: 'welcome',
  },
  {
    id: 'self-no',
    kind: 'message',
    message: '那我想，我可以陪你更摸得清楚自己！',
    action: '真的嗎？',
    next: 'other-question',
    pose: 'greeting',
    tone: 'welcome',
  },
  {
    id: 'self-unsure',
    kind: 'message',
    message: '那真是好消息，探索未知有時最迷人了！',
    action: '我也這樣覺得',
    next: 'other-question',
    pose: 'thinking',
    tone: 'mirror',
  },
  {
    id: 'other-question',
    kind: 'choice',
    lines: ['不過……那個人了解你嗎？'],
    choices: [
      { label: '了解', next: 'other-yes' },
      { label: '不了解', next: 'other-no' },
      { label: '那個人是誰', next: 'other-who' },
    ],
    pose: 'thinking',
    tone: 'mirror',
  },
  {
    id: 'other-yes',
    kind: 'message',
    message: '那這是個玩遊戲的機會，來看看他可以得幾分！',
    action: '聽起來真酷！',
    next: 'name',
    pose: 'thinking',
    tone: 'mirror',
  },
  {
    id: 'other-no',
    kind: 'message',
    message: '沒事的，現在有個跨出第一步的機會',
    action: '那我該怎麼做呢？',
    next: 'name',
    pose: 'thinking',
    tone: 'mirror',
  },
  {
    id: 'other-who',
    kind: 'message',
    message:
      '那個人？也許是你的下個約會對象……也許是你的伴侶，也或許是任何你想要讓對方了解你的人。',
    action: '了解了',
    next: 'other-question',
    pose: 'thinking',
    tone: 'mirror',
  },
  {
    id: 'name',
    kind: 'name',
    lines: ['該怎麼稱呼你呢？'],
    action: '寫進檔案',
    next: 'file',
    pose: 'naming',
    tone: 'naming',
  },
  {
    id: 'file',
    kind: 'file',
    showSpeaker: false,
    body: [
      '在這裡，我們將會好好地記錄下了你對於各個BDSM項目的喜好和接受程度。這裡沒有正確答案，只有你仍然是你，慾望仍然是慾望。',
      '你可以保存，也可以分享給心中的那個人，更可以用來和誰溝通。也許過一段時間後，我還能再次看到你的到來，到時再跟我聊聊你的變化吧！',
    ],
    action: 'OK',
    pose: 'folder',
    tone: 'archive',
  },
];

export const storyStepIndex = new Map(storySteps.map((step, index) => [step.id, index]));
