<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
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
import { warmStoryAssets } from '../features/story/rabbitAssets';

const route = useRoute();
const router = useRouter();
const store = useSecretFileStore();
const {
  appTitle,
  autoAdvanceDelay,
  locale,
  messages: appMessages,
  navigate,
  profileName,
  recordAutoAdvance,
  resetAutoAdvance,
} = useAppShell();

const creationError = ref('');
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

  store.persist(
    answerSecretFileQuestion(secretFile.value, currentQuestion.value, answer),
  );
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

  void nextTick(() => window.scrollTo({ left: 0, top: 0 }));
}

function finishDetailSession(): void {
  detailSession.value = null;
  detailCursor.value = null;

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

function goHome(): void {
  store.close();
  navigate('home');
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
  warmStoryAssets();
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
    @update-spotlight="updateSpotlight"
  />
</template>
