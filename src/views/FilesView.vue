<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import {
  trackCloudShareUnlinked,
  trackSecretFileDeleted,
  trackSecretFileImported,
  trackSecretFileJsonCopied,
} from '../features/analytics/analytics';
import {
  CloudShareLinkStorageError,
  CloudSharingError,
  linkCloudShare,
  listLinkedCloudShares,
  loadCloudSecretFile,
  parseCloudShareId,
  unlinkCloudShare,
  type LinkedCloudShare,
} from '../features/cloud-sharing';
import { filesRabbitUrl } from '../features/story/rabbitAssets';
import { useSecretFileStore } from '../features/secret-file/application/useSecretFileStore';
import { getFileManagerMessages } from '../features/secret-file/fileManagerMessages';
import {
  resolveInitialFileViewer,
  type FileViewerSource,
} from '../features/secret-file/fileManagerState';
import type { SecretFileSummary } from '../features/secret-file/storage/browserSecretFileRepository';

const router = useRouter();
const store = useSecretFileStore();
const { locale, navigate } = useAppShell();
const messages = computed(() => getFileManagerMessages(locale.value));
const activeViewer = ref<FileViewerSource>('local');
const importDialog = ref<HTMLDialogElement | null>(null);
const importJson = ref('');
const cloudImportUrl = ref('');
const importFeedback = ref('');
const importFeedbackKind = ref<'error' | 'info' | 'success' | null>(null);
const cloudImportBusy = ref(false);
const cloudShares = ref<LinkedCloudShare[]>([]);
const cloudListFeedback = ref('');
const copyFeedbackFileId = ref<string | null>(null);
const copyFeedbackKind = ref<'error' | 'success' | null>(null);
const cloudFileCount = computed(() => cloudShares.value.length);

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function previewHref(fileId: string): string {
  return router.resolve({
    name: 'preview',
    query: { file: fileId, source: 'local' },
  }).href;
}

function cloudPreviewHref(shareId: string): string {
  return router.resolve({
    name: 'preview',
    query: { file: shareId, source: 'cloud' },
  }).href;
}

function selectViewer(source: FileViewerSource): void {
  activeViewer.value = source;
  importFeedback.value = '';
  importFeedbackKind.value = null;
}

function editFile(file: SecretFileSummary): void {
  void router.push({ name: 'create', query: { file: file.fileId, view: 'results' } });
}

function openImportDialog(): void {
  importFeedback.value = '';
  importFeedbackKind.value = null;
  void nextTick(() => importDialog.value?.showModal());
}

function deleteFile(file: SecretFileSummary): void {
  if (!window.confirm(messages.value.deleteConfirmation(file.profileName))) {
    return;
  }

  store.deleteFile(file.fileId);
  trackSecretFileDeleted(file.scope);
}

async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Clipboard copy failed.');
  }
}

async function copyFileJson(file: SecretFileSummary): Promise<void> {
  const json = store.exportJson(file.fileId);

  if (!json) {
    copyFeedbackFileId.value = file.fileId;
    copyFeedbackKind.value = 'error';
    return;
  }

  try {
    await writeClipboard(json);
    copyFeedbackFileId.value = file.fileId;
    copyFeedbackKind.value = 'success';
    trackSecretFileJsonCopied(file.scope);
  } catch {
    copyFeedbackFileId.value = file.fileId;
    copyFeedbackKind.value = 'error';
  }
}

function submitLocalImport(): void {
  importFeedback.value = '';
  importFeedbackKind.value = null;

  try {
    const candidate = store.validateImportJson(importJson.value);
    const existingFile = store.files.find((file) => file.fileId === candidate.fileId);

    if (
      existingFile &&
      !window.confirm(
        messages.value.overwriteConfirmation(
          candidate.profileName,
          formatDateTime(existingFile.updatedAt),
          formatDateTime(candidate.updatedAt),
        ),
      )
    ) {
      return;
    }

    const overwroteExisting = Boolean(existingFile);
    const secretFile = store.importFile(candidate);
    trackSecretFileImported('local_json', secretFile.scope, overwroteExisting);
    importFeedback.value = messages.value.importSuccess(secretFile.profileName);
    importFeedbackKind.value = 'success';
    importJson.value = '';
  } catch (error) {
    importFeedback.value = error instanceof Error ? error.message : String(error);
    importFeedbackKind.value = 'error';
  }
}

