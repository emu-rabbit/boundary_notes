<script setup lang="ts">
import { computed, ref } from 'vue';
import type { LocaleMessages } from '../../app/i18n';
import BrandMark from '../../components/BrandMark.vue';
import RabbitScene from '../../components/RabbitScene.vue';
import { getQuestionBankCounts } from '../question-bank';
import type { SecretFileScope } from '../secret-file';
import { rabbitPoseUrls, type RabbitPose } from '../story/rabbitAssets';
import { hasPlayedStory, markStoryPlayed } from '../story/storyProgress';
import type { QuestionnaireMessages } from './messages';

type IntroStep =
  | 'scope'
  | 'explanation'
  | 'questionCount'
  | 'categoryCount'
  | 'autosave'
  | 'ready';

const props = defineProps<{
  appTitle: string;
  appMessages: LocaleMessages;
  errorMessage: string;
  messages: QuestionnaireMessages;
  profileName: string;
}>();

const emit = defineEmits<{
  cancel: [];
  start: [scope: SecretFileScope];
}>();

const step = ref<IntroStep>('scope');
const selectedScope = ref<SecretFileScope | null>(null);
const counts = computed(() =>
  selectedScope.value ? getQuestionBankCounts(selectedScope.value) : null,
);

const poseByStep: Record<IntroStep, RabbitPose> = {
  scope: 'storyGreeting',
  explanation: 'thinking',
  questionCount: 'questioning',
  categoryCount: 'startled',
  autosave: 'folder',
  ready: 'storyGreeting',
};

const activePose = computed(() => poseByStep[step.value]);
const canSkipStory = computed(() => selectedScope.value !== null && hasPlayedStory('create'));
const activeLines = computed(() => {
  switch (step.value) {
    case 'scope':
      return props.messages.intro.scopeLines(props.profileName);
    case 'explanation':
      return props.messages.intro.explanationLines;
    case 'questionCount':
      return props.messages.intro.questionCountLines(counts.value?.detailQuestionCount ?? 0);
    case 'categoryCount':
      return props.messages.intro.categoryCountLines(counts.value?.categoryCount ?? 0);
    case 'autosave':
      return props.messages.intro.autosaveLines;
    case 'ready':
      return props.messages.intro.readyLines(props.profileName);
  }
});

function selectScope(scope: SecretFileScope): void {
  selectedScope.value = scope;
  step.value = 'questionCount';
}

function continueIntro(): void {
  const nextStep: Partial<Record<IntroStep, IntroStep>> = {
    explanation: 'scope',
    questionCount: 'categoryCount',
    categoryCount: 'autosave',
    autosave: 'ready',
  };

  step.value = nextStep[step.value] ?? step.value;
}

function start(): void {
  if (selectedScope.value) {
    markStoryPlayed('create');
    emit('start', selectedScope.value);
  }
}
</script>

<template>
  <section class="story-route questionnaire-intro" :data-tone="step === 'autosave' ? 'archive' : 'welcome'">
    <div class="ambient-grid" aria-hidden="true" />

    <header class="story-header">
      <BrandMark
        :action-label="appMessages.common.backHome"
        :messages="appMessages"
        :title="appTitle"
        @restart="emit('cancel')"
      />
      <button
        v-if="canSkipStory"
        class="story-skip-action"
        type="button"
        @click="start"
      >
        {{ appMessages.common.skipStory }}
      </button>
    </header>

    <div class="story-layout">
      <RabbitScene
        :animation-key="step"
        :image-url="rabbitPoseUrls[activePose]"
        :lamp-lit="step === 'autosave'"
        :pose="activePose"
      />

      <Transition name="dialogue" mode="out-in">
        <article :key="step" class="dialogue-panel questionnaire-intro-panel">
          <div class="speaker-name">{{ messages.intro.speakerName }}</div>
          <div class="dialogue-copy">
            <p v-for="line in activeLines" :key="line" class="rabbit-speech">
              {{ line }}
            </p>

            <div v-if="step === 'scope'" class="choice-grid questionnaire-scope-actions">
              <button
                v-for="choice in messages.intro.scopeChoices"
                :key="choice.scope"
                class="choice-button"
                type="button"
                @click="selectScope(choice.scope)"
              >
                <span>{{ choice.label }}</span>
                <span v-if="choice.suffix" class="questionnaire-scope-choice-suffix">
                  {{ choice.suffix }}
                </span>
              </button>
              <button class="questionnaire-help-action" type="button" @click="step = 'explanation'">
                {{ messages.intro.scopeHelp }}
              </button>
            </div>

            <div
              v-else-if="step === 'explanation' || step === 'questionCount' || step === 'categoryCount' || step === 'autosave'"
              class="questionnaire-intro-actions"
            >
              <button class="primary-action" type="button" @click="continueIntro">
                {{
                  step === 'explanation'
                    ? messages.intro.explanationAction
                    : step === 'questionCount'
                      ? messages.intro.questionCountAction
                      : step === 'categoryCount'
                        ? messages.intro.categoryCountAction
                        : messages.intro.autosaveAction
                }}
              </button>
            </div>
            <div v-else class="questionnaire-ready-actions">
              <p v-if="errorMessage" class="questionnaire-form-error" role="alert">
                {{ errorMessage }}
              </p>
              <button class="questionnaire-ready-choice is-primary" type="button" @click="start">
                {{ messages.intro.ready }}
              </button>
              <button class="questionnaire-ready-choice" type="button" @click="emit('cancel')">
                {{ messages.intro.notReady }}
              </button>
            </div>
          </div>
        </article>
      </Transition>
    </div>
  </section>
</template>
