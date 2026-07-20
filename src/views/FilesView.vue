<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import { getLocalizedRouteLocation } from '../app/routes';
import { useTransientActionFeedback } from '../app/useTransientActionFeedback';
import ActionFeedbackIcon from '../components/ActionFeedbackIcon.vue';
import {
  trackCloudShareUnlinked,
  trackSecretFileDeleted,
  trackSecretFileDownloaded,
  trackSecretFileImported,
} from '../features/analytics/analytics';
import {
  CloudShareLinkStorageError,
  CloudSharingError,
  hideAuthorExampleCloudFile,
  isAuthorExampleCloudFile,
  linkCloudShare,
  listCloudFiles,
  loadCloudSecretFile,
  parseCloudShareId,
  unlinkCloudShare,
  type CloudFileListItem,
} from '../features/cloud-sharing';
import { filesRabbitUrl } from '../features/story/rabbitAssets';
import { useSecretFileStore } from '../features/secret-file/application/useSecretFileStore';
import { getFileManagerMessages } from '../features/secret-file/fileManagerMessages';
import {
  resolveInitialFileViewer,
  type FileViewerSource,
} from '../features/secret-file/fileManagerState';
import type { SecretFileSummary } from '../features/secret-file/storage/browserSecretFileRepository';
import {
  decryptSecretFileExport,
  encryptSecretFileExport,
} from '../features/secret-file/transfer/secretFileTransfer';

const router = useRouter();
const store = useSecretFileStore();
const { locale, navigate } = useAppShell();
const messages = computed(() => getFileManagerMessages(locale.value));
const activeViewer = ref<FileViewerSource>('local');
const importDialog = ref<HTMLDialogElement | null>(null);
const localImportInput = ref<HTMLInputElement | null>(null);
const localImportBusy = ref(false);
const cloudImportUrl = ref('');
const cloudImportBusy = ref(false);
const cloudShares = ref<CloudFileListItem[]>([]);
const {
  clear: clearFileActionFeedback,
  feedback: fileActionFeedback,
  show: showFileActionFeedback,
} = useTransientActionFeedback();
const {
  clear: clearImportActionFeedback,
  feedback: importActionFeedback,
  show: showImportActionFeedback,
} = useTransientActionFeedback(3200);
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
  return router.resolve(getLocalizedRouteLocation('preview', locale.value, {
    query: { file: fileId, source: 'local' },
  })).href;
}

function cloudPreviewHref(shareId: string): string {
  return router.resolve(getLocalizedRouteLocation('preview', locale.value, {
    query: { file: shareId, source: 'cloud' },
  })).href;
}

function selectViewer(source: FileViewerSource): void {
  activeViewer.value = source;
  clearImportActionFeedback();
}

function editFile(file: SecretFileSummary): void {
  void router.push(getLocalizedRouteLocation('create', locale.value, {
    query: { file: file.fileId, view: 'results' },
  }));
}

function openImportDialog(): void {
  clearImportActionFeedback();
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

function safeDownloadFileName(value: string): string {
  return value.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/[. ]+$/g, '') || 'Boundary Notes.json';
}