function getCloudErrorMessage(error: unknown): string {
  if (error instanceof CloudShareLinkStorageError) {
    return messages.value.cloudLinkStorageFailed;
  }

  if (error instanceof CloudSharingError && error.code === 'configuration') {
    return messages.value.cloudConfigurationError;
  }

  return messages.value.cloudLoadFailed;
}

async function submitCloudImport(): Promise<void> {
  importFeedback.value = '';
  importFeedbackKind.value = null;
  const shareId = parseCloudShareId(cloudImportUrl.value, window.location.href);

  if (!shareId) {
    importFeedback.value = messages.value.invalidCloudUrl;
    importFeedbackKind.value = 'error';
    return;
  }

  const previewWindow = window.open('about:blank', '_blank');

  if (previewWindow) {
    previewWindow.opener = null;
  }

  cloudImportBusy.value = true;

  try {
    const snapshot = await loadCloudSecretFile(shareId);
    cloudShares.value = linkCloudShare({
      createdAt: snapshot.createdAt,
      profileName: snapshot.secretFile.profileName,
      scope: snapshot.secretFile.scope,
      shareId,
      sourceContentFingerprint: null,
    });
    trackSecretFileImported('cloud_share', snapshot.secretFile.scope, false);
    cloudListFeedback.value = '';
    importFeedback.value = messages.value.cloudImportSuccess(snapshot.secretFile.profileName);
    importFeedbackKind.value = 'success';
    cloudImportUrl.value = '';

    if (previewWindow && !previewWindow.closed) {
      previewWindow.location.replace(new URL(cloudPreviewHref(shareId), window.location.href).href);
    }
  } catch (error) {
    if (previewWindow && !previewWindow.closed) previewWindow.close();
    importFeedback.value = getCloudErrorMessage(error);
    importFeedbackKind.value = 'error';
  } finally {
    cloudImportBusy.value = false;
  }
}

function unlinkCloudFile(
  shareId: string,
  name: string,
  scope: LinkedCloudShare['scope'],
): void {
  if (!window.confirm(messages.value.cloudUnlinkConfirmation(name))) return;

  try {
    cloudShares.value = unlinkCloudShare(shareId);
    trackCloudShareUnlinked(scope ?? null);
    cloudListFeedback.value = '';
  } catch {
    cloudListFeedback.value = messages.value.cloudLinkStorageFailed;
  }
}

onMounted(() => {
  store.refresh();
  cloudShares.value = listLinkedCloudShares();
  activeViewer.value = resolveInitialFileViewer(store.files.length, cloudFileCount.value);
  window.scrollTo({ left: 0, top: 0 });
});
</script>

