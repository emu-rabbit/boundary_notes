<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  getCategoryQuestionId,
  getCategoryVisualUrl,
  type QuestionBank,
  type QuestionBankCategory,
} from '../question-bank';
import type {
  AnsweredSecretFileAnswer,
  ExperienceAnswer,
  PreferenceAnswer,
  QuestionRole,
  SecretFile,
} from '../secret-file/domain/types';
import AnswerRatingIcon from './AnswerRatingIcon.vue';
import type { QuestionnaireMessages } from './messages';

const props = defineProps<{
  backHome: string;
  messages: QuestionnaireMessages;
  questionBank: QuestionBank;
  secretFile: SecretFile;
  storageWarning: boolean;
}>();

const emit = defineEmits<{
  editCategory: [categoryId: string, role: QuestionRole];
  home: [];
  preview: [];
  upload: [];
}>();

const selectedRole = ref<QuestionRole>(
  props.secretFile.scope === 'passiveOnly' ? 'passive' : 'active',
);
const availableRoles = computed<readonly QuestionRole[]>(() => {
  if (props.secretFile.scope === 'all') {
    return ['active', 'passive'];
  }

  return [props.secretFile.scope === 'activeOnly' ? 'active' : 'passive'];
});

function getCategoryAnswer(categoryId: string): AnsweredSecretFileAnswer | null {
  const answer = props.secretFile.answers[getCategoryQuestionId(categoryId, selectedRole.value)];
  return answer?.state === 'answered' ? answer : null;
}

function getDetailAnsweredCount(categoryId: string): number {
  const prefix = `detail.${categoryId}.`;
  const roleSuffix = `.${selectedRole.value}`;

  return Object.entries(props.secretFile.answers).filter(
    ([questionId, answer]) =>
      questionId.startsWith(prefix) &&
      questionId.endsWith(roleSuffix) &&
      answer.state === 'answered',
  ).length;
}

function getCategoryProgress(category: QuestionBankCategory) {
  const answered = getDetailAnsweredCount(category.categoryId);
  const total = category.itemCount;

  return {
    answered,
    percent: total === 0 ? 0 : Math.round((answered / total) * 100),
    total,
  };
}

function getCategorySummary(category: QuestionBankCategory): string {
  if (!category.includeInCategoryRound) {
    return props.messages.results.otherSummary;
  }

  const answer = getCategoryAnswer(category.categoryId);

  if (!answer) {
    return props.messages.results.unansweredSummary;
  }

  if (answer.experience === 'seeDetails' || answer.preference === 'seeDetails') {
    return props.messages.results.seeDetailsSummary;
  }

  return props.messages.results.answerSummary(
    props.messages.experienceLabels[answer.experience],
    props.messages.preferenceLabels[answer.preference],
  );
}

function getRatingKind(
  kind: 'experience' | 'preference',
  value: ExperienceAnswer | PreferenceAnswer,
): 'experience' | 'preference' | 'special' {
  return value === 'unsure' || value === 'seeDetails' ? 'special' : kind;
}

function getRatingTone(
  kind: 'experience' | 'preference',
  value: ExperienceAnswer | PreferenceAnswer,
): string {
  if (kind === 'preference' && value === 'hardNo') {
    return 'is-boundary';
  }

  if (kind === 'preference' && value === 'love') {
    return 'is-favorite';
  }

  if (kind === 'experience' && value === 'veryExtensive') {
    return 'is-expert';
  }

  if (kind === 'experience' && value === 'none') {
    return 'is-none';
  }

  return '';
}

const overallProgress = computed(() => {
  const totals = props.questionBank.categories.reduce(
    (progress, category) => {
      const categoryProgress = getCategoryProgress(category);
      progress.answered += categoryProgress.answered;
      progress.total += categoryProgress.total;
      return progress;
    },
    { answered: 0, total: 0 },
  );

  return {
    ...totals,
    percent: totals.total === 0 ? 0 : Math.round((totals.answered / totals.total) * 100),
  };
});
</script>

