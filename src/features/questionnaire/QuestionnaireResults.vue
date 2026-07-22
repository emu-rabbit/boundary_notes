<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { calculateProgressPercent } from '../secret-file/domain/progress';
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
import { shouldOfferDetailStartChoice } from './detailStartChoice';
import { getResultsAnswerSummary, type QuestionnaireMessages } from './messages';

const props = defineProps<{
  backHome: string;
  initialRole: QuestionRole | null;
  messages: QuestionnaireMessages;
  previewHref: string;
  questionBank: QuestionBank;
  secretFile: SecretFile;
  storageWarning: boolean;
}>();

const emit = defineEmits<{
  editCategory: [categoryId: string, role: QuestionRole, mode: 'all' | 'unanswered'];
  home: [];
  upload: [];
  updateSpotlight: [role: QuestionRole, questionIds: string[]];
}>();

const selectedRole = ref<QuestionRole>(props.initialRole
  ?? (props.secretFile.scope === 'passiveOnly' ? 'passive' : 'active'));
const detailStartDialog = ref<HTMLDialogElement | null>(null);
const pendingCategory = ref<QuestionBankCategory | null>(null);
const spotlightDialog = ref<HTMLDialogElement | null>(null);
const activeSpotlightIndex = ref<number | null>(null);

interface SpotlightCandidate {
  categoryId: string;
  categoryName: string;
  description: string;
  questionId: string;
  role: QuestionRole;
  preference: 'like' | 'love';
  title: string;
}

const spotlightCandidates = computed<readonly SpotlightCandidate[]>(() => {
  const candidates: SpotlightCandidate[] = [];

  for (const category of props.questionBank.categories) {
    for (const role of [selectedRole.value]) {
      const categoryQuestionId = getCategoryQuestionId(category.categoryId, role);
      const categoryAnswer = props.secretFile.answers[categoryQuestionId];

      if (category.includeInCategoryRound && categoryAnswer?.state === 'answered' && (categoryAnswer.preference === 'like' || categoryAnswer.preference === 'love')) {
        candidates.push({
          categoryId: category.categoryId,
          categoryName: category.name,
          description: category.roles[role].description,
          questionId: categoryQuestionId,
          role,
          preference: categoryAnswer.preference,
          title: category.name,
        });
      }

      for (const detail of category.detailItems) {
        const questionId = `detail.${category.categoryId}.${detail.detailId}.${role}`;
        const answer = props.secretFile.answers[questionId];

        if (answer?.state === 'answered' && (answer.preference === 'like' || answer.preference === 'love')) {
          candidates.push({
            categoryId: category.categoryId,
            categoryName: category.name,
            description: detail.roles[role].description,
            questionId,
            role,
            preference: answer.preference,
            title: detail.roles[role].title,
          });
        }
      }
    }
  }

  return candidates;
});

const selectedSpotlightQuestionIds = computed(
  () => props.secretFile.spotlight[selectedRole.value].selectedQuestionIds,
);

const candidateCategoryGroups = computed(() => {
  const selected = new Set(selectedSpotlightQuestionIds.value);
  const currentId = activeSpotlightIndex.value === null
    ? null
    : selectedSpotlightQuestionIds.value[activeSpotlightIndex.value] ?? null;
  const categories = new Map<string, { categoryId: string; categoryName: string; items: SpotlightCandidate[] }>();

  for (const candidate of spotlightCandidates.value) {
    if (selected.has(candidate.questionId) && candidate.questionId !== currentId) continue;
    const category = categories.get(candidate.categoryId) ?? {
      categoryId: candidate.categoryId,
      categoryName: candidate.categoryName,
      items: [],
    };
    category.items.push(candidate);
    categories.set(candidate.categoryId, category);
  }

  return [...categories.values()].map((category) => ({
    ...category,
    items: [...category.items].sort((left, right) => {
      const preferenceOrder = { love: 0, like: 1 } as const;
      return preferenceOrder[left.preference] - preferenceOrder[right.preference];
    }),
  }));
});

function getSpotlightCandidate(questionId: string): SpotlightCandidate | null {
  return spotlightCandidates.value.find((candidate) => candidate.questionId === questionId) ?? null;
}

const spotlightSlots = computed(() => {
  const slotCount = Math.min(selectedSpotlightQuestionIds.value.length + 1, 5);

  return Array.from({ length: slotCount }, (_, index) => ({
    candidate: getSpotlightCandidate(selectedSpotlightQuestionIds.value[index] ?? ''),
    index,
    slot: index + 1,
  }));
});

