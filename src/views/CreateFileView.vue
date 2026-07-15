<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import {
  trackCloudShareCreated,
  trackDetailSessionCompleted,
  trackDetailSessionStarted,
  trackQuestionnaireOverviewCompleted,
  trackSecretFileAnswerSaved,
  trackSecretFileCreated,
  trackSecretFileEditOpened,
  trackSpotlightUpdated,
} from '../features/analytics/analytics';
import {
  CloudSharingError,
  createCloudSecretFile,
  linkCloudShare,
} from '../features/cloud-sharing';
import {
  allQuestionDefinitions,
  getDetailQuestionsForCategory,
  getLocalizedCategoryQuestionsForScope,
  localizeQuestionBank,
  questionBank,
  warmCategoryVisual,
  type CategoryQuestion,
  type DetailQuestion,
} from '../features/question-bank';
import CategoryQuestionStep from '../features/questionnaire/CategoryQuestionStep.vue';
import { getQuestionnaireMessages } from '../features/questionnaire/messages';
import QuestionnaireIntro from '../features/questionnaire/QuestionnaireIntro.vue';
import QuestionnaireResults from '../features/questionnaire/QuestionnaireResults.vue';
import {
  answerSecretFileQuestion,
  createSecretFile,
  LocalSecretFileLimitError,
  maxLocalSecretFiles,
  reconcileSecretFileQuestions,
  type AnswerQuestionInput,
  type QuestionRole,
  type SecretFileScope,
} from '../features/secret-file';
import { useSecretFileStore } from '../features/secret-file/application/useSecretFileStore';
import { warmRabbitAssets } from '../features/story/rabbitAssets';

const route = useRoute();
const router = useRouter();
const store = useSecretFileStore();
const {
  appTitle,
  autoAdvanceDelay,
  locale,
  messages: appMessages,
  profileName,
  recordAutoAdvance,
  resetAutoAdvance,
} = useAppShell();

const creationError = ref('');
const cloudUploadDialog = ref<HTMLDialogElement | null>(null);
const cloudUploadState = ref<'confirm' | 'error' | 'success' | 'uploading'>('confirm');
const cloudUploadError = ref('');
const cloudUploadHref = ref('');
const cloudUploadLocalSaveFailed = ref(false);
const cloudUploadPopupBlocked = ref(false);
const questionCursor = ref<number | null>(null);
const detailCursor = ref<number | null>(null);
const detailSession = ref<{
  categoryId: string;
  mode: 'all' | 'unanswered';
  questionIds: readonly string[];
  role: QuestionRole;
} | null>(null);
const questionTransition = ref<'question-slide-next' | 'question-slide-back'>('question-slide-next');
const messages = computed(() => getQuestionnaireMessages(locale.value));
const localizedQuestionBank = computed(() => localizeQuestionBank(questionBank, locale.value));
const secretFile = computed(() => store.activeSecretFile);
const categoryQuestions = computed(() =>
  secretFile.value
    ? getLocalizedCategoryQuestionsForScope(questionBank, locale.value, secretFile.value.scope)
    : [],
);
const firstUnansweredQuestionIndex = computed(() =>
  secretFile.value
    ? categoryQuestions.value.findIndex(
        (question) => secretFile.value?.answers[question.id]?.state === 'unanswered',
      )
    : -1,
);
const currentQuestionIndex = computed(() => {
  if (!secretFile.value) {
    return -1;
  }

  const requestedIndex = questionCursor.value;

  if (requestedIndex !== null && requestedIndex >= 0 && requestedIndex < categoryQuestions.value.length) {
    return requestedIndex;
  }

  return firstUnansweredQuestionIndex.value;
});
function getDetailSessionQuestions(
  categoryId: string,
  role: QuestionRole,
  mode: 'all' | 'unanswered',
): readonly (CategoryQuestion | DetailQuestion)[] {
  if (!secretFile.value) {
    return [];
  }

  const category = localizedQuestionBank.value.categories.find(
    (entry) => entry.categoryId === categoryId,
  );

  if (!category) {
    return [];
  }

  const questions = getDetailQuestionsForCategory(category, role);
  if (mode === 'unanswered') {
    return questions.filter((question) => secretFile.value?.answers[question.id]?.state === 'unanswered');
  }

  const categoryQuestion = categoryQuestions.value.find(
    (question) =>
      question.category.categoryId === categoryId && question.role === role,
  );

  return categoryQuestion ? [categoryQuestion, ...questions] : questions;
}