<template>
  <section class="files-route">
    <div class="files-stage">
      <div class="files-character">
        <span class="files-character__glow" />
        <img
          :src="filesRabbitUrl"
          :alt="messages.rabbitAlt"
          width="1024"
          height="1536"
          decoding="async"
        />
      </div>

      <header class="files-heading">
        <p class="home-kicker">{{ messages.kicker }}</p>
        <h1>{{ messages.title }}</h1>
      </header>

      <p class="files-intro">{{ messages.intro }}</p>

      <div class="files-viewer-toolbar">
        <div class="files-viewer-switch" role="tablist" :aria-label="messages.title">
          <button
            id="local-files-tab"
            class="files-viewer-tab"
            :class="{ 'files-viewer-tab--active': activeViewer === 'local' }"
            type="button"
            role="tab"
            :aria-selected="activeViewer === 'local'"
            aria-controls="local-files-panel"
            @click="selectViewer('local')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7.5h5l1.7 2H20v8.8A1.7 1.7 0 0 1 18.3 20H5.7A1.7 1.7 0 0 1 4 18.3V7.5Z" />
              <path d="M4 9.5h16M7 5h4.5l1.4 2" />
            </svg>
            <span>{{ messages.localTab }}</span>
            <small>{{ store.files.length }}</small>
          </button>
          <button
            id="cloud-files-tab"
            class="files-viewer-tab"
            :class="{ 'files-viewer-tab--active': activeViewer === 'cloud' }"
            type="button"
            role="tab"
            :aria-selected="activeViewer === 'cloud'"
            aria-controls="cloud-files-panel"
            @click="selectViewer('cloud')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.3 18.5h10.1a4 4 0 0 0 .6-7.9A6.2 6.2 0 0 0 6.3 9.2a4.7 4.7 0 0 0 1 9.3Z" />
            </svg>
            <span>{{ messages.cloudTab }}</span>
            <small>{{ cloudFileCount }}</small>
          </button>
          <button
            class="files-import-action"
            type="button"
            :aria-label="messages.importAction"
            :title="messages.importAction"
            @click="openImportDialog"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.5 3.5h6.3l5.7 5.7v11.3H6.5A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z" />
              <path d="M12.8 3.5v5.7h5.7M12.5 12.5v5M10 15h5" />
            </svg>
            <span class="files-import-action__label">{{ messages.importAction }}</span>
          </button>
        </div>
      </div>

      <section
        v-if="activeViewer === 'local'"
        id="local-files-panel"
        class="files-viewer-panel"
        role="tabpanel"
        aria-labelledby="local-files-tab"
      >
        <div v-if="store.files.length" class="file-list">
          <article v-for="file in store.files" :key="file.fileId" class="file-list-item">
            <div class="file-list-item__copy">
              <div class="file-list-item__identity">
                <h2>{{ file.profileName }}</h2>
                <span>{{ messages.scope(file.scope) }}</span>
              </div>
              <time :datetime="file.updatedAt">{{ messages.updatedAt(formatDateTime(file.updatedAt)) }}</time>

            </div>
            <div class="file-list-item__actions">
              <a
                class="file-card-action file-card-action--view"
                :href="previewHref(file.fileId)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.2-5.5 9-5.5S21 12 21 12s-3.2 5.5-9 5.5S3 12 3 12Z" />
                  <circle cx="12" cy="12" r="2.2" />
                </svg>
                {{ messages.view }}
              </a>
              <button class="file-card-action" type="button" @click="editFile(file)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 19 3.4-.7L18.7 8a1.8 1.8 0 0 0 0-2.5l-.2-.2a1.8 1.8 0 0 0-2.5 0L5.7 15.6 5 19Z" />
                  <path d="m14.7 6.6 2.7 2.7" />
                </svg>
                {{ messages.edit }}
              </button>
              <button class="file-card-action" type="button" @click="copyFileJson(file)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="8" y="8" width="11" height="11" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
                {{ messages.copyJson }}
              </button>
              <button
                class="file-card-action file-card-action--delete"
                type="button"
                :aria-label="messages.delete"
                :title="messages.delete"
                @click="deleteFile(file)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 7h14M9 7V4h6v3m2 0-.7 13H7.7L7 7m3.5 4v5.5m3-5.5v5.5" />
                </svg>
              </button>
            </div>
            <p
              v-if="copyFeedbackFileId === file.fileId"
              class="file-card-feedback"
              :class="`file-card-feedback--${copyFeedbackKind}`"
              role="status"
              aria-live="polite"
            >
              {{ copyFeedbackKind === 'success' ? messages.copySuccess : messages.copyError }}
            </p>
          </article>
        </div>

        <div v-else class="files-empty-state">
          <div class="files-empty-state__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 7.5h5l1.7 2H20v8.8A1.7 1.7 0 0 1 18.3 20H5.7A1.7 1.7 0 0 1 4 18.3V7.5Z" />
              <path d="M8.5 14h7" />
            </svg>
          </div>
          <div class="files-empty-state__copy">
            <h2>{{ messages.emptyTitle }}</h2>
            <p>{{ messages.emptyBody }}</p>
          </div>
        </div>
      </section>

      <section
        v-else
        id="cloud-files-panel"
        class="files-viewer-panel"
        role="tabpanel"
        aria-labelledby="cloud-files-tab"
      >
        <p
          v-if="cloudListFeedback"
          class="file-manager-feedback file-manager-feedback--error"
          role="alert"
        >
          {{ cloudListFeedback }}
        </p>

        <div v-if="cloudShares.length" class="file-list">
          <article
            v-for="file in cloudShares"
            :key="file.shareId"
            class="file-list-item file-list-item--cloud"
          >
            <div class="file-list-item__copy">
              <div class="file-list-item__identity">
                <h2>{{ file.profileName ?? messages.cloudUnavailable }}</h2>
                <span v-if="file.scope">{{ messages.scope(file.scope) }}</span>
              </div>
              <time v-if="file.createdAt" :datetime="file.createdAt">
                {{ messages.cloudUploadedAt(formatDateTime(file.createdAt)) }}
              </time>
            </div>
            <div class="file-list-item__actions file-list-item__actions--cloud">
              <a
                class="file-card-action file-card-action--view"
                :href="cloudPreviewHref(file.shareId)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.2-5.5 9-5.5S21 12 21 12s-3.2 5.5-9 5.5S3 12 3 12Z" />
                  <circle cx="12" cy="12" r="2.2" />
                </svg>
                {{ messages.view }}
              </a>
              <button
                class="file-card-action file-card-action--delete"
                type="button"
                :aria-label="messages.cloudUnlink"
                :title="messages.cloudUnlink"
                @click="unlinkCloudFile(
                  file.shareId,
                  file.profileName ?? file.shareId,
                  file.scope,
                )"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 12h8M5.5 8.5l-2 2a2.1 2.1 0 0 0 0 3l3 3a2.1 2.1 0 0 0 3 0l2-2m1-5 2-2a2.1 2.1 0 0 1 3 0l3 3a2.1 2.1 0 0 1 0 3l-2 2" />
                </svg>
              </button>
            </div>
          </article>
        </div>

        <div v-else class="files-empty-state">
          <div class="files-empty-state__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7.3 18.5h10.1a4 4 0 0 0 .6-7.9A6.2 6.2 0 0 0 6.3 9.2a4.7 4.7 0 0 0 1 9.3Z" />
            </svg>
          </div>
          <div class="files-empty-state__copy">
            <h2>{{ messages.cloudEmptyTitle }}</h2>
            <p>{{ messages.cloudEmptyBody }}</p>
          </div>
        </div>
      </section>

      <button class="quiet-action files-home-action" type="button" @click="navigate('home')">
        {{ messages.backHome }}
      </button>
    </div>

    <dialog ref="importDialog" class="file-manager-dialog file-import-dialog">
      <div class="file-manager-dialog__heading">
        <div>
          <p class="home-kicker">{{ activeViewer === 'local' ? messages.localTab : messages.cloudTab }}</p>
          <h2>{{ messages.importTitle }}</h2>
        </div>
        <form method="dialog">
          <button class="file-dialog-close" type="submit" :aria-label="messages.close">×</button>
        </form>
      </div>

      <form v-if="activeViewer === 'local'" class="file-import-form" @submit.prevent="submitLocalImport">
        <p>{{ messages.importJsonDescription }}</p>
        <textarea
          id="secret-file-json"
          v-model="importJson"
          :aria-label="messages.importJsonLabel"
          :placeholder="messages.importJsonPlaceholder"
          rows="10"
          spellcheck="false"
        />
        <button class="files-dialog-primary-action" type="submit" :disabled="!importJson.trim()">
          {{ messages.importJson }}
        </button>
      </form>

      <form v-else class="file-import-form" @submit.prevent="submitCloudImport">
        <label for="cloud-file-url">{{ messages.cloudImportLabel }}</label>
        <p>{{ messages.cloudImportDescription }}</p>
        <input
          id="cloud-file-url"
          v-model="cloudImportUrl"
          type="text"
          inputmode="url"
          :placeholder="messages.cloudImportPlaceholder"
        />
        <button
          class="files-dialog-primary-action"
          type="submit"
          :disabled="!cloudImportUrl.trim() || cloudImportBusy"
        >
          {{ cloudImportBusy ? messages.cloudLoading : messages.cloudImportSubmit }}
        </button>
      </form>

      <p
        v-if="importFeedback"
        class="file-manager-feedback"
        :class="`file-manager-feedback--${importFeedbackKind}`"
        role="status"
        aria-live="polite"
      >
        {{ importFeedback }}
      </p>
    </dialog>

  </section>
</template>
