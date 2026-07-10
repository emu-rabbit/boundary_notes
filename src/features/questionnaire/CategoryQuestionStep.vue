<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  getCategoryVisualUrl,
  type CategoryQuestion,
} from '../question-bank';
import {
  experienceAnswers,
  preferenceAnswers,
  secretFileNoteSchema,
  type AnswerQuestionInput,
  type ExperienceAnswer,
  type PreferenceAnswer,
} from '../secret-file';
import type { AnsweredSecretFileAnswer } from '../secret-file/domain/types';
import type { QuestionnaireMessages } from './messages';

const props = defineProps<{
  canGoBack: boolean;
  completed: number;
  current: number;
  initialAnswer: AnsweredSecretFileAnswer | null;
  messages: QuestionnaireMessages;
  question: CategoryQuestion;
  storageWarning: boolean;
  total: number;
}>();

const emit = defineEmits<{
  advance: [];
  back: [];
  save: [answer: AnswerQuestionInput];
}>();

const experience = ref<ExperienceAnswer | null>(props.initialAnswer?.experience ?? null);
const preference = ref<PreferenceAnswer | null>(props.initialAnswer?.preference ?? null);
const note = ref(props.initialAnswer?.note ?? '');
const errorMessage = ref('');
const autoAdvancePending = ref(false);
const countdownKey = ref(0);
let autoAdvanceTimer: ReturnType<typeof setTimeout> | undefined;

const experienceIcons: Record<ExperienceAnswer, string> = {
  none: '○',
  little: '◔',
  some: '◑',
  extensive: '◕',
  veryExtensive: '●',
  unsure: '?',
  seeDetails: '↗',
};
const preferenceIcons: Record<PreferenceAnswer, string> = {
  hardNo: '⊘',
  reluctant: '△',
  neutral: '—',
  like: '♡',
  love: '♥',
  unsure: '?',
  seeDetails: '↗',
};
const experienceLevelOptions = computed(() =>
  experienceAnswers
    .filter((value) => value !== 'unsure' && value !== 'seeDetails')
    .map((value) => ({
      icon: experienceIcons[value],
      label: props.messages.experienceLabels[value],
      value,
    })),
);
const experienceSpecialOptions = computed(() =>
  experienceAnswers
    .filter((value) => value === 'unsure' || value === 'seeDetails')
    .map((value) => ({
      icon: experienceIcons[value],
      label: props.messages.experienceLabels[value],
      value,
    })),
);
const preferenceLevelOptions = computed(() =>
  preferenceAnswers
    .filter((value) => value !== 'unsure' && value !== 'seeDetails')
    .map((value) => ({
      icon: preferenceIcons[value],
      label: props.messages.preferenceLabels[value],
      value,
    })),
);
const preferenceSpecialOptions = computed(() =>
  preferenceAnswers
    .filter((value) => value === 'unsure' || value === 'seeDetails')
    .map((value) => ({
      icon: preferenceIcons[value],
      label: props.messages.preferenceLabels[value],
      value,
    })),
);
const categoryVisualUrl = computed(() => getCategoryVisualUrl(props.question.category.categoryId));

function clearAutoAdvance(): void {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = undefined;
  }

  autoAdvancePending.value = false;
}

function saveAnswer(): boolean {
  errorMessage.value = '';

  if (!experience.value || !preference.value) {
    errorMessage.value = props.messages.answerRequired;
    return false;
  }

  const parsedNote = secretFileNoteSchema.safeParse(note.value.trim());

  if (!parsedNote.success) {
    errorMessage.value = parsedNote.error.issues[0]?.message ?? props.messages.answerRequired;
    return false;
  }

  emit('save', {
    experience: experience.value,
    note: parsedNote.data,
    preference: preference.value,
  });
  return true;
}

function scheduleAutoAdvance(): void {
  clearAutoAdvance();
  errorMessage.value = '';

  if (!experience.value || !preference.value || !saveAnswer()) {
    return;
  }

  countdownKey.value += 1;
  autoAdvancePending.value = true;
  autoAdvanceTimer = setTimeout(() => {
    autoAdvancePending.value = false;
    emit('advance');
  }, 3000);
}

function chooseExperience(value: ExperienceAnswer): void {
  experience.value = value;
  scheduleAutoAdvance();
}

function choosePreference(value: PreferenceAnswer): void {
  preference.value = value;
  scheduleAutoAdvance();
}

function saveNote(): void {
  if (experience.value && preference.value) {
    scheduleAutoAdvance();
  }
}

function handleNoteToggle(event: Event): void {
  if ((event.currentTarget as HTMLDetailsElement).open) {
    clearAutoAdvance();
  }
}

onBeforeUnmount(clearAutoAdvance);
</script>

