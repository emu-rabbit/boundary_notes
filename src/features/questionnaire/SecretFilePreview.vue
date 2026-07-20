<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { AppLocale, LocaleOption } from '../../app/i18n';
import { useTransientActionFeedback } from '../../app/useTransientActionFeedback';
import ActionFeedbackIcon from '../../components/ActionFeedbackIcon.vue';
import {
  getCategoryQuestionId,
  getCategoryVisualUrl,
  getDetailQuestionId,
  type QuestionBank,
  type QuestionBankCategory,
} from '../question-bank';
import type {
  AnsweredSecretFileAnswer,
  QuestionRole,
  SecretFile,
} from '../secret-file/domain/types';
import { getShareMessages } from '../sharing/shareMessages';
import SponsorDialog from '../sponsor/SponsorDialog.vue';
import PreviewAnswerSummary from './PreviewAnswerSummary.vue';
import AnswerRatingIcon from './AnswerRatingIcon.vue';
import { getResultsAnswerSummary, type QuestionnaireMessages } from './messages';
import type { PreviewMessages } from './previewMessages';

interface DisplayItem {
  answer: AnsweredSecretFileAnswer | null;
  categoryId: string;
  categoryName: string;
  description: string;
  level: 'category' | 'detail';
  questionId: string;
  role: QuestionRole;
  title: string;
  warning: string | null;
}

const props = defineProps<{
  locale: AppLocale;
  localeOptions: readonly LocaleOption[];
  messages: PreviewMessages;
  questionBank: QuestionBank;
  questionnaireMessages: QuestionnaireMessages;
  secretFile: SecretFile;
  shareLinkState: 'available' | 'checking' | 'missing';
  shareUrl: string | null;
  source: 'cloud' | 'local';
}>();

const emit = defineEmits<{
  createMyFile: [];
  localeChange: [locale: AppLocale];
}>();

const selectedRole = ref<QuestionRole>(
  props.secretFile.scope === 'passiveOnly' ? 'passive' : 'active',
);
const activeCategoryId = ref<string | null>(null);
const overviewScrollPosition = ref(0);
const hardNoDialog = ref<HTMLDialogElement | null>(null);
const loveDialog = ref<HTMLDialogElement | null>(null);
const shareDialog = ref<HTMLDialogElement | null>(null);
const sponsorDialog = ref<InstanceType<typeof SponsorDialog> | null>(null);
const generatingRole = ref<QuestionRole | null>(null);
const {
  clear: clearShareActionFeedback,
  feedback: shareActionFeedback,
  show: showShareActionFeedback,
} = useTransientActionFeedback(3000);
const shareMessages = computed(() => getShareMessages(props.locale));
let shareImageModulePromise: ReturnType<typeof loadShareImageModule> | null = null;

function loadShareImageModule() {
  return import('../sharing/shareImageGenerator');
}

const availableRoles = computed<readonly QuestionRole[]>(() => {
  if (props.secretFile.scope === 'all') return ['active', 'passive'];
  return [props.secretFile.scope === 'activeOnly' ? 'active' : 'passive'];
});

const activeCategory = computed(() =>
  props.questionBank.categories.find((category) => category.categoryId === activeCategoryId.value) ?? null,
);

function getCategoryAnswer(categoryId: string, role = selectedRole.value): AnsweredSecretFileAnswer | null {
  const answer = props.secretFile.answers[getCategoryQuestionId(categoryId, role)];
  return answer?.state === 'answered' ? answer : null;
}

function hasLoveCategoryAnswer(categoryId: string): boolean {
  return getCategoryAnswer(categoryId)?.preference === 'love';
}

function getDetailAnswer(
  categoryId: string,
  detailId: string,
  role = selectedRole.value,
): AnsweredSecretFileAnswer | null {
  const answer = props.secretFile.answers[getDetailQuestionId(categoryId, detailId, role)];
  return answer?.state === 'answered' ? answer : null;
}

function createCategoryItem(category: QuestionBankCategory, role: QuestionRole): DisplayItem | null {
  if (!category.includeInCategoryRound) return null;

  return {
    answer: getCategoryAnswer(category.categoryId, role),
    categoryId: category.categoryId,
    categoryName: category.name,
    description: category.roles[role].description,
    level: 'category',
    questionId: getCategoryQuestionId(category.categoryId, role),
    role,
    title: category.name,
    warning: null,
  };
}

