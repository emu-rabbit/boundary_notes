<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import { getProfileEntryRoute, loadStoredProfileName } from '../app/useProfileNameStorage';
import { formatDocumentTitle } from '../app/useSecretFileTitle';
import { trackSecretFileViewed } from '../features/analytics/analytics';
import { CloudSharingError, loadCloudSecretFile } from '../features/cloud-sharing';
import {
  localizeQuestionBank,
  questionBank,
  warmAllCategoryVisuals,
} from '../features/question-bank';
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
const loadState = ref<
  'cloudMissing' | 'cloudUnavailable' | 'loading' | 'localMissing' | 'ready'
>('loading');
let loadRequestId = 0;
const messages = computed(() => getPreviewMessages(locale.value));
const questionnaireMessages = computed(() => getQuestionnaireMessages(locale.value));
const localizedQuestionBank = computed(() => localizeQuestionBank(questionBank, locale.value));
const previewSource = computed<PreviewSource>(() => route.query.source === 'cloud' ? 'cloud' : 'local');
const loadMessage = computed(() => {
  if (loadState.value === 'loading') return messages.value.loading;
  if (loadState.value === 'cloudMissing') return messages.value.cloudLoadError;
  if (loadState.value === 'cloudUnavailable') return messages.value.cloudUnavailable;
  return messages.value.localLoadError;
});

function getRequest(): { fileId: string; source: PreviewSource } | null {
  const fileId = typeof route.query.file === 'string' ? route.query.file : '';
  return fileId ? { fileId, source: previewSource.value } : null;
}

async function loadPreview(): Promise<void> {
  const requestId = ++loadRequestId;
  const request = getRequest();
  secretFile.value = null;

  if (!request) {
    loadState.value = 'localMissing';
    return;
  }

  if (request.source === 'local') {
    const opened = store.open(request.fileId);
    secretFile.value = opened;
    loadState.value = opened ? 'ready' : 'localMissing';
    if (opened) trackSecretFileViewed('local', opened.scope);
    return;
  }

  warmAllCategoryVisuals();
  loadState.value = 'loading';

  try {
    const snapshot = await loadCloudSecretFile(request.fileId);

    if (requestId !== loadRequestId) return;
    secretFile.value = snapshot.secretFile;
    loadState.value = 'ready';
    trackSecretFileViewed('cloud', snapshot.secretFile.scope);
  } catch (error) {
    if (requestId !== loadRequestId) return;
    loadState.value = error instanceof CloudSharingError && error.code === 'notFound'
      ? 'cloudMissing'
      : 'cloudUnavailable';
  }
}

function createMyFile(): void {
  void router.push({ name: getProfileEntryRoute(loadStoredProfileName()) });
}

watch(() => route.fullPath, () => void loadPreview());
watch([secretFile, messages], ([file, previewMessages]) => {
  if (file) {
    document.title = formatDocumentTitle(previewMessages.title(file.profileName));
  }
});

onMounted(() => {
  store.refresh();
  void loadPreview();
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
    :source="previewSource"
    @create-my-file="createMyFile"
    @locale-change="setLocale"
  />
  <section
    v-else
    class="secret-file-preview-route preview-load-state"
    role="status"
    :aria-busy="loadState === 'loading'"
  >
    <p>{{ loadMessage }}</p>
  </section>
</template>
