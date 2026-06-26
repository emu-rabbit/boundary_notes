<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import rabbitFolderUrl from './assets/story/rabbit-folder.png';
import rabbitGreetingUrl from './assets/story/rabbit-greeting.png';
import rabbitNamingUrl from './assets/story/rabbit-naming.png';
import rabbitThinkingUrl from './assets/story/rabbit-thinking.png';

type AppMode = 'story' | 'home';
type StepId =
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
type StepKind = 'choice' | 'message' | 'name' | 'file';
type RabbitPose = 'greeting' | 'thinking' | 'naming' | 'folder';
type SceneTone = 'welcome' | 'mirror' | 'naming' | 'archive';

interface Choice {
  label: string;
  next: StepId;
}

interface StoryStep {
  id: StepId;
  kind: StepKind;
  lines?: string[];
  message?: string;
  body?: string[];
  choices?: Choice[];
  action?: string;
  next?: StepId;
  pose: RabbitPose;
  tone: SceneTone;
}

const rabbitPoseUrls: Record<RabbitPose, string> = {
  greeting: rabbitGreetingUrl,
  thinking: rabbitThinkingUrl,
  naming: rabbitNamingUrl,
  folder: rabbitFolderUrl,
};

const storySteps: StoryStep[] = [
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
    action: '繼續',
    next: 'other-question',
    pose: 'greeting',
    tone: 'welcome',
  },
  {
    id: 'self-no',
    kind: 'message',
    message: '那我想，我可以陪你更摸得清楚自己！',
    action: '繼續',
    next: 'other-question',
    pose: 'greeting',
    tone: 'welcome',
  },
  {
    id: 'self-unsure',
    kind: 'message',
    message: '那真是好消息，探索未知有時最迷人了！',
    action: '繼續',
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
    action: '繼續',
    next: 'name',
    pose: 'thinking',
    tone: 'mirror',
  },
  {
    id: 'other-no',
    kind: 'message',
    message: '沒事的，現在有個跨出第一步的機會。',
    action: '繼續',
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
    body: [
      '在這裡，我們好好地記錄下了你對於各個BDSM項目的喜好和接受程度。這裡沒有正確答案，只有你仍然是你，慾望仍然是慾望。',
      '你可以保存，也可以分享給心中的那個人，更可以用來和誰溝通。也許過一段時間後，我還能再次看到你的到來，到時再跟我聊聊你的變化吧！',
    ],
    action: 'OK',
    pose: 'folder',
    tone: 'archive',
  },
];

const storyIndex = new Map(storySteps.map((step, index) => [step.id, index]));
const mode = ref<AppMode>('story');
const stepId = ref<StepId>('self-question');
const nameInput = ref('');

const activeStep = computed(() => storySteps[storyIndex.get(stepId.value) ?? 0]);
const displayName = computed(() => nameInput.value.trim() || '兔子');
const appTitle = computed(() => `${displayName.value}的祕密檔案`);
const activeRabbitUrl = computed(() => rabbitPoseUrls[activeStep.value.pose]);
const homeRabbitUrl = rabbitFolderUrl;

function goToStep(next: StepId): void {
  stepId.value = next;
}

function continueFromMessage(): void {
  if (activeStep.value.next) {
    goToStep(activeStep.value.next);
  }
}

function enterHome(): void {
  mode.value = 'home';
  window.history.pushState({ mode: 'home' }, '', '/home');
}

function resetStory(): void {
  mode.value = 'story';
  stepId.value = 'self-question';
  window.history.pushState({ mode: 'story' }, '', '/');
}

function warmStoryAssets(): void {
  Object.values(rabbitPoseUrls).forEach((src) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  });
}

function syncModeFromHistory(): void {
  if (window.location.pathname === '/home') {
    mode.value = 'home';
    return;
  }

  mode.value = 'story';
  stepId.value = 'self-question';
}