function createDetailItem(
  category: QuestionBankCategory,
  detail: QuestionBankCategory['detailItems'][number],
  role: QuestionRole,
): DisplayItem {
  return {
    answer: getDetailAnswer(category.categoryId, detail.detailId, role),
    categoryId: category.categoryId,
    categoryName: category.name,
    description: detail.roles[role].description,
    level: 'detail',
    questionId: getDetailQuestionId(category.categoryId, detail.detailId, role),
    role,
    title: detail.roles[role].title,
    warning: detail.warning,
  };
}

function findDisplayItem(questionId: string): DisplayItem | null {
  for (const category of props.questionBank.categories) {
    for (const role of availableRoles.value) {
      const categoryItem = createCategoryItem(category, role);
      if (categoryItem?.questionId === questionId) return categoryItem;

      for (const detail of category.detailItems) {
        const detailItem = createDetailItem(category, detail, role);
        if (detailItem.questionId === questionId) return detailItem;
      }
    }
  }

  return null;
}

const spotlightItems = computed(() =>
  props.secretFile.spotlight[selectedRole.value].selectedQuestionIds
    .map(findDisplayItem)
    .filter((item): item is DisplayItem => item !== null && item.answer !== null),
);

const hardNoItems = computed(() => {
  const items: DisplayItem[] = [];
  const role = selectedRole.value;

  for (const category of props.questionBank.categories) {
    const categoryItem = createCategoryItem(category, role);
    if (categoryItem?.answer?.preference === 'hardNo') items.push(categoryItem);

    for (const detail of category.detailItems) {
      const detailItem = createDetailItem(category, detail, role);
      if (detailItem.answer?.preference === 'hardNo') items.push(detailItem);
    }
  }

  return items;
});

const loveItems = computed(() => {
  const items: DisplayItem[] = [];
  const role = selectedRole.value;

  for (const category of props.questionBank.categories) {
    const categoryItem = createCategoryItem(category, role);
    if (categoryItem?.answer?.preference === 'love') items.push(categoryItem);

    for (const detail of category.detailItems) {
      const detailItem = createDetailItem(category, detail, role);
      if (detailItem.answer?.preference === 'love') items.push(detailItem);
    }
  }

  return items;
});

const activeDetailItems = computed(() => {
  const category = activeCategory.value;
  if (!category) return [];

  return category.detailItems
    .map((detail) => createDetailItem(category, detail, selectedRole.value))
    .filter((item) => props.secretFile.answers[item.questionId]?.state !== 'filteredOut');
});

function openCategory(categoryId: string): void {
  overviewScrollPosition.value = window.scrollY;
  activeCategoryId.value = categoryId;
  void nextTick(() => window.scrollTo({ left: 0, top: 0 }));
}

function closeCategory(): void {
  activeCategoryId.value = null;
  void nextTick(() => window.scrollTo({ left: 0, top: overviewScrollPosition.value }));
}

function openHardNoDialog(): void {
  hardNoDialog.value?.showModal();
}

function openLoveDialog(): void {
  loveDialog.value?.showModal();
}

function openShareDialog(): void {
  clearShareActionFeedback();
  shareDialog.value?.showModal();
  shareImageModulePromise ??= loadShareImageModule();
  void shareImageModulePromise
    .then((module) => module.prewarmShareImageGenerator(props.questionBank))
    .catch(() => undefined);
}

function createShareImageFileName(role: QuestionRole): string {
  const safeName = props.secretFile.profileName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/gu, '-')
    .replace(/[. ]+$/u, '')
    .slice(0, 48) || 'boundary-notes';
  const date = props.secretFile.updatedAt.slice(0, 10);
  const localizedRole = props.questionnaireMessages.roleLabels[role];
  return `${safeName}-${localizedRole}-${date}.png`;
}

async function downloadShareImage(role: QuestionRole): Promise<void> {
  if (generatingRole.value) return;
  generatingRole.value = role;
  clearShareActionFeedback();

  try {
    shareImageModulePromise ??= loadShareImageModule();
    const module = await shareImageModulePromise;
    const blob = await module.generateShareImage({
      locale: props.locale,
      questionBank: props.questionBank,
      questionnaireMessages: props.questionnaireMessages,
      role,
      secretFile: props.secretFile,
      shareUrl: props.shareUrl,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = createShareImageFileName(role);
    link.href = url;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showShareActionFeedback(`image:${role}`, 'success', shareMessages.value.downloaded);
  } catch {
    showShareActionFeedback(`image:${role}`, 'error', shareMessages.value.downloadFailed);
  } finally {
    generatingRole.value = null;
  }
}

async function copyShareLink(): Promise<void> {
  if (!props.shareUrl) return;
  clearShareActionFeedback();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.shareUrl);
    } else {
      const input = document.createElement('textarea');
      input.value = props.shareUrl;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.append(input);
      input.select();
      if (!document.execCommand('copy')) throw new Error('Copy was rejected.');
      input.remove();
    }
    showShareActionFeedback('copy-link', 'success', shareMessages.value.copied);
  } catch {
    showShareActionFeedback('copy-link', 'error', shareMessages.value.copyFailed);
  }
}