const detailQuestions = computed(() => {
  if (!detailSession.value) {
    return [];
  }

  const questionIds = new Set(detailSession.value.questionIds);
  return getDetailSessionQuestions(
    detailSession.value.categoryId,
    detailSession.value.role,
    'all',
  ).filter((question) => questionIds.has(question.id));
});
const currentDetailQuestionIndex = computed(() => {
  if (!detailSession.value || detailQuestions.value.length === 0) {
    return -1;
  }

  return detailCursor.value !== null && detailCursor.value >= 0 && detailCursor.value < detailQuestions.value.length
    ? detailCursor.value
    : 0;
});
const currentQuestion = computed(() =>
  detailSession.value
    ? currentDetailQuestionIndex.value >= 0
      ? detailQuestions.value[currentDetailQuestionIndex.value] ?? null
      : null
    : currentQuestionIndex.value >= 0
      ? categoryQuestions.value[currentQuestionIndex.value] ?? null
      : null,
);
const currentAnswer = computed(() =>
  secretFile.value && currentQuestion.value
    ? secretFile.value.answers[currentQuestion.value.id]
    : null,
);
const isResultViewRequested = computed(() => route.query.view === 'results');
const shouldShowResults = computed(
  () => secretFile.value !== null && !detailSession.value && (isResultViewRequested.value || currentQuestion.value === null),
);
const currentPosition = computed(() =>
  detailSession.value ? currentDetailQuestionIndex.value + 1 : currentQuestionIndex.value + 1,
);
const currentTotal = computed(() =>
  detailSession.value ? detailQuestions.value.length : categoryQuestions.value.length,
);
const completedQuestionCount = computed(() => {
  const questions = detailSession.value ? detailQuestions.value : categoryQuestions.value;
  return secretFile.value
    ? questions.filter((question) => secretFile.value?.answers[question.id]?.state === 'answered').length
    : 0;
});
const canGoBack = computed(() =>
  detailSession.value ? currentDetailQuestionIndex.value > 0 : currentQuestionIndex.value > 0,
);
const storageWarning = computed(() => store.storageStatus.mode === 'memory');
const previewHref = computed(() =>
  secretFile.value
    ? router.resolve({
        name: 'preview',
        query: { file: secretFile.value.fileId, source: 'local' },
      }).href
    : '#',
);

function createLocalFileId(): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

  return `local_${randomPart}`;
}

async function startQuestionnaire(scope: SecretFileScope): Promise<void> {
  creationError.value = '';

  if (store.files.length >= maxLocalSecretFiles) {
    creationError.value = messages.value.fileLimitReached(maxLocalSecretFiles);
    return;
  }

  try {
    const created = createSecretFile({
      bankSchemaVersion: questionBank.schemaVersion,
      bankVersion: questionBank.bankVersion,
      fileId: createLocalFileId(),
      profileName: profileName.value.trim() || appMessages.value.title.defaultProfileName,
      questions: allQuestionDefinitions,
      scope,
    });
    const saved = store.persist(created);

    await router.replace({
      name: 'create',
      query: { file: saved.fileId },
    });
    trackSecretFileCreated(saved.scope);
  } catch (error) {
    creationError.value =
      error instanceof LocalSecretFileLimitError
        ? messages.value.fileLimitReached(maxLocalSecretFiles)
        : messages.value.fileCreateFailed;
  }
}

function saveQuestionAnswer(answer: AnswerQuestionInput): void {
  if (!secretFile.value || !currentQuestion.value) {
    return;
  }

  if (!detailSession.value) {
    questionCursor.value = currentQuestionIndex.value;
  }

  const overviewWasComplete = !detailSession.value && categoryQuestions.value.every(
    (question) => secretFile.value?.answers[question.id]?.state === 'answered',
  );
  const saved = store.persist(
    answerSecretFileQuestion(secretFile.value, currentQuestion.value, answer),
  );
  trackSecretFileAnswerSaved(currentQuestion.value.level, currentQuestion.value.role);

  if (
    !detailSession.value &&
    !overviewWasComplete &&
    categoryQuestions.value.every((question) => saved.answers[question.id]?.state === 'answered')
  ) {
    trackQuestionnaireOverviewCompleted(saved.scope);
  }
}

function updateSpotlight(role: QuestionRole, questionIds: string[]): void {
  if (!secretFile.value) return;

  store.persist({
    ...secretFile.value,
    spotlight: {
      ...secretFile.value.spotlight,
      [role]: { selectedQuestionIds: questionIds },
    },
    updatedAt: new Date().toISOString(),
  });
  trackSpotlightUpdated(role, questionIds.length);
}

