<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, type ObjectDirective } from 'vue';
import AnswerRatingIcon from './AnswerRatingIcon.vue';
import {
  getCategoryVisualUrl,
  type CategoryQuestion,
  type DetailQuestion,
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
  autoAdvanceDelay: number;
  completed: number;
  current: number;
  initialAnswer: AnsweredSecretFileAnswer | null;
  messages: QuestionnaireMessages;
  question: CategoryQuestion | DetailQuestion;
  storageWarning: boolean;
  total: number;
}>();

const emit = defineEmits<{
  advance: [];
  back: [];
  fileStatus: [];
  noteOpened: [];
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
const optionGroupObservers = new WeakMap<HTMLElement, ResizeObserver>();

function syncWrappedOptionLabels(element: HTMLElement): void {
  const labels = [...element.querySelectorAll<HTMLElement>('.answer-option-label')];
  const hasWrappedLabel = labels.some((label) => {
    const lineHeight = Number.parseFloat(getComputedStyle(label).lineHeight);
    return Number.isFinite(lineHeight) && label.scrollHeight > lineHeight * 1.5;
  });

  element.classList.toggle('has-wrapped-labels', hasWrappedLabel);
}

const vBalancedOptionLabels: ObjectDirective<HTMLElement> = {
  mounted(element) {
    const observer = new ResizeObserver(() => syncWrappedOptionLabels(element));
    optionGroupObservers.set(element, observer);
    observer.observe(element);
    syncWrappedOptionLabels(element);
  },
  updated(element) {
    void nextTick(() => syncWrappedOptionLabels(element));
  },
  unmounted(element) {
    optionGroupObservers.get(element)?.disconnect();
    optionGroupObservers.delete(element);
  },
};

const experienceLevelOptions = computed(() =>
  experienceAnswers
    .filter((value) => value !== 'unsure' && value !== 'seeDetails')
    .map((value) => ({
      label: props.messages.experienceLabels[value],
      value,
    })),
);
const experienceSpecialOptions = computed(() =>
  experienceAnswers
    .filter((value) => value === 'unsure' || (isCategoryQuestion.value && value === 'seeDetails'))
    .map((value) => ({ label: props.messages.experienceLabels[value], value })),
);
const preferenceLevelOptions = computed(() =>
  preferenceAnswers
    .filter((value) => value !== 'unsure' && value !== 'seeDetails')
    .map((value) => ({ label: props.messages.preferenceLabels[value], value })),
);
const preferenceSpecialOptions = computed(() =>
  preferenceAnswers
    .filter((value) => value === 'unsure' || (isCategoryQuestion.value && value === 'seeDetails'))
    .map((value) => ({ label: props.messages.preferenceLabels[value], value })),
);
const isCategoryQuestion = computed(() => props.question.level === 'category');
const categoryVisualUrl = computed(() => getCategoryVisualUrl(props.question.category.categoryId));
const questionTitle = computed(() =>
  props.question.level === 'category'
    ? props.question.category.name
    : props.question.detail.roles[props.question.role].title,
);
const questionDescription = computed(() =>
  props.question.level === 'category'
    ? props.question.category.roles[props.question.role].description
    : props.question.detail.roles[props.question.role].description,
);
const hasDistinctQuestionDescription = computed(() => questionDescription.value !== questionTitle.value);
const questionWarning = computed(() =>
  props.question.level === 'detail' ? props.question.detail.warning : null,
);
const canAdvance = computed(() => Boolean(experience.value && preference.value));
const autoAdvanceDuration = computed(() => `${props.autoAdvanceDelay}ms`);

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
  }, props.autoAdvanceDelay);
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

