<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import { getLocalizedRouteLocation } from '../app/routes';
import { useTransientActionFeedback } from '../app/useTransientActionFeedback';
import { getProfileEntryRoute, loadStoredProfileName } from '../app/useProfileNameStorage';
import { formatDocumentTitle } from '../app/useSecretFileTitle';
import ActionFeedbackIcon from '../components/ActionFeedbackIcon.vue';
import { trackSecretFileViewed } from '../features/analytics/analytics';
import {
  CloudSharingError,
  createCloudUploadContentFingerprint,
  findLinkedCloudShareByContentFingerprint,
  loadCloudSecretFile,
} from '../features/cloud-sharing';
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
import { warmStoryIntroFirstRabbitAsset } from '../features/story/rabbitAssets';

type PreviewSource = 'local' | 'cloud';

const route = useRoute();
const router = useRouter();
const store = useSecretFileStore();
const { documentTitle, locale, localeOptions, setLocale } = useAppShell();
const secretFile = ref<SecretFile | null>(null);
const shareUrl = ref<string | null>(null);
const shareLinkState = ref<'available' | 'checking' | 'missing'>('checking');
const loadState = ref<
  'cloudAppCheckUnavailable' | 'cloudMissing' | 'cloudUnavailable' | 'loading' | 'localMissing' | 'ready'
>('loading');
const {
  clear: clearCopyActionFeedback,
  feedback: copyActionFeedback,
  show: showCopyActionFeedback,
} = useTransientActionFeedback(3000);
let loadRequestId = 0;
const messages = computed(() => getPreviewMessages(locale.value));
const questionnaireMessages = computed(() => getQuestionnaireMessages(locale.value));
const localizedQuestionBank = computed(() => localizeQuestionBank(questionBank, locale.value));
const previewSource = computed<PreviewSource>(() => route.query.source === 'cloud' ? 'cloud' : 'local');
const loadMessage = computed(() => {
  if (loadState.value === 'loading') return messages.value.loading;
  if (loadState.value === 'cloudAppCheckUnavailable') return messages.value.cloudAppCheckUnavailable;
  if (loadState.value === 'cloudMissing') return messages.value.cloudLoadError;
  if (loadState.value === 'cloudUnavailable') return messages.value.cloudUnavailable;
  return messages.value.localLoadError;
});

function getRequest(): { fileId: string; source: PreviewSource } | null {
  const fileId = typeof route.query.file === 'string' ? route.query.file : '';
  return fileId ? { fileId, source: previewSource.value } : null;
}

function getCloudPreviewUrl(shareId: string): string {
  const href = router.resolve(getLocalizedRouteLocation('preview', locale.value, {
    query: { file: shareId, source: 'cloud' },
  })).href;
  return new URL(href, window.location.href).href;
}

async function resolveLocalCloudShare(file: SecretFile, requestId: number): Promise<void> {
  shareLinkState.value = 'checking';
  shareUrl.value = null;

  try {
    const fingerprint = await createCloudUploadContentFingerprint(file);
    const linkedShare = findLinkedCloudShareByContentFingerprint(fingerprint);
    if (requestId !== loadRequestId) return;
    shareUrl.value = linkedShare ? getCloudPreviewUrl(linkedShare.shareId) : null;
    shareLinkState.value = linkedShare ? 'available' : 'missing';
  } catch {
    if (requestId !== loadRequestId) return;
    shareLinkState.value = 'missing';
  }
}

async function loadPreview(): Promise<void> {
  const requestId = ++loadRequestId;
  const request = getRequest();
  secretFile.value = null;
  shareUrl.value = null;
  shareLinkState.value = 'checking';
  clearCopyActionFeedback();

  if (!request) {
    loadState.value = 'localMissing';
    return;
  }

  if (request.source === 'local') {
    const opened = store.open(request.fileId);
    secretFile.value = opened;
    loadState.value = opened ? 'ready' : 'localMissing';
    if (opened) {
      trackSecretFileViewed('local', opened.scope);
      void resolveLocalCloudShare(opened, requestId);
    }
    return;
  }

  const categoryVisualWarmup = warmAllCategoryVisuals();
  loadState.value = 'loading';

  try {
    const snapshot = await loadCloudSecretFile(request.fileId);

    if (requestId !== loadRequestId) return;
    secretFile.value = snapshot.secretFile;
    shareUrl.value = getCloudPreviewUrl(request.fileId);
    shareLinkState.value = 'available';
    loadState.value = 'ready';
    trackSecretFileViewed('cloud', snapshot.secretFile.scope);
    void categoryVisualWarmup.then((allCategoryVisualsLoaded) => {
      if (
        allCategoryVisualsLoaded
        && requestId === loadRequestId
        && previewSource.value === 'cloud'
        && loadState.value === 'ready'
      ) {
        warmStoryIntroFirstRabbitAsset();
      }
    });
  } catch (error) {
    if (requestId !== loadRequestId) return;
    if (error instanceof CloudSharingError && error.code === 'notFound') {
      loadState.value = 'cloudMissing';
    } else if (error instanceof CloudSharingError && error.code === 'appCheck') {
      loadState.value = 'cloudAppCheckUnavailable';
    } else {
      loadState.value = 'cloudUnavailable';
    }
  }
}

async function copyCurrentShareLink(): Promise<void> {
  clearCopyActionFeedback();

  try {
    const currentUrl = window.location.href;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(currentUrl);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = currentUrl;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (!copied) throw new Error('Clipboard copy failed.');
    }

    showCopyActionFeedback('copy-cloud-link', 'success', messages.value.cloudLinkCopied);
  } catch {
    showCopyActionFeedback('copy-cloud-link', 'error', messages.value.cloudLinkCopyFailed);
  }
}

function createMyFile(): void {
  void router.push(getLocalizedRouteLocation(
    getProfileEntryRoute(loadStoredProfileName()),
    locale.value,
  ));
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
    :share-link-state="shareLinkState"
    :share-url="shareUrl"
    :source="previewSource"
    @create-my-file="createMyFile"
    @locale-change="setLocale"
  />
  <section
    v-else
    class="secret-file-preview-route preview-load-state"
    :aria-busy="loadState === 'loading'"
  >
    <div class="preview-load-state__card">
      <p role="status">{{ loadMessage }}</p>
      <template v-if="previewSource === 'cloud' && loadState !== 'loading'">
        <button
          type="button"
          :class="copyActionFeedback ? `is-${copyActionFeedback.kind}` : undefined"
          :aria-label="copyActionFeedback?.message ?? messages.copyCloudLink"
          :title="copyActionFeedback?.message"
          @click="copyCurrentShareLink"
        >
          <ActionFeedbackIcon v-if="copyActionFeedback" :kind="copyActionFeedback.kind" />
          <span class="action-feedback-label">
            {{ copyActionFeedback?.message ?? messages.copyCloudLink }}
          </span>
          <span
            v-if="copyActionFeedback"
            class="sr-only"
            role="status"
            aria-live="polite"
          >{{ copyActionFeedback.message }}</span>
        </button>
      </template>
    </div>
  </section>
</template>
