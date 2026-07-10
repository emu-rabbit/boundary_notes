<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import {
  allCategoryQuestionDefinitions,
  getCategoryQuestionsForScope,
  questionBank,
  warmCategoryVisual,
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
  type SecretFileScope,
} from '../features/secret-file';
import { useSecretFileStore } from '../features/secret-file/application/useSecretFileStore';
import { warmStoryAssets } from '../features/story/rabbitAssets';

const route = useRoute();
const router = useRouter();
const store = useSecretFileStore();
const {
  appTitle,
  locale,
  messages: appMessages,
  navigate,
  profileName,
} = useAppShell();

const creationError = ref('');
const questionCursor = ref<number | null>(null);
const messages = computed(() => getQuestionnaireMessages(locale.value));
const secretFile = computed(() => store.activeSecretFile);
const categoryQuestions = computed(() =>
  secretFile.value ? getCategoryQuestionsForScope(secretFile.value.scope) : [],
);
const answeredCategoryCount = computed(() =>
  secretFile.value
    ? categoryQuestions.value.filter(
        (question) => secretFile.value?.answers[question.id]?.state === 'answered',
      ).length
    : 0,
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
const currentQuestion = computed(() =>
  currentQuestionIndex.value >= 0
    ? categoryQuestions.value[currentQuestionIndex.value] ?? null
    : null,
);
const currentAnswer = computed(() =>
  secretFile.value && currentQuestion.value
    ? secretFile.value.answers[currentQuestion.value.id]
    : null,
);
const canGoBack = computed(() => currentQuestionIndex.value > 0);
const storageWarning = computed(() => store.storageStatus.mode === 'memory');

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
    creationError.value = `這台裝置已保存 ${maxLocalSecretFiles} 份秘密檔案。請先從舊檔案刪除一份再建立新的檔案。`;
    return;
  }

  try {
    const created = createSecretFile({
      bankSchemaVersion: questionBank.schemaVersion,
      bankVersion: questionBank.bankVersion,
      fileId: createLocalFileId(),
      profileName: profileName.value.trim() || appMessages.value.title.defaultProfileName,
      questions: allCategoryQuestionDefinitions,
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
        ? `這台裝置已保存 ${maxLocalSecretFiles} 份秘密檔案。請先從舊檔案刪除一份再建立新的檔案。`
        : '暫時無法建立檔案，請稍後再試一次。';
  }
}

function saveQuestionAnswer(answer: AnswerQuestionInput): void {
  if (!secretFile.value || !currentQuestion.value || currentQuestionIndex.value < 0) {
    return;
  }

  questionCursor.value = currentQuestionIndex.value;
  store.persist(
    answerSecretFileQuestion(secretFile.value, currentQuestion.value, answer),
  );
}

function advanceQuestion(): void {
  if (!currentQuestion.value || currentQuestionIndex.value < 0) {
    return;
  }

  questionCursor.value = currentQuestionIndex.value + 1;
  void nextTick(() => {
    window.scrollTo({ left: 0, top: 0 });
  });
}

function goToPreviousQuestion(): void {
  if (!canGoBack.value) {
    return;
  }

  questionCursor.value = currentQuestionIndex.value - 1;
  void nextTick(() => {
    window.scrollTo({ left: 0, top: 0 });
  });
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

  const reconciled = reconcileSecretFileQuestions(opened, allCategoryQuestionDefinitions);
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

  <CategoryQuestionStep
    v-else-if="currentQuestion"
    :key="currentQuestion.id"
    :can-go-back="canGoBack"
    :completed="answeredCategoryCount"
    :current="currentQuestionIndex + 1"
    :initial-answer="currentAnswer?.state === 'answered' ? currentAnswer : null"
    :messages="messages"
    :question="currentQuestion"
    :storage-warning="storageWarning"
    :total="categoryQuestions.length"
    @advance="advanceQuestion"
    @back="goToPreviousQuestion"
    @save="saveQuestionAnswer"
  />

  <QuestionnaireResults
    v-else
    :back-home="appMessages.common.backHome"
    :messages="messages"
    :secret-file="secretFile"
    :storage-warning="storageWarning"
    @home="goHome"
  />
</template>