async function downloadFile(file: SecretFileSummary): Promise<void> {
  const json = store.exportJson(file.fileId);
  const feedbackId = `download:${file.fileId}`;
  clearFileActionFeedback();

  if (!json) {
    showFileActionFeedback(feedbackId, 'error', messages.value.downloadError);
    return;
  }

  try {
    const encryptedJson = await encryptSecretFileExport(json);
    const blobUrl = URL.createObjectURL(new Blob([encryptedJson], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = safeDownloadFileName(messages.value.downloadFileName(file.profileName));
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
    showFileActionFeedback(feedbackId, 'success', messages.value.downloadSuccess);
    trackSecretFileDownloaded(file.scope);
  } catch {
    showFileActionFeedback(feedbackId, 'error', messages.value.downloadError);
  }
}

async function submitLocalImport(event: Event): Promise<void> {
  clearImportActionFeedback();
  const input = event.currentTarget as HTMLInputElement;
  const selectedFile = input.files?.[0];

  if (!selectedFile) return;

  localImportBusy.value = true;

  try {
    const decryptedJson = await decryptSecretFileExport(await selectedFile.text());
    const candidate = store.validateImportJson(decryptedJson);
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
    showImportActionFeedback(
      'local-import',
      'success',
      messages.value.importSuccess(secretFile.profileName),
    );
  } catch {
    showImportActionFeedback('local-import', 'error', messages.value.importReadError);
  } finally {
    input.value = '';
    localImportBusy.value = false;
  }
}

async function copyCloudShareLink(shareId: string): Promise<void> {
  const feedbackId = `copy:${shareId}`;
  clearFileActionFeedback();

  try {
    const shareUrl = new URL(cloudPreviewHref(shareId), window.location.href).href;
    await writeClipboard(shareUrl);
    showFileActionFeedback(feedbackId, 'success', messages.value.shareLinkCopySuccess);
  } catch {
    showFileActionFeedback(feedbackId, 'error', messages.value.shareLinkCopyError);
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
  clearImportActionFeedback();
  const shareId = parseCloudShareId(cloudImportUrl.value, window.location.href);

  if (!shareId) {
    showImportActionFeedback('cloud-import', 'error', messages.value.invalidCloudUrl);
    return;
  }

  const previewWindow = window.open('about:blank', '_blank');

  if (previewWindow) {
    previewWindow.opener = null;
  }

  cloudImportBusy.value = true;

  try {
    const snapshot = await loadCloudSecretFile(shareId);
    linkCloudShare({
      createdAt: snapshot.createdAt,
      profileName: snapshot.secretFile.profileName,
      scope: snapshot.secretFile.scope,
      shareId,
      sourceContentFingerprint: null,
    });
    cloudShares.value = listCloudFiles();
    trackSecretFileImported('cloud_share', snapshot.secretFile.scope, false);
    showImportActionFeedback(
      'cloud-import',
      'success',
      messages.value.cloudImportSuccess(snapshot.secretFile.profileName),
    );
    cloudImportUrl.value = '';

    if (previewWindow && !previewWindow.closed) {
      previewWindow.location.replace(new URL(cloudPreviewHref(shareId), window.location.href).href);
    }
  } catch (error) {
    if (previewWindow && !previewWindow.closed) previewWindow.close();
    showImportActionFeedback('cloud-import', 'error', getCloudErrorMessage(error));
  } finally {
    cloudImportBusy.value = false;
  }
}

function unlinkCloudFile(file: CloudFileListItem): void {
  const isAuthorExample = isAuthorExampleCloudFile(file.shareId);
  const confirmation = isAuthorExample
    ? messages.value.cloudExampleUnlinkConfirmation
    : messages.value.cloudUnlinkConfirmation(file.profileName ?? file.shareId);

  if (!window.confirm(confirmation)) return;
  clearFileActionFeedback();

  try {
    if (isAuthorExample) {
      hideAuthorExampleCloudFile();
    } else {
      unlinkCloudShare(file.shareId);
      trackCloudShareUnlinked(file.scope ?? null);
    }

    cloudShares.value = listCloudFiles();
  } catch {
    showFileActionFeedback(
      `unlink:${file.shareId}`,
      'error',
      messages.value.cloudLinkStorageFailed,
    );
  }
}

onMounted(() => {
  store.refresh();
  cloudShares.value = listCloudFiles();
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
            :aria-label="activeViewer === 'local' ? messages.importAction : messages.cloudLinkAction"
            :title="activeViewer === 'local' ? messages.importAction : messages.cloudLinkAction"
            @click="openImportDialog"
          >
            <svg v-if="activeViewer === 'local'" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5" />
              <path d="M5 13v6.5h14V13" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 12h8M5.5 8.5l-2 2a2.1 2.1 0 0 0 0 3l3 3a2.1 2.1 0 0 0 3 0l2-2m1-5 2-2a2.1 2.1 0 0 1 3 0l3 3a2.1 2.1 0 0 1 0 3l-2 2" />
              <path d="M18.5 3v5M16 5.5h5" />
            </svg>
            <span class="files-import-action__label">
              {{ activeViewer === 'local' ? messages.importAction : messages.cloudLinkAction }}
            </span>
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
              <button
                class="file-card-action file-card-action--icon"
                :class="fileActionFeedback?.id === `download:${file.fileId}`
                  ? `is-${fileActionFeedback.kind}`
                  : undefined"
                type="button"
                :aria-label="fileActionFeedback?.id === `download:${file.fileId}`
                  ? fileActionFeedback.message
                  : messages.download"
                :title="fileActionFeedback?.id === `download:${file.fileId}`
                  ? fileActionFeedback.message
                  : messages.download"
                @click="downloadFile(file)"
              >
                <ActionFeedbackIcon
                  v-if="fileActionFeedback?.id === `download:${file.fileId}`"
                  :kind="fileActionFeedback.kind"
                />
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5" />
                  <path d="M5 19.5h14" />
                </svg>
                <span
                  v-if="fileActionFeedback?.id === `download:${file.fileId}`"
                  class="sr-only"
                  role="status"
                  aria-live="polite"
                >{{ fileActionFeedback.message }}</span>
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
        <p class="cloud-files-note">
          {{ messages.cloudReadOnlyNotice }}
        </p>

        <div v-if="cloudShares.length" class="file-list">
          <article
            v-for="file in cloudShares"
            :key="file.shareId"
            class="file-list-item file-list-item--cloud"
          >
            <div class="file-list-item__copy">
              <div class="file-list-item__identity">
                <h2>{{ file.isAuthorExample ? messages.authorExampleTitle : file.profileName ?? messages.cloudUnavailable }}</h2>
                <span v-if="file.isAuthorExample">
                  {{ messages.authorExampleBadge }}
                </span>
                <span v-if="file.scope">{{ messages.scope(file.scope) }}</span>
              </div>
              <p v-if="file.isAuthorExample" class="file-list-item__example-description">
                {{ messages.authorExampleDescription }}
              </p>
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
                class="file-card-action file-card-action--icon"
                :class="fileActionFeedback?.id === `copy:${file.shareId}`
                  ? `is-${fileActionFeedback.kind}`
                  : undefined"
                type="button"
                :aria-label="fileActionFeedback?.id === `copy:${file.shareId}`
                  ? fileActionFeedback.message
                  : messages.shareLink"
                :title="fileActionFeedback?.id === `copy:${file.shareId}`
                  ? fileActionFeedback.message
                  : messages.shareLink"
                @click="copyCloudShareLink(file.shareId)"
              >
                <ActionFeedbackIcon
                  v-if="fileActionFeedback?.id === `copy:${file.shareId}`"
                  :kind="fileActionFeedback.kind"
                />
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="8" y="8" width="11" height="11" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
                <span
                  v-if="fileActionFeedback?.id === `copy:${file.shareId}`"
                  class="sr-only"
                  role="status"
                  aria-live="polite"
                >{{ fileActionFeedback.message }}</span>
              </button>
              <button
                class="file-card-action file-card-action--delete"
                :class="fileActionFeedback?.id === `unlink:${file.shareId}`
                  ? `is-${fileActionFeedback.kind}`
                  : undefined"
                type="button"
                :aria-label="fileActionFeedback?.id === `unlink:${file.shareId}`
                  ? fileActionFeedback.message
                  : file.isAuthorExample ? messages.cloudExampleUnlink : messages.cloudUnlink"
                :title="fileActionFeedback?.id === `unlink:${file.shareId}`
                  ? fileActionFeedback.message
                  : file.isAuthorExample ? messages.cloudExampleUnlink : messages.cloudUnlink"
                @click="unlinkCloudFile(file)"
              >
                <ActionFeedbackIcon
                  v-if="fileActionFeedback?.id === `unlink:${file.shareId}`"
                  :kind="fileActionFeedback.kind"
                />
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m14.8 7.2 1.4-1.4a3.4 3.4 0 1 1 4.8 4.8L19.6 12" />
                  <path d="m9.2 16.8-1.4 1.4A3.4 3.4 0 1 1 3 13.4L4.4 12" />
                  <path d="M8 3v3M3 8h3M16 18v3M18 16h3" />
                </svg>
                <span
                  v-if="fileActionFeedback?.id === `unlink:${file.shareId}`"
                  class="sr-only"
                  role="status"
                  aria-live="polite"
                >{{ fileActionFeedback.message }}</span>
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

      <div v-if="activeViewer === 'local'" class="file-import-form">
        <p>{{ messages.importJsonDescription }}</p>
        <input
          id="secret-file-upload"
          ref="localImportInput"
          class="file-import-input"
          type="file"
          accept="application/json,.json"
          :aria-label="messages.importJsonLabel"
          :disabled="localImportBusy"
          @change="submitLocalImport"
        />
        <button
          class="files-dialog-primary-action"
          :class="importActionFeedback?.id === 'local-import'
            ? `is-${importActionFeedback.kind}`
            : undefined"
          type="button"
          :disabled="localImportBusy"
          :aria-label="importActionFeedback?.id === 'local-import'
            ? importActionFeedback.message
            : messages.importJson"
          :title="importActionFeedback?.id === 'local-import' ? importActionFeedback.message : undefined"
          @click="localImportInput?.click()"
        >
          <ActionFeedbackIcon
            v-if="importActionFeedback?.id === 'local-import'"
            :kind="importActionFeedback.kind"
          />
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5" />
            <path d="M5 13v6.5h14V13" />
          </svg>
          <span class="action-feedback-label">
            {{ importActionFeedback?.id === 'local-import'
              ? importActionFeedback.message
              : messages.importJson }}
          </span>
          <span
            v-if="importActionFeedback?.id === 'local-import'"
            class="sr-only"
            role="status"
            aria-live="polite"
          >{{ importActionFeedback.message }}</span>
        </button>
      </div>

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
          :class="importActionFeedback?.id === 'cloud-import'
            ? `is-${importActionFeedback.kind}`
            : undefined"
          type="submit"
          :disabled="!cloudImportUrl.trim() || cloudImportBusy"
          :aria-label="importActionFeedback?.id === 'cloud-import'
            ? importActionFeedback.message
            : cloudImportBusy ? messages.cloudLoading : messages.cloudImportSubmit"
          :title="importActionFeedback?.id === 'cloud-import' ? importActionFeedback.message : undefined"
        >
          <ActionFeedbackIcon
            v-if="importActionFeedback?.id === 'cloud-import'"
            :kind="importActionFeedback.kind"
          />
          <span class="action-feedback-label">
            {{ importActionFeedback?.id === 'cloud-import'
              ? importActionFeedback.message
              : cloudImportBusy ? messages.cloudLoading : messages.cloudImportSubmit }}
          </span>
          <span
            v-if="importActionFeedback?.id === 'cloud-import'"
            class="sr-only"
            role="status"
            aria-live="polite"
          >{{ importActionFeedback.message }}</span>
        </button>
      </form>
    </dialog>

  </section>
</template>
