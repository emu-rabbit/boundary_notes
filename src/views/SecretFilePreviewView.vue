<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import { getProfileEntryRoute, loadStoredProfileName } from '../app/useProfileNameStorage';
import { formatDocumentTitle } from '../app/useSecretFileTitle';
import { localizeQuestionBank, questionBank } from '../features/question-bank';
import { getQuestionnaireMessages } from '../features/questionnaire/messages';
import { getPreviewMessages } from '../features/questionnaire/previewMessages';
import SecretFilePreview from '../features/questionnaire/SecretFilePreview.vue';
import type { SecretFile } from '../features/secret-file';
import { useSecretFileStore } from '../features/secret-file/application/useSecretFileStore';

type PreviewSource = 'local' | 'cloud';

const route = useRoute();
const router = useRouter();
const store = useSecretFileStore();
const { documentTitle, locale, localeOptions, setLocale } = useAppShell();
const secretFile = ref<SecretFile | null>(null);
const loadState = ref<'ready' | 'missing' | 'unsupported'>('missing');
const messages = computed(() => getPreviewMessages(locale.value));
const questionnaireMessages = computed(() => getQuestionnaireMessages(locale.value));
const localizedQuestionBank = computed(() => localizeQuestionBank(questionBank, locale.value));

function getRequest(): { fileId: string; source: PreviewSource } | null {
  const fileId = typeof route.query.file === 'string' ? route.query.file : '';
  const source = route.query.source === 'cloud' ? 'cloud' : 'local';
  return fileId ? { fileId, source } : null;
}

function loadPreview(): void {
  const request = getRequest();
  secretFile.value = null;

  if (!request) {
    loadState.value = 'missing';
    return;
  }

  if (request.source !== 'local') {
    loadState.value = 'unsupported';
    return;
  }

  const opened = store.open(request.fileId);
  secretFile.value = opened;
  loadState.value = opened ? 'ready' : 'missing';
}

function createMyFile(): void {
  void router.push({ name: getProfileEntryRoute(loadStoredProfileName()) });
}

watch(() => route.fullPath, loadPreview);
watch([secretFile, messages], ([file, previewMessages]) => {
  if (file) {
    document.title = formatDocumentTitle(previewMessages.title(file.profileName));
  }
});

onMounted(() => {
  store.refresh();
  loadPreview();
  window.scrollTo({ left: 0, top: 0 });
});

onUnmounted(() => {
  document.title = documentTitle.value;
});
</script>

<template>
  <SecretFilePreview
    v-if="loadState === 'ready' && secretFile"
    :locale="locale"
    :locale-options="localeOptions"
    :messages="messages"
    :question-bank="localizedQuestionBank"
    :questionnaire-messages="questionnaireMessages"
    :secret-file="secretFile"
    @create-my-file="createMyFile"
    @locale-change="setLocale"
  />
  <section v-else class="secret-file-preview-route preview-load-state" role="status">
    <p>{{ loadState === 'unsupported' ? messages.unsupportedSource : messages.loadError }}</p>
  </section>
</template>