function getAnswerSummary(answer: AnsweredSecretFileAnswer): string {
  return getResultsAnswerSummary(props.questionnaireMessages, answer);
}

function changeLocale(event: Event): void {
  emit('localeChange', (event.target as HTMLSelectElement).value as AppLocale);
}
</script>

<template>
  <section
    class="questionnaire-route questionnaire-results-route secret-file-preview-route"
    :class="{ 'has-mobile-cta': source === 'cloud' && !activeCategory }"
  >
    <div
      class="questionnaire-page-shell questionnaire-results-shell secret-file-preview-shell"
      :class="{ 'is-detail-view': activeCategory }"
    >
      <div v-if="!activeCategory" class="preview-overview-tools preview-overview-tools--mobile">
        <label class="preview-locale-switch is-utility">
          <span>{{ messages.languageLabel }}</span>
          <select :value="locale" @change="changeLocale">
            <option v-for="option in localeOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </label>
        <button
          class="preview-share-action"
          type="button"
          :aria-label="messages.shareFile"
          :title="messages.shareFile"
          @click="openShareDialog"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
          </svg>
        </button>
      </div>

      <aside v-if="!activeCategory" class="results-sidebar preview-sidebar">
        <div class="results-sidebar__intro preview-sidebar__identity">
          <p class="questionnaire-kicker">{{ messages.previewKicker }}</p>
          <h1>{{ messages.title(secretFile.profileName) }}</h1>
          <p class="results-last-edited">{{ messages.lastEdited(secretFile.updatedAt) }}</p>
        </div>

        <p class="preview-consent-warning">
          <span aria-hidden="true">i</span>
          {{ messages.warning(secretFile.profileName) }}
        </p>

        <div
          v-if="availableRoles.length > 1"
          class="result-role-switch preview-role-switch"
          role="group"
          :aria-label="messages.roleSwitchLabel"
        >
          <button
            v-for="role in availableRoles"
            :key="role"
            type="button"
            :class="{ 'is-selected': selectedRole === role }"
            :aria-pressed="selectedRole === role"
            @click="selectedRole = role"
          >
            {{ questionnaireMessages.roleLabels[role] }}
          </button>
        </div>

        <nav class="results-sidebar__actions preview-sidebar__actions" :aria-label="messages.previewActionsLabel">
          <button
            v-if="source === 'cloud'"
            class="results-primary-action preview-create-action"
            type="button"
            @click="emit('createMyFile')"
          >
            <span aria-hidden="true">＋</span>
            {{ messages.createMyFile }}
          </button>
          <button class="preview-sponsor-action" type="button" @click="sponsorDialog?.open()">
            {{ messages.sponsorWebsite }}
          </button>
        </nav>
      </aside>

      <main v-if="!activeCategory" class="results-content preview-content">
        <div class="preview-overview-tools preview-overview-tools--desktop">
          <label class="preview-locale-switch is-utility">
            <span>{{ messages.languageLabel }}</span>
            <select :value="locale" @change="changeLocale">
              <option v-for="option in localeOptions" :key="option.id" :value="option.id">
                {{ option.label }}
              </option>
            </select>
          </label>
          <button
            class="preview-share-action"
            type="button"
            :aria-label="messages.shareFile"
            :title="messages.shareFile"
            @click="openShareDialog"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="18" cy="5" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
            </svg>
          </button>
        </div>

        <div
          v-if="availableRoles.length > 1"
          class="result-role-switch preview-role-switch preview-role-switch--content"
          role="group"
          :aria-label="messages.roleSwitchLabel"
        >
          <button
            v-for="role in availableRoles"
            :key="role"
            type="button"
            :class="{ 'is-selected': selectedRole === role }"
            :aria-pressed="selectedRole === role"
            @click="selectedRole = role"
          >
            {{ questionnaireMessages.roleLabels[role] }}
          </button>
        </div>

        <section
          v-if="spotlightItems.length"
          class="preview-ranking"
          :class="{ 'is-selectable': loveItems.length }"
          :role="loveItems.length ? 'button' : undefined"
          :tabindex="loveItems.length ? 0 : undefined"
          :aria-label="loveItems.length ? messages.loveButton(loveItems.length) : undefined"
          @click="loveItems.length && openLoveDialog()"
          @keydown.enter="loveItems.length && openLoveDialog()"
          @keydown.space.prevent="loveItems.length && openLoveDialog()"
        >
          <header class="preview-ranking__heading">
            <div>
              <p>{{ messages.spotlightKicker }}</p>
              <h2>{{ messages.spotlightTitle(secretFile.profileName) }}</h2>
            </div>
            <span aria-hidden="true">✦</span>
          </header>

          <div class="preview-ranking__stage" :class="`has-${spotlightItems.length}-items`">
            <article
              v-for="(item, index) in spotlightItems"
              :key="item.questionId"
              class="preview-rank-card"
              :class="`is-rank-${index + 1}`"
            >
              <div class="preview-rank-card__visual">
                <img :src="getCategoryVisualUrl(item.categoryId)" alt="" width="320" height="320" />
                <span>{{ index + 1 }}</span>
              </div>
              <div class="preview-rank-card__copy">
                <small>{{ item.categoryName }}</small>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <PreviewAnswerSummary
                  :answer="item.answer!"
                  :summary="getAnswerSummary(item.answer!)"
                />
              </div>
            </article>
          </div>

          <div v-if="loveItems.length" class="preview-ranking__footer">
            <span>{{ messages.loveButton(loveItems.length) }}&nbsp;<span aria-hidden="true">→</span></span>
          </div>
        </section>

        <section class="preview-categories">
          <div class="results-content__heading preview-categories__heading">
            <div>
              <p>{{ messages.categorySectionKicker }}</p>
              <h2>{{ messages.categorySectionTitle }}</h2>
            </div>
            <button
              v-if="hardNoItems.length"
              class="preview-hard-no-action"
              type="button"
              @click="openHardNoDialog"
            >
              <span aria-hidden="true">⊘</span>
              {{ messages.hardNoButton(hardNoItems.length) }}
            </button>
          </div>

          <div class="result-category-grid preview-category-grid">
            <button
              v-for="category in questionBank.categories"
              :key="`${category.categoryId}.${selectedRole}`"
              class="result-category-card preview-category-card"
              :class="{
                'is-love': category.includeInCategoryRound && hasLoveCategoryAnswer(category.categoryId),
                'is-other': !category.includeInCategoryRound,
              }"
              type="button"
              :aria-label="messages.viewCategory(category.name)"
              @click="openCategory(category.categoryId)"
            >
              <img
                :src="getCategoryVisualUrl(category.categoryId)"
                :alt="questionnaireMessages.categoryVisualAlt(category.name)"
                width="320"
                height="320"
                loading="lazy"
                decoding="async"
              />
              <span class="result-category-card__body preview-category-card__copy">
                <span class="preview-category-card__heading">
                  <strong>{{ category.name }}</strong>
                  <small>{{ questionnaireMessages.roleLabels[selectedRole] }}</small>
                </span>
                <span class="preview-category-card__result">
                  <span v-if="!category.includeInCategoryRound" class="preview-other-summary">
                    {{ messages.otherSummary }}
                  </span>
                  <PreviewAnswerSummary
                    v-else-if="getCategoryAnswer(category.categoryId)"
                    :answer="getCategoryAnswer(category.categoryId)!"
                    :summary="getAnswerSummary(getCategoryAnswer(category.categoryId)!)"
                  />
                  <span v-else class="preview-unanswered">{{ messages.categoryUnanswered }}</span>
                  <span v-if="getCategoryAnswer(category.categoryId)?.note.trim()" class="preview-inline-note">
                    {{ getCategoryAnswer(category.categoryId)!.note }}
                  </span>
                </span>
                <span class="preview-category-card__action">
                  {{ messages.viewDetails }}
                  <span aria-hidden="true">→</span>
                </span>
              </span>
            </button>
          </div>
        </section>
      </main>

      <main v-else class="results-content preview-category-detail">
        <div class="preview-detail-layout">
          <aside class="preview-detail-summary">
            <img
              :src="getCategoryVisualUrl(activeCategory.categoryId)"
              :alt="questionnaireMessages.categoryVisualAlt(activeCategory.name)"
              width="480"
              height="480"
            />
            <div class="preview-detail-summary__copy">
              <p v-if="activeCategory.includeInCategoryRound">
                {{ questionnaireMessages.roleLabels[selectedRole] }}・{{ messages.categoryAnswer }}
              </p>
              <h1>{{ activeCategory.name }}</h1>
              <p>{{ activeCategory.roles[selectedRole].description }}</p>

              <PreviewAnswerSummary
                v-if="activeCategory.includeInCategoryRound && getCategoryAnswer(activeCategory.categoryId)"
                :answer="getCategoryAnswer(activeCategory.categoryId)!"
                :summary="getAnswerSummary(getCategoryAnswer(activeCategory.categoryId)!)"
              />
              <span v-else-if="activeCategory.includeInCategoryRound" class="preview-unanswered">
                {{ messages.categoryUnanswered }}
              </span>

              <div
                v-if="activeCategory.includeInCategoryRound && getCategoryAnswer(activeCategory.categoryId)?.note.trim()"
                class="preview-detail-note"
              >
                <small>{{ messages.note }}</small>
                <p>{{ getCategoryAnswer(activeCategory.categoryId)!.note }}</p>
              </div>
            </div>
          </aside>

          <div class="preview-detail-main">
            <header class="preview-detail-header">
              <button type="button" class="preview-detail-back" @click="closeCategory">
                <span aria-hidden="true">←</span>
                {{ messages.allCategories }}
              </button>
            </header>

            <section class="preview-detail-results">
            <ol class="preview-detail-list">
              <li
                v-for="(item, index) in activeDetailItems"
                :key="item.questionId"
                :class="{ 'is-unanswered': !item.answer }"
              >
                <div class="preview-detail-list__heading">
                  <span>{{ String(index + 1).padStart(2, '0') }}</span>
                  <div>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </div>

                <div v-if="item.answer" class="preview-detail-answer-grid">
                  <div :class="`is-${item.answer.experience}`">
                    <small>{{ messages.experience }}</small>
                    <span>
                      <AnswerRatingIcon
                        :kind="item.answer.experience === 'seeDetails' ? 'special' : 'experience'"
                        :value="item.answer.experience"
                      />
                      {{ questionnaireMessages.experienceLabels[item.answer.experience] }}
                    </span>
                  </div>
                  <div :class="`is-${item.answer.preference}`">
                    <small>{{ messages.preference }}</small>
                    <span>
                      <AnswerRatingIcon
                        :kind="item.answer.preference === 'seeDetails' ? 'special' : 'preference'"
                        :value="item.answer.preference"
                      />
                      {{ questionnaireMessages.preferenceLabels[item.answer.preference] }}
                    </span>
                  </div>
                </div>
                <span v-else class="preview-unanswered">{{ messages.unanswered }}</span>

                <div v-if="item.answer?.note.trim()" class="preview-detail-note">
                  <small>{{ messages.note }}</small>
                  <p>{{ item.answer.note }}</p>
                </div>
                <p v-if="item.warning" class="preview-risk-warning">
                  <span aria-hidden="true">!</span>
                  {{ item.warning }}
                </p>
              </li>
            </ol>
            </section>
          </div>
        </div>
      </main>

      <div v-if="source === 'cloud' && !activeCategory" class="results-mobile-actions preview-mobile-actions">
        <button class="results-primary-action" type="button" @click="emit('createMyFile')">
          <span aria-hidden="true">＋</span>
          {{ messages.createMyFile }}
        </button>
      </div>
    </div>

    <dialog v-if="hardNoItems.length" ref="hardNoDialog" class="preview-hard-no-dialog">
      <div class="preview-hard-no-dialog__heading">
        <div>
          <p>{{ messages.previewKicker }}</p>
          <h2>{{ messages.hardNoDialogTitle }}</h2>
        </div>
        <button type="button" :aria-label="questionnaireMessages.closeDetails" @click="hardNoDialog?.close()">×</button>
      </div>
      <p class="preview-hard-no-dialog__description">{{ messages.hardNoDialogDescription }}</p>
      <ul class="preview-hard-no-list">
        <li v-for="item in hardNoItems" :key="item.questionId">
          <img :src="getCategoryVisualUrl(item.categoryId)" alt="" width="72" height="72" />
          <div>
            <small>{{ item.categoryName }}</small>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
            <p v-if="item.answer?.note.trim()" class="preview-hard-no-list__note">{{ item.answer.note }}</p>
          </div>
        </li>
      </ul>
    </dialog>

    <dialog v-if="loveItems.length" ref="loveDialog" class="preview-hard-no-dialog preview-love-dialog">
      <div class="preview-hard-no-dialog__heading">
        <div>
          <p>{{ messages.spotlightKicker }}</p>
          <h2>{{ messages.loveDialogTitle }}</h2>
        </div>
        <button type="button" :aria-label="questionnaireMessages.closeDetails" @click="loveDialog?.close()">×</button>
      </div>
      <p class="preview-hard-no-dialog__description">{{ messages.loveDialogDescription }}</p>
      <ul class="preview-hard-no-list">
        <li v-for="item in loveItems" :key="item.questionId">
          <img :src="getCategoryVisualUrl(item.categoryId)" alt="" width="72" height="72" />
          <div>
            <small>{{ item.categoryName }}</small>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
            <p v-if="item.answer?.note.trim()" class="preview-hard-no-list__note">{{ item.answer.note }}</p>
          </div>
        </li>
      </ul>
    </dialog>

    <dialog ref="shareDialog" class="preview-share-dialog">
      <div class="preview-share-dialog__heading">
        <h2>{{ shareMessages.title }}</h2>
        <button type="button" :aria-label="shareMessages.close" @click="shareDialog?.close()">×</button>
      </div>

      <div class="preview-share-dialog__content">
        <section class="preview-share-option">
          <div>
            <h3>{{ shareMessages.imageTitle }}</h3>
            <p>{{ shareMessages.imageDescription }}</p>
          </div>
          <div class="preview-share-option__actions">
            <button
              v-for="role in availableRoles"
              :key="role"
              class="preview-share-primary"
              :class="shareActionFeedback?.id === `image:${role}`
                ? `is-${shareActionFeedback.kind}`
                : undefined"
              type="button"
              :disabled="generatingRole !== null"
              :aria-label="shareActionFeedback?.id === `image:${role}`
                ? shareActionFeedback.message
                : generatingRole === role
                  ? shareMessages.generating
                  : shareMessages.downloadImage(role)"
              :title="shareActionFeedback?.id === `image:${role}`
                ? shareActionFeedback.message
                : undefined"
              @click="downloadShareImage(role)"
            >
              <ActionFeedbackIcon
                v-if="shareActionFeedback?.id === `image:${role}`"
                :kind="shareActionFeedback.kind"
              />
              <span class="action-feedback-label">
                {{ shareActionFeedback?.id === `image:${role}`
                  ? shareActionFeedback.message
                  : generatingRole === role
                    ? shareMessages.generating
                    : shareMessages.downloadImage(role) }}
              </span>
              <span
                v-if="shareActionFeedback?.id === `image:${role}`"
                class="sr-only"
                role="status"
                aria-live="polite"
              >{{ shareActionFeedback.message }}</span>
            </button>
          </div>
        </section>

        <section class="preview-share-option">
          <div>
            <h3>{{ shareMessages.linkTitle }}</h3>
            <p v-if="shareLinkState === 'checking'">{{ shareMessages.preparingLink }}</p>
            <p v-else-if="shareUrl">
              {{ source === 'cloud'
                ? shareMessages.linkCloudDescription
                : shareMessages.linkLocalMatchedDescription }}
            </p>
            <p v-else>{{ shareMessages.linkLocalMissingDescription }}</p>
          </div>
          <button
            class="preview-share-secondary"
            :class="shareActionFeedback?.id === 'copy-link'
              ? `is-${shareActionFeedback.kind}`
              : undefined"
            type="button"
            :disabled="!shareUrl || shareLinkState === 'checking'"
            :aria-label="shareActionFeedback?.id === 'copy-link'
              ? shareActionFeedback.message
              : shareMessages.copyLink"
            :title="shareActionFeedback?.id === 'copy-link'
              ? shareActionFeedback.message
              : undefined"
            @click="copyShareLink"
          >
            <ActionFeedbackIcon
              v-if="shareActionFeedback?.id === 'copy-link'"
              :kind="shareActionFeedback.kind"
            />
            <span class="action-feedback-label">
              {{ shareActionFeedback?.id === 'copy-link'
                ? shareActionFeedback.message
                : shareMessages.copyLink }}
            </span>
            <span
              v-if="shareActionFeedback?.id === 'copy-link'"
              class="sr-only"
              role="status"
              aria-live="polite"
            >{{ shareActionFeedback.message }}</span>
          </button>
        </section>
      </div>
    </dialog>

    <SponsorDialog ref="sponsorDialog" :locale="locale" />
  </section>
</template>