function handleNoteToggle(event: Event): void {
  clearAutoAdvance();

  if ((event.currentTarget as HTMLDetailsElement).open) {
    emit('noteOpened');
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
          :aria-label="messages.fileStatus"
          :title="messages.fileStatus"
          type="button"
          @click="emit('fileStatus')"
        >
          <svg class="questionnaire-header-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M8 5.5h11l5 5V26.5H8z" stroke="currentColor" stroke-linejoin="round" stroke-width="2.2" />
            <path d="M19 5.5v5h5M12 16h8M12 20.5h8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" />
          </svg>
          <span class="sr-only">{{ messages.fileStatus }}</span>
        </button>

        <div class="question-step-value" :aria-label="messages.progress(current, total)">
          <strong>{{ current }}</strong><span>/ {{ total }}</span>
        </div>

        <button
          v-if="isCategoryQuestion"
          class="questionnaire-header-action"
          :aria-label="messages.viewDetails"
          :title="messages.viewDetails"
          type="button"
          @click="openDetailList"
        >
          <AnswerRatingIcon class="questionnaire-header-icon" kind="special" value="seeDetails" />
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
            <h1>{{ questionTitle }}</h1>
            <p v-if="hasDistinctQuestionDescription">{{ questionDescription }}</p>
            <p v-if="questionWarning" class="questionnaire-warning">{{ messages.detailWarningPrefix }}{{ questionWarning }}</p>
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
            <div v-balanced-option-labels class="answer-level-options">
              <button
                v-for="option in experienceLevelOptions"
                :key="option.value"
                class="answer-option answer-level-option"
                :class="{ 'is-selected': experience === option.value }"
                :aria-pressed="experience === option.value"
                type="button"
                @click="chooseExperience(option.value)"
              >
                <AnswerRatingIcon class="answer-option-icon" kind="experience" :value="option.value" />
                <span class="answer-option-label">{{ option.label }}</span>
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
                <AnswerRatingIcon class="answer-option-icon" kind="special" :value="option.value" />
                <span class="answer-option-label">{{ option.label }}</span>
              </button>
            </div>
          </fieldset>

          <fieldset class="answer-fieldset">
            <legend>
              {{ messages.preferenceLegend }}<span class="answer-required-marker" aria-hidden="true">*</span>
            </legend>
            <div v-balanced-option-labels class="answer-level-options">
              <button
                v-for="option in preferenceLevelOptions"
                :key="option.value"
                class="answer-option answer-level-option"
                :class="{ 'is-selected': preference === option.value }"
                :aria-pressed="preference === option.value"
                type="button"
                @click="choosePreference(option.value)"
              >
                <AnswerRatingIcon class="answer-option-icon" kind="preference" :value="option.value" />
                <span class="answer-option-label">{{ option.label }}</span>
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
                <AnswerRatingIcon class="answer-option-icon" kind="special" :value="option.value" />
                <span class="answer-option-label">{{ option.label }}</span>
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
              @pointerdown="clearAutoAdvance"
            />
          </label>
          <small>{{ messages.noteHelp }}</small>
        </details>

        <div class="questionnaire-navigation">
          <button
            class="questionnaire-previous-action"
            :aria-label="messages.backQuestion"
            :disabled="!canGoBack"
            :title="messages.backQuestion"
            type="button"
            @click="emit('back')"
          >
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="m18.5 8-8 8 8 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6" />
          </svg>
          <span>{{ messages.backQuestion }}</span>
          </button>
          <button class="questionnaire-next-action" :disabled="!canAdvance" type="submit">
            <template v-if="autoAdvancePending">
              <svg
                :key="countdownKey"
                class="next-action-countdown-ring"
                :style="{ '--auto-advance-duration': autoAdvanceDuration }"
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
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

        <p v-if="autoAdvancePending" class="sr-only" role="status">{{ messages.autoAdvance(props.autoAdvanceDelay / 1000) }}</p>
        <p v-if="errorMessage" class="questionnaire-form-error" role="alert">{{ errorMessage }}</p>
      </form>
    </div>

    <dialog v-if="isCategoryQuestion" ref="detailListDialog" class="category-detail-dialog" @close="clearAutoAdvance">
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
        <li v-for="item in question.category.detailItems" :key="item.detailId">
          <span>{{ item.roles[question.role].description }}</span>
          <small v-if="item.warning">{{ messages.detailWarningPrefix }}{{ item.warning }}</small>
        </li>
      </ol>
    </dialog>
  </section>
</template>
