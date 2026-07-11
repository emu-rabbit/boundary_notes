<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
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
const detailListDialog = ref<HTMLDialogElement | null>(null);
let autoAdvanceTimer: ReturnType<typeof setTimeout> | undefined;

const experienceIcons: Record<ExperienceAnswer, string> = {
  none: '○',
  little: '◔',
  some: '◑',
  extensive: '◕',
  veryExtensive: '●',
  unsure: '?',
  seeDetails: '☷',
};
const experienceFillPercent: Record<Exclude<ExperienceAnswer, 'unsure' | 'seeDetails'>, number> = {
  none: 0,
  little: 25,
  some: 50,
  extensive: 75,
  veryExtensive: 100,
};
const preferenceIcons: Record<PreferenceAnswer, string> = {
  hardNo: '⊘',
  reluctant: '△',
  neutral: '—',
  like: '♡',
  love: '♥',
  unsure: '?',
  seeDetails: '☷',
};
const experienceLevelOptions = computed(() =>
  experienceAnswers
    .filter((value) => value !== 'unsure' && value !== 'seeDetails')
    .map((value) => ({
      fill: experienceFillPercent[value],
      icon: experienceIcons[value],
      label: props.messages.experienceLabels[value],
      value,
    })),
);
const experienceSpecialOptions = computed(() =>
  experienceAnswers
    .filter((value) => value === 'unsure' || value === 'seeDetails')
    .map((value) => ({ icon: experienceIcons[value], label: props.messages.experienceLabels[value], value })),
);
const preferenceLevelOptions = computed(() =>
  preferenceAnswers
    .filter((value) => value !== 'unsure' && value !== 'seeDetails')
    .map((value) => ({ icon: preferenceIcons[value], label: props.messages.preferenceLabels[value], value })),
);
const preferenceSpecialOptions = computed(() =>
  preferenceAnswers
    .filter((value) => value === 'unsure' || value === 'seeDetails')
    .map((value) => ({ icon: preferenceIcons[value], label: props.messages.preferenceLabels[value], value })),
);
const categoryVisualUrl = computed(() => getCategoryVisualUrl(props.question.category.categoryId));
const canAdvance = computed(() => Boolean(experience.value && preference.value));

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

  if (!canAdvance.value) {
    return;
  }

  if (!saveAnswer()) {
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
  if (canAdvance.value) {
    saveAnswer();
  }
}

function advanceImmediately(): void {
  if (!saveAnswer()) {
    return;
  }

  clearAutoAdvance();
  emit('advance');
}

function openDetailList(): void {
  void nextTick(() => detailListDialog.value?.showModal());
}

function closeDetailList(): void {
  detailListDialog.value?.close();
}

onBeforeUnmount(() => {
  clearAutoAdvance();
  detailListDialog.value?.close();
});
</script>

<template>
  <section class="questionnaire-route category-question-route">
    <div class="questionnaire-page-shell">
      <header class="questionnaire-page-header">
        <button
          class="questionnaire-header-action"
          :aria-label="messages.backQuestion"
          :disabled="!canGoBack"
          :title="messages.backQuestion"
          type="button"
          @click="emit('back')"
        >
          <span aria-hidden="true">←</span>
          <span class="sr-only">{{ messages.backQuestion }}</span>
        </button>

        <div class="question-step-value" :aria-label="messages.progress(current, total)">
          <strong>{{ current }}</strong><span>/ {{ total }}</span>
        </div>

        <button
          class="questionnaire-header-action"
          :aria-label="messages.viewDetails"
          :title="messages.viewDetails"
          type="button"
          @click="openDetailList"
        >
          <span aria-hidden="true">☷</span>
          <span class="sr-only">{{ messages.viewDetails }}</span>
        </button>

        <span class="sr-only">{{ messages.completedProgress(completed, total) }}</span>
      </header>

      <form class="category-question-card" @submit.prevent="advanceImmediately">
        <div class="category-question-intro">
          <figure class="category-visual">
            <img
              :src="categoryVisualUrl"
              :alt="messages.categoryVisualAlt(question.category.name)"
              height="512"
              width="512"
            />
            <span class="category-role-badge">{{ messages.roleLabels[question.role] }}</span>
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
            <legend>
              {{ messages.experienceLegend }}<span class="answer-required-marker" aria-hidden="true">*</span>
            </legend>
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
                <span
                  class="answer-option-icon answer-option-icon--experience"
                  :style="{ '--experience-fill': `${option.fill}%` }"
                  aria-hidden="true"
                >{{ option.icon }}</span>
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
                <span class="answer-option-icon" aria-hidden="true">{{ option.icon }}</span>
                <span>{{ option.label }}</span>
              </button>
            </div>
          </fieldset>

          <fieldset class="answer-fieldset">
            <legend>
              {{ messages.preferenceLegend }}<span class="answer-required-marker" aria-hidden="true">*</span>
            </legend>
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
                <span class="answer-option-icon" aria-hidden="true">{{ option.icon }}</span>
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
                <span class="answer-option-icon" aria-hidden="true">{{ option.icon }}</span>
                <span>{{ option.label }}</span>
              </button>
            </div>
          </fieldset>
        </div>

        <label class="category-note-field">
          <span>{{ messages.noteLabel }}</span>
          <input
            v-model="note"
            :placeholder="messages.notePlaceholder"
            type="text"
            @blur="saveNote"
            @focus="clearAutoAdvance"
            @pointerdown="clearAutoAdvance"
          />
          <small>{{ messages.noteHelp }}</small>
        </label>

        <div class="questionnaire-navigation">
          <button class="questionnaire-next-action" :disabled="!canAdvance" type="submit">
            <template v-if="autoAdvancePending">
              <svg :key="countdownKey" class="next-action-countdown-ring" viewBox="0 0 120 120" aria-hidden="true">
                <circle class="next-action-countdown-ring-track" cx="60" cy="60" r="54" />
                <circle class="next-action-countdown-ring-progress" cx="60" cy="60" r="54" />
              </svg>
              {{ messages.autoAdvanceAction }}
            </template>
            <template v-else>
              {{ messages.nextQuestion }} <span aria-hidden="true">→</span>
            </template>
          </button>
        </div>

        <p v-if="autoAdvancePending" class="sr-only" role="status">{{ messages.autoAdvance }}</p>
        <p v-if="errorMessage" class="questionnaire-form-error" role="alert">{{ errorMessage }}</p>
      </form>
    </div>

    <dialog ref="detailListDialog" class="category-detail-dialog" @close="clearAutoAdvance">
      <div class="category-detail-dialog__heading">
        <div>
          <p>{{ question.category.name }}</p>
          <h2>{{ messages.detailListTitle }}</h2>
        </div>
        <button :aria-label="messages.closeDetails" :title="messages.closeDetails" type="button" @click="closeDetailList">×</button>
      </div>
      <p class="category-detail-dialog__intro">{{ messages.detailListDescription }}</p>
      <p class="category-detail-dialog__see-details">{{ messages.detailSeeDetailsExplanation }}</p>
      <ol class="category-detail-list">
        <li v-for="item in question.category.detailItems" :key="item.label">
          <span>{{ item.roles[question.role].description }}</span>
          <small v-if="item.warning">{{ messages.detailWarningPrefix }}{{ item.warning }}</small>
        </li>
      </ol>
    </dialog>
  </section>
</template>