onMounted(() => {
  warmStoryAssets();

  if (window.location.pathname !== '/') {
    window.history.replaceState({ mode: 'story' }, '', '/');
  }

  window.addEventListener('popstate', syncModeFromHistory);
});

onUnmounted(() => {
  window.removeEventListener('popstate', syncModeFromHistory);
});
</script>

<template>
  <main class="app-shell min-h-dvh overflow-hidden text-ink-900">
    <section v-if="mode === 'story'" class="story-route" :data-tone="activeStep.tone">
      <div class="ambient-grid" aria-hidden="true" />

      <header class="story-header">
        <button class="brand-mark" type="button" @click="resetStory">
          <span class="brand-orbit" aria-hidden="true" />
          <span>{{ appTitle }}</span>
        </button>
      </header>

      <div class="story-layout">
        <aside class="illustration-scene" :data-pose="activeStep.pose" aria-hidden="true">
          <div class="scene-backdrop">
            <span class="shelf shelf-one" />
            <span class="shelf shelf-two" />
            <span class="lantern" />
          </div>
          <div class="scene-table">
            <span class="paper-stack stack-left" />
            <span class="paper-stack stack-right" />
            <span class="privacy-card" />
            <span class="tiny-lock" />
          </div>
          <img
            :src="activeRabbitUrl"
            alt=""
            class="rabbit-pose"
            width="1024"
            height="1536"
            decoding="async"
            fetchpriority="high"
          />
        </aside>

        <Transition name="dialogue" mode="out-in">
          <article :key="activeStep.id" class="dialogue-panel">
            <div v-if="activeStep.kind === 'choice'" class="dialogue-copy">
              <p v-for="line in activeStep.lines" :key="line" class="rabbit-speech">
                {{ line }}
              </p>
              <div class="choice-grid" role="list">
                <button
                  v-for="choice in activeStep.choices"
                  :key="choice.label"
                  class="choice-button"
                  type="button"
                  @click="goToStep(choice.next)"
                >
                  {{ choice.label }}
                </button>
              </div>
            </div>

            <div v-else-if="activeStep.kind === 'message'" class="dialogue-copy">
              <p class="rabbit-speech">{{ activeStep.message }}</p>
              <button class="primary-action" type="button" @click="continueFromMessage">
                {{ activeStep.action }}
              </button>
            </div>

            <form v-else-if="activeStep.kind === 'name'" class="dialogue-copy" @submit.prevent="continueFromMessage">
              <p v-for="line in activeStep.lines" :key="line" class="rabbit-speech">
                {{ line }}
              </p>
              <label class="name-field">
                <span>稱呼</span>
                <input
                  v-model="nameInput"
                  autocomplete="nickname"
                  maxlength="18"
                  placeholder="兔子"
                  type="text"
                />
              </label>
              <button class="primary-action" type="submit">{{ activeStep.action }}</button>
            </form>

            <div v-else class="dialogue-copy">
              <h1 class="file-title">{{ appTitle }}</h1>
              <div class="file-body">
                <p v-for="paragraph in activeStep.body" :key="paragraph">
                  {{ paragraph }}
                </p>
              </div>
              <button class="primary-action" type="button" @click="enterHome">
                {{ activeStep.action }}
              </button>
            </div>
          </article>
        </Transition>
      </div>
    </section>

    <section v-else class="home-route">
      <div class="home-ambient" aria-hidden="true" />
      <div class="home-stage">
        <img
          :src="homeRabbitUrl"
          alt="白色兔子抱著秘密檔案資料夾。"
          class="home-rabbit"
          width="1024"
          height="1536"
          decoding="async"
        />
        <div class="home-copy">
          <p class="home-kicker">主頁</p>
          <h1>{{ appTitle }}</h1>
          <p>這裡會放測驗、檔案與分享流程。現在先停在最小主頁。</p>
          <button class="quiet-action" type="button" @click="resetStory">再看一次開場</button>
        </div>
      </div>
    </section>
  </main>
</template>