const activeSpotlightCandidate = computed<SpotlightCandidate | null>(() => {
  if (activeSpotlightIndex.value === null) return null;

  return getSpotlightCandidate(selectedSpotlightQuestionIds.value[activeSpotlightIndex.value] ?? '');
});

function openSpotlight(index: number): void {
  if (index > selectedSpotlightQuestionIds.value.length) return;
  activeSpotlightIndex.value = index;
  void nextTick(() => spotlightDialog.value?.showModal());
}

function selectSpotlight(questionId: string): void {
  if (activeSpotlightIndex.value === null) return;
  const next = [...selectedSpotlightQuestionIds.value];
  next[activeSpotlightIndex.value] = questionId;
  emit('updateSpotlight', selectedRole.value, next);
  spotlightDialog.value?.close();
}

function deleteSpotlight(): void {
  if (activeSpotlightIndex.value === null) return;
  const next = [...selectedSpotlightQuestionIds.value];
  next.splice(activeSpotlightIndex.value, 1);
  emit('updateSpotlight', selectedRole.value, next);
  spotlightDialog.value?.close();
}

function closeSpotlightDialog(): void {
  activeSpotlightIndex.value = null;
}
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
    percent: calculateProgressPercent(answered, total),
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

  return getResultsAnswerSummary(props.messages, answer);
}

function getCategoryNote(categoryId: string): string {
  return getCategoryAnswer(categoryId)?.note.trim() ?? '';
}

function openCategory(category: QuestionBankCategory): void {
  const progress = getCategoryProgress(category);

  if (!shouldOfferDetailStartChoice({
    answered: progress.answered,
    total: progress.total,
  })) {
    emit('editCategory', category.categoryId, selectedRole.value, 'all');
    return;
  }

  pendingCategory.value = category;
  void nextTick(() => detailStartDialog.value?.showModal());
}

function startDetailQuestions(mode: 'all' | 'unanswered'): void {
  const category = pendingCategory.value;
  detailStartDialog.value?.close();
  pendingCategory.value = null;

  if (category) {
    emit('editCategory', category.categoryId, selectedRole.value, mode);
  }
}

function closeDetailStartDialog(): void {
  pendingCategory.value = null;
  detailStartDialog.value?.close();
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
    return 'is-negative-extreme';
  }

  if (kind === 'preference' && value === 'love') {
    return 'is-positive-extreme';
  }

  if (kind === 'experience' && value === 'veryExtensive') {
    return 'is-positive-extreme';
  }

  if (kind === 'experience' && value === 'none') {
    return 'is-negative-extreme';
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
    percent: calculateProgressPercent(totals.answered, totals.total),
  };
});
</script>