<template>
  <section class="questionnaire-route category-question-route">
    <div class="questionnaire-page-shell">
      <header class="questionnaire-page-header">
        <button
          class="questionnaire-back-action"
          :disabled="!canGoBack"
          type="button"
          @click="emit('back')"
        >
          <span aria-hidden="true">←</span>
          <span>{{ messages.backQuestion }}</span>
        </button>

        <div class="question-step-value" aria-hidden="true">
          <strong>{{ current }}</strong><span>/{{ total }}</span>
        </div>

        <span class="sr-only">
          {{ messages.progress(current, total) }}，{{ messages.completedProgress(completed, total) }}
        </span>

        <div
          class="questionnaire-progress-track"
          role="progressbar"
          :aria-label="messages.completedProgress(completed, total)"
          :aria-valuemax="total"
          :aria-valuemin="0"
          :aria-valuenow="completed"
        >
          <span :style="{ '--questionnaire-progress': `${(completed / total) * 100}%` }" />
        </div>
      </header>

      <form class="category-question-card" @submit.prevent="saveNote">
        <div class="category-question-intro">
          <figure class="category-visual">
            <img
              :src="categoryVisualUrl"
              :alt="messages.categoryVisualAlt(question.category.name)"
              height="512"
              width="512"
            />
          </figure>

          <div class="category-question-copy">
            <h1>{{ question.category.name }}</h1>
            <p>{{ question.category.roles[question.role].description }}</p>
          </div>
        </div>

        <p v-if="storageWarning" class="questionnaire-warning" role="status">
          {{ messages.storageWarning }}
        </p>

        <div class="answer-groups">
          <fieldset class="answer-fieldset">
            <legend>{{ messages.experienceLegend }}</legend>
            <div class="answer-level-options">
              <button
                v-for="option in experienceLevelOptions"
                :key="option.value"
                class="answer-option answer-level-option"
                :class="{ 'is-selected': experience === option.value }"
                :aria-pressed="experience === option.value"
                type="button"
                @click="chooseExperience(option.value)"
              >
                <span class="answer-option-icon" aria-hidden="true">
                  {{ option.icon }}
                  <svg
                    v-if="autoAdvancePending && experience === option.value"
                    :key="`experience-${option.value}-${countdownKey}`"
                    class="answer-countdown-ring"
                    viewBox="0 0 20 20"
                  >
                    <circle class="answer-countdown-ring-track" cx="10" cy="10" r="8" />
                    <circle class="answer-countdown-ring-progress" cx="10" cy="10" r="8" />
                  </svg>
                </span>
                <span>{{ option.label }}</span>
              </button>
            </div>
            <div class="answer-special-options">
              <button
                v-for="option in experienceSpecialOptions"
                :key="option.value"
                class="answer-option answer-special-option"
                :class="{ 'is-selected': experience === option.value }"
                :aria-pressed="experience === option.value"
                type="button"
                @click="chooseExperience(option.value)"
              >
                <span class="answer-option-icon" aria-hidden="true">
                  {{ option.icon }}
                  <svg
                    v-if="autoAdvancePending && experience === option.value"
                    :key="`experience-${option.value}-${countdownKey}`"
                    class="answer-countdown-ring"
                    viewBox="0 0 20 20"
                  >
                    <circle class="answer-countdown-ring-track" cx="10" cy="10" r="8" />
                    <circle class="answer-countdown-ring-progress" cx="10" cy="10" r="8" />
                  </svg>
                </span>
                <span>{{ option.label }}</span>
              </button>
            </div>
          </fieldset>

          <fieldset class="answer-fieldset">
            <legend>{{ messages.preferenceLegend }}</legend>
            <div class="answer-level-options">
              <button
                v-for="option in preferenceLevelOptions"
                :key="option.value"
                class="answer-option answer-level-option"
                :class="{ 'is-selected': preference === option.value }"
                :aria-pressed="preference === option.value"
                type="button"
                @click="choosePreference(option.value)"
              >
                <span class="answer-option-icon" aria-hidden="true">
                  {{ option.icon }}
                  <svg
                    v-if="autoAdvancePending && preference === option.value"
                    :key="`preference-${option.value}-${countdownKey}`"
                    class="answer-countdown-ring"
                    viewBox="0 0 20 20"
                  >
                    <circle class="answer-countdown-ring-track" cx="10" cy="10" r="8" />
                    <circle class="answer-countdown-ring-progress" cx="10" cy="10" r="8" />
                  </svg>
                </span>
                <span>{{ option.label }}</span>
              </button>
            </div>
            <div class="answer-special-options">
              <button
                v-for="option in preferenceSpecialOptions"
                :key="option.value"
                class="answer-option answer-special-option"
                :class="{ 'is-selected': preference === option.value }"
                :aria-pressed="preference === option.value"
                type="button"
                @click="choosePreference(option.value)"
              >
                <span class="answer-option-icon" aria-hidden="true">
                  {{ option.icon }}
                  <svg
                    v-if="autoAdvancePending && preference === option.value"
                    :key="`preference-${option.value}-${countdownKey}`"
                    class="answer-countdown-ring"
                    viewBox="0 0 20 20"
                  >
                    <circle class="answer-countdown-ring-track" cx="10" cy="10" r="8" />
                    <circle class="answer-countdown-ring-progress" cx="10" cy="10" r="8" />
                  </svg>
                </span>
                <span>{{ option.label }}</span>
              </button>
            </div>
          </fieldset>
        </div>

        <details class="category-note-field" @toggle="handleNoteToggle">
          <summary>{{ messages.noteLabel }}</summary>
          <label>
            <span class="sr-only">{{ messages.noteLabel }}</span>
            <input
              v-model="note"
              :placeholder="messages.notePlaceholder"
              type="text"
              @blur="saveNote"
              @focus="clearAutoAdvance"
            />
          </label>
          <small>{{ messages.noteHelp }}</small>
        </details>

        <p v-if="autoAdvancePending" class="sr-only" role="status">
          {{ messages.autoAdvance }}
        </p>
        <p v-if="errorMessage" class="questionnaire-form-error" role="alert">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </section>
</template>