function advanceQuestion(): void {
  if (!currentQuestion.value) {
    return;
  }

  recordAutoAdvance();
  questionTransition.value = 'question-slide-next';
  if (detailSession.value) {
    if (currentDetailQuestionIndex.value + 1 >= detailQuestions.value.length) {
      finishDetailSession();
      return;
    }

    detailCursor.value = currentDetailQuestionIndex.value + 1;
  } else {
    questionCursor.value = currentQuestionIndex.value + 1;
  }
  void nextTick(() => {
    window.scrollTo({ left: 0, top: 0 });
  });
}

function goToPreviousQuestion(): void {
  if (!canGoBack.value) {
    return;
  }

  resetAutoAdvance();
  questionTransition.value = 'question-slide-back';
  if (detailSession.value) {
    detailCursor.value = currentDetailQuestionIndex.value - 1;
  } else {
    questionCursor.value = currentQuestionIndex.value - 1;
  }
  void nextTick(() => {
    window.scrollTo({ left: 0, top: 0 });
  });
}

function startDetailSession(
  categoryId: string,
  role: QuestionRole,
  mode: 'all' | 'unanswered',
): void {
  const questions = getDetailSessionQuestions(categoryId, role, mode);

  if (questions.length === 0) {
    return;
  }

  detailSession.value = {
    categoryId,
    mode,
    questionIds: questions.map((question) => question.id),
    role,
  };
  detailCursor.value = 0;
  trackDetailSessionStarted(role, mode, questions.length);

  void nextTick(() => window.scrollTo({ left: 0, top: 0 }));
}

function finishDetailSession(): void {
  const completedSession = detailSession.value;
  const completedQuestionCount = detailQuestions.value.length;
  detailSession.value = null;
  detailCursor.value = null;

  if (completedSession) {
    trackDetailSessionCompleted(
      completedSession.role,
      completedSession.mode,
      completedQuestionCount,
    );
  }

  if (secretFile.value) {
    void router.replace({ name: 'create', query: { file: secretFile.value.fileId, view: 'results' } });
  }
}

function goToFileStatus(): void {
  detailSession.value = null;
  detailCursor.value = null;

  if (secretFile.value) {
    void router.replace({ name: 'create', query: { file: secretFile.value.fileId, view: 'results' } });
  }
}

async function goHome(): Promise<void> {
  await router.push({ name: 'home' });
  store.close();
}

function openCloudUploadDialog(): void {
  cloudUploadState.value = 'confirm';
  cloudUploadError.value = '';
  cloudUploadHref.value = '';
  cloudUploadLocalSaveFailed.value = false;
  cloudUploadPopupBlocked.value = false;
  void nextTick(() => cloudUploadDialog.value?.showModal());
}

function closeCloudUploadDialog(): void {
  if (cloudUploadState.value === 'uploading') return;
  cloudUploadDialog.value?.close();
}

function handleCloudUploadCancel(event: Event): void {
  if (cloudUploadState.value === 'uploading') {
    event.preventDefault();
  }
}

function getCloudUploadErrorMessage(error: unknown): string {
  if (!(error instanceof CloudSharingError)) {
    return messages.value.results.uploadFailed;
  }

  if (error.code === 'configuration') {
    return messages.value.results.uploadConfigurationError;
  }

  if (error.code === 'rateLimited') {
    return messages.value.results.uploadRateLimited;
  }

  if (error.code === 'siteBusy') {
    return messages.value.results.uploadSiteBusy;
  }

  return messages.value.results.uploadFailed;
}

async function confirmCloudUpload(): Promise<void> {
  const fileToUpload = secretFile.value;

  if (!fileToUpload || cloudUploadState.value === 'uploading') return;

  cloudUploadState.value = 'uploading';
  cloudUploadError.value = '';
  cloudUploadLocalSaveFailed.value = false;
  cloudUploadPopupBlocked.value = false;

  try {
    const createdShare = await createCloudSecretFile(fileToUpload);
    trackCloudShareCreated(fileToUpload.scope);
    const href = router.resolve({
      name: 'preview',
      query: { file: createdShare.shareId, source: 'cloud' },
    }).href;
    const absoluteHref = new URL(href, window.location.href).href;

    cloudUploadHref.value = href;

    try {
      linkCloudShare({
        createdAt: createdShare.createdAt,
        profileName: fileToUpload.profileName,
        scope: fileToUpload.scope,
        shareId: createdShare.shareId,
      });
    } catch {
      cloudUploadLocalSaveFailed.value = true;
    }

    cloudUploadState.value = 'success';

    const previewWindow = window.open(absoluteHref, '_blank');
    if (previewWindow) {
      previewWindow.opener = null;
    } else {
      cloudUploadPopupBlocked.value = true;
    }
  } catch (error) {
    cloudUploadError.value = getCloudUploadErrorMessage(error);
    cloudUploadState.value = 'error';
  }
}