<template>
  <section class="questionnaire-route questionnaire-results-route">
    <div class="questionnaire-page-shell questionnaire-results-shell">
      <header class="results-mobile-bar">
        <button class="results-mobile-home-link" type="button" @click="emit('home')">
          {{ backHome }}
        </button>
        <a class="results-mobile-preview" :href="previewHref" target="_blank" rel="noopener noreferrer">
          {{ messages.results.preview }}
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <aside class="results-sidebar">
        <div class="results-sidebar__intro">
          <p class="questionnaire-kicker">{{ messages.results.editing }}</p>
          <h1>{{ messages.results.title(secretFile.profileName) }}</h1>
          <p class="results-last-edited">{{ messages.results.lastEdited(secretFile.updatedAt) }}</p>
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
          <a class="results-secondary-action" :href="previewHref" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12s3.2-5.5 9-5.5S21 12 21 12s-3.2 5.5-9 5.5S3 12 3 12Z" />
              <circle cx="12" cy="12" r="2.2" />
            </svg>
            {{ messages.results.preview }}
            <span aria-hidden="true">↗</span>
          </a>
          <button class="results-home-action" type="button" @click="emit('home')">
            {{ backHome }}
          </button>
        </nav>
      </aside>

      <main class="results-content">
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

        <section
          v-if="spotlightCandidates.length > 0"
          class="results-spotlight results-spotlight--editor"
          :aria-label="messages.results.spotlightTitle"
        >
          <div class="results-spotlight__heading">
            <div>
              <h2>{{ messages.results.spotlightTitle }}</h2>
              <p>{{ messages.results.spotlightCount(selectedSpotlightQuestionIds.length, 5) }}</p>
            </div>
            <span class="results-spotlight__mark" aria-hidden="true">✦</span>
          </div>
          <div class="results-spotlight__slots" :class="`has-${spotlightSlots.length}-items`">
            <button
              v-for="item in spotlightSlots"
              :key="item.slot"
              type="button"
              :class="{ 'is-filled': item.candidate }"
              :disabled="item.index > selectedSpotlightQuestionIds.length"
              :aria-label="messages.results.spotlightSlotAria(item.slot, item.candidate?.title ?? null)"
              @click="openSpotlight(item.index)"
            >
              <img
                v-if="item.candidate"
                :src="getCategoryVisualUrl(item.candidate.categoryId)"
                alt=""
              />
              <span class="results-spotlight__slot-number">{{ item.slot }}</span>
              <span v-if="item.candidate" class="results-spotlight__slot-copy">
                <small>{{ item.candidate.categoryName }}</small>
                <strong>{{ item.candidate.title }}</strong>
              </span>
            </button>
          </div>
          <p>{{ messages.results.spotlightHelp }}</p>
        </section>

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

        <div class="result-category-grid">
          <button
            v-for="(category, index) in props.questionBank.categories"
            :key="`${category.categoryId}.${selectedRole}`"
            :id="`result-category-${category.categoryId}`"
            class="result-category-card"
            :class="{ 'is-other': !category.includeInCategoryRound }"
            type="button"
            :aria-label="messages.results.editCategoryAria(category.name)"
            @click="openCategory(category)"
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
              <span v-if="getCategoryNote(category.categoryId)" class="result-category-note">
                {{ getCategoryNote(category.categoryId) }}
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

    <dialog ref="detailStartDialog" class="detail-start-dialog" @close="pendingCategory = null">
      <h2>{{ messages.results.detailStartTitle }}</h2>
      <div class="detail-start-dialog__actions">
        <button type="button" @click="startDetailQuestions('unanswered')">
          {{ messages.results.detailStartUnanswered }}
        </button>
        <button type="button" @click="startDetailQuestions('all')">
          {{ messages.results.detailStartAll }}
        </button>
        <button class="detail-start-dialog__cancel" type="button" @click="closeDetailStartDialog">
          {{ messages.results.detailStartCancel }}
        </button>
      </div>
    </dialog>

    <dialog ref="spotlightDialog" class="spotlight-dialog" @close="closeSpotlightDialog">
      <div class="spotlight-dialog__heading">
        <h2>{{ messages.results.spotlightDialogTitle }}</h2>
        <button type="button" :aria-label="messages.results.detailStartCancel" @click="spotlightDialog?.close()">×</button>
      </div>
      <div v-if="activeSpotlightCandidate" class="spotlight-dialog__current">
        <div class="spotlight-dialog__item-copy">
          <small>{{ messages.results.spotlightCurrent }}</small>
          <strong>{{ activeSpotlightCandidate.title }}</strong>
          <small>{{ activeSpotlightCandidate.categoryName }}</small>
        </div>
        <button class="spotlight-dialog__delete" type="button" @click="deleteSpotlight">
          {{ messages.results.spotlightDelete }}
        </button>
      </div>
      <p class="spotlight-dialog__note">{{ messages.results.spotlightDialogNote }}</p>
      <p v-if="candidateCategoryGroups.length === 0" class="spotlight-dialog__empty">{{ messages.results.spotlightEmpty }}</p>
      <div v-else class="spotlight-dialog__groups">
        <section v-for="group in candidateCategoryGroups" :key="group.categoryId" class="spotlight-dialog__category-group">
          <div class="spotlight-dialog__category">
            <img :src="getCategoryVisualUrl(group.categoryId)" alt="" />
            <h3>{{ group.categoryName }}</h3>
          </div>
          <button
            v-for="candidate in group.items"
            :key="candidate.questionId"
            type="button"
            :class="{ 'is-selected': selectedSpotlightQuestionIds[activeSpotlightIndex ?? -1] === candidate.questionId }"
            :aria-label="`${messages.results.spotlightSelect}：${candidate.title}，${messages.preferenceLabels[candidate.preference]}`"
            @click="selectSpotlight(candidate.questionId)"
          >
            <span class="spotlight-dialog__item-copy">
              <strong>{{ candidate.title }}</strong>
              <small>{{ candidate.description }}</small>
            </span>
            <span class="spotlight-dialog__preference-icon" aria-hidden="true">
              <AnswerRatingIcon kind="preference" :value="candidate.preference" />
            </span>
          </button>
        </section>
      </div>
    </dialog>
  </section>
</template>