<template>
  <section class="questionnaire-route questionnaire-results-route">
    <div class="questionnaire-page-shell questionnaire-results-shell">
      <header class="results-mobile-bar">
        <button class="results-icon-action" type="button" @click="emit('home')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.5 5-7 7 7 7" />
          </svg>
          <span>{{ backHome }}</span>
        </button>
        <button class="results-mobile-preview" type="button" @click="emit('preview')">
          {{ messages.results.preview }}
          <span aria-hidden="true">↗</span>
        </button>
      </header>

      <aside class="results-sidebar">
        <div class="results-sidebar__intro">
          <p class="questionnaire-kicker">{{ messages.results.editing }}</p>
          <h1>{{ messages.results.title }}</h1>
          <p>{{ messages.results.firstPhaseComplete }}</p>
        </div>

        <p v-if="storageWarning" class="questionnaire-warning" role="status">
          {{ messages.storageWarning }}
        </p>

        <div class="results-overall-progress">
          <div>
            <span>{{ messages.results.overallProgress }}</span>
            <strong>{{ overallProgress.percent }}%</strong>
          </div>
          <div class="results-progress-track" aria-hidden="true">
            <span :style="{ width: `${overallProgress.percent}%` }"></span>
          </div>
          <small>{{ messages.results.detailProgress(overallProgress.answered, overallProgress.total) }}</small>
        </div>

        <section class="results-spotlight" :aria-label="messages.results.spotlightTitle">
          <div class="results-spotlight__heading">
            <span class="results-spotlight__mark" aria-hidden="true">✦</span>
            <div>
              <h2>{{ messages.results.spotlightTitle }}</h2>
              <p>{{ messages.results.spotlightCount(secretFile.spotlight.selectedQuestionIds.length, 5) }}</p>
            </div>
          </div>
          <div class="results-spotlight__slots" aria-hidden="true">
            <span
              v-for="slot in 5"
              :key="slot"
              :class="{ 'is-filled': slot <= secretFile.spotlight.selectedQuestionIds.length }"
            >
              {{ slot <= secretFile.spotlight.selectedQuestionIds.length ? '★' : slot }}
            </span>
          </div>
          <p>{{ messages.results.spotlightHelp }}</p>
        </section>

        <div v-if="availableRoles.length > 1" class="result-role-switch" role="group" :aria-label="messages.results.roleSwitchLabel">
          <button
            v-for="role in availableRoles"
            :key="role"
            :class="{ 'is-selected': selectedRole === role }"
            :aria-pressed="selectedRole === role"
            type="button"
            @click="selectedRole = role"
          >
            {{ messages.roleLabels[role] }}
          </button>
        </div>

        <nav class="results-sidebar__actions" :aria-label="messages.results.fileActionsLabel">
          <button class="results-primary-action" type="button" @click="emit('upload')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5h14v-5" />
            </svg>
            {{ messages.results.upload }}
          </button>
          <button class="results-secondary-action" type="button" @click="emit('preview')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12s3.2-5.5 9-5.5S21 12 21 12s-3.2 5.5-9 5.5S3 12 3 12Z" />
              <circle cx="12" cy="12" r="2.2" />
            </svg>
            {{ messages.results.preview }}
            <span aria-hidden="true">↗</span>
          </button>
          <button class="results-home-action" type="button" @click="emit('home')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4v-9Z" />
            </svg>
            {{ backHome }}
          </button>
        </nav>
      </aside>

      <main class="results-content">
        <div class="results-content__heading">
          <div>
            <p>{{ messages.results.sectionKicker(messages.roleLabels[selectedRole]) }}</p>
            <h2>{{ messages.results.categorySectionTitle }}</h2>
          </div>
          <p class="results-edit-hint">
            <span aria-hidden="true">✦</span>
            {{ messages.results.editHint }}
          </p>
        </div>

        <div v-if="availableRoles.length > 1" class="result-role-switch result-role-switch--mobile" role="group" :aria-label="messages.results.roleSwitchLabel">
          <button
            v-for="role in availableRoles"
            :key="role"
            :class="{ 'is-selected': selectedRole === role }"
            :aria-pressed="selectedRole === role"
            type="button"
            @click="selectedRole = role"
          >
            {{ messages.roleLabels[role] }}
          </button>
        </div>

        <div class="result-category-grid">
          <button
            v-for="(category, index) in props.questionBank.categories"
            :key="`${category.categoryId}.${selectedRole}`"
            class="result-category-card"
            :class="{ 'is-other': !category.includeInCategoryRound }"
            type="button"
            :aria-label="messages.results.editCategoryAria(category.name)"
            @click="emit('editCategory', category.categoryId, selectedRole)"
          >
            <img
              :src="getCategoryVisualUrl(category.categoryId)"
              :alt="messages.categoryVisualAlt(category.name)"
              width="320"
              height="320"
              :loading="index < 3 ? 'eager' : 'lazy'"
              decoding="async"
            />
            <span class="result-category-card__body">
              <span class="result-category-card__heading">
                <strong>{{ category.name }}</strong>
              </span>
              <span class="result-category-summary-row">
                <span
                  v-if="getCategoryAnswer(category.categoryId)"
                  class="result-category-signals"
                  aria-hidden="true"
                >
                  <template
                    v-if="getCategoryAnswer(category.categoryId)!.experience === 'seeDetails' || getCategoryAnswer(category.categoryId)!.preference === 'seeDetails'"
                  >
                    <span class="result-answer-signal">
                      <AnswerRatingIcon kind="special" value="seeDetails" />
                    </span>
                  </template>
                  <template v-else>
                    <span
                      class="result-answer-signal"
                      :class="getRatingTone('experience', getCategoryAnswer(category.categoryId)!.experience)"
                    >
                      <AnswerRatingIcon
                        :kind="getRatingKind('experience', getCategoryAnswer(category.categoryId)!.experience)"
                        :value="getCategoryAnswer(category.categoryId)!.experience"
                      />
                    </span>
                    <span
                      class="result-answer-signal"
                      :class="getRatingTone('preference', getCategoryAnswer(category.categoryId)!.preference)"
                    >
                      <AnswerRatingIcon
                        :kind="getRatingKind('preference', getCategoryAnswer(category.categoryId)!.preference)"
                        :value="getCategoryAnswer(category.categoryId)!.preference"
                      />
                    </span>
                  </template>
                </span>
                <span class="result-category-summary">{{ getCategorySummary(category) }}</span>
              </span>
              <span class="result-category-progress">
                <span>
                  {{ messages.results.detailProgress(getCategoryProgress(category).answered, getCategoryProgress(category).total) }}
                </span>
                <strong>{{ getCategoryProgress(category).percent }}%</strong>
              </span>
              <span class="results-progress-track" aria-hidden="true">
                <span :style="{ width: `${getCategoryProgress(category).percent}%` }"></span>
              </span>
            </span>
          </button>
        </div>
      </main>

      <div class="results-mobile-actions">
        <button class="results-primary-action" type="button" @click="emit('upload')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5h14v-5" />
          </svg>
          {{ messages.results.upload }}
        </button>
      </div>
    </div>
  </section>
</template>