watch(
  currentQuestionIndex,
  (questionIndex) => {
    if (questionIndex < 0) {
      return;
    }

    const current = categoryQuestions.value[questionIndex];
    const next = categoryQuestions.value[questionIndex + 1];

    if (current) {
      warmCategoryVisual(current.category.categoryId);
    }

    if (next) {
      warmCategoryVisual(next.category.categoryId);
    }
  },
  { immediate: true },
);

onMounted(() => {
  warmRabbitAssets();
  store.refresh();
  const fileId = typeof route.query.file === 'string' ? route.query.file : null;

  if (!fileId) {
    store.close();
    return;
  }

  const opened = store.open(fileId);

  if (!opened) {
    void router.replace({ name: 'create' });
    return;
  }

  trackSecretFileEditOpened(opened.scope);

  const reconciled = reconcileSecretFileQuestions(opened, allQuestionDefinitions);
  store.persist(reconciled);
});
</script>

<template>
  <QuestionnaireIntro
    v-if="!secretFile"
    :app-title="appTitle"
    :app-messages="appMessages"
    :error-message="creationError"
    :messages="messages"
    @cancel="goHome"
    @start="startQuestionnaire"
  />

  <div v-if="secretFile && currentQuestion && !shouldShowResults" class="questionnaire-question-transition">
    <Transition :name="questionTransition" mode="out-in">
      <CategoryQuestionStep
        :key="currentQuestion.id"
        :auto-advance-delay="autoAdvanceDelay"
        :can-go-back="canGoBack"
        :completed="completedQuestionCount"
        :current="currentPosition"
        :initial-answer="currentAnswer?.state === 'answered' ? currentAnswer : null"
        :messages="messages"
        :question="currentQuestion"
        :storage-warning="storageWarning"
        :total="currentTotal"
        @advance="advanceQuestion"
        @back="goToPreviousQuestion"
        @file-status="goToFileStatus"
        @note-opened="resetAutoAdvance"
        @save="saveQuestionAnswer"
      />
    </Transition>
  </div>

  <QuestionnaireResults
    v-if="shouldShowResults && secretFile"
    :back-home="appMessages.common.backHome"
    :question-bank="localizedQuestionBank"
    :messages="messages"
    :preview-href="previewHref"
    :secret-file="secretFile"
    :storage-warning="storageWarning"
    @edit-category="startDetailSession"
    @home="goHome"
    @upload="openCloudUploadDialog"
    @update-spotlight="updateSpotlight"
  />

  <dialog
    ref="cloudUploadDialog"
    class="cloud-upload-dialog"
    @cancel="handleCloudUploadCancel"
  >
    <template v-if="cloudUploadState === 'confirm' || cloudUploadState === 'error'">
      <h2>{{ messages.results.uploadConfirmTitle }}</h2>
      <p>{{ messages.results.uploadConfirmBody }}</p>
      <p v-if="cloudUploadError" class="cloud-upload-dialog__feedback" role="alert">
        {{ cloudUploadError }}
      </p>
      <div class="cloud-upload-dialog__actions">
        <button class="cloud-upload-dialog__confirm" type="button" @click="confirmCloudUpload">
          {{ messages.results.uploadConfirm }}
        </button>
        <button type="button" @click="closeCloudUploadDialog">
          {{ messages.results.uploadCancel }}
        </button>
      </div>
    </template>

    <template v-else-if="cloudUploadState === 'uploading'">
      <div class="cloud-upload-dialog__progress" role="status" aria-live="polite">
        <span aria-hidden="true" />
        <p>{{ messages.results.uploading }}</p>
      </div>
    </template>

    <template v-else>
      <h2>{{ messages.results.uploadSuccessTitle }}</h2>
      <p>
        {{ cloudUploadLocalSaveFailed
          ? messages.results.uploadSuccessBodyUnlinked
          : messages.results.uploadSuccessBody }}
      </p>
      <p v-if="cloudUploadPopupBlocked" class="cloud-upload-dialog__feedback" role="status">
        {{ messages.results.uploadPopupBlocked }}
      </p>
      <div class="cloud-upload-dialog__actions">
        <a :href="cloudUploadHref" target="_blank" rel="noopener noreferrer">
          {{ messages.results.uploadOpenFile }}
        </a>
        <button type="button" @click="closeCloudUploadDialog">
          {{ messages.results.uploadClose }}
        </button>
      </div>
    </template>
  </dialog>
</template>
