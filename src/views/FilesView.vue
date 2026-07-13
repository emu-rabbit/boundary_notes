<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
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
const copyFeedbackFileId = ref<string | null>(null);
const copyFeedbackKind = ref<'error' | 'success' | null>(null);
const cloudFileCount = 0;

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



function selectViewer(source: FileViewerSource): void {
  activeViewer.value = source;
  importFeedback.value = '';
  importFeedbackKind.value = null;
}

function editFile(fileId: string): void {
  void router.push({ name: 'create', query: { file: fileId, view: 'results' } });
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

    const secretFile = store.importFile(candidate);
    importFeedback.value = messages.value.importSuccess(secretFile.profileName);
    importFeedbackKind.value = 'success';
    importJson.value = '';

    const previewWindow = window.open(
      previewHref(secretFile.fileId),
      '_blank',
      'noopener,noreferrer',
    );

    if (previewWindow) {
      previewWindow.opener = null;
    }
  } catch (error) {
    importFeedback.value = error instanceof Error ? error.message : String(error);
    importFeedbackKind.value = 'error';
  }
}

function submitCloudImport(): void {
  importFeedback.value = '';
  importFeedbackKind.value = null;

  try {
    const url = new URL(cloudImportUrl.value);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('Unsupported URL protocol.');
    }

    importFeedback.value = messages.value.cloudImportPending;
    importFeedbackKind.value = 'info';
  } catch {
    importFeedback.value = messages.value.invalidCloudUrl;
    importFeedbackKind.value = 'error';
  }
}

onMounted(() => {
  store.refresh();
  activeViewer.value = resolveInitialFileViewer(store.files.length, cloudFileCount);
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
              <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 18.5h14" />
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
              <button class="file-card-action" type="button" @click="editFile(file.fileId)">
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
          <p>{{ messages.empty }}</p>
          <button class="quiet-action" type="button" @click="navigate('create')">
            {{ messages.emptyAction }}
          </button>
        </div>
      </section>

      <section
        v-else
        id="cloud-files-panel"
        class="files-viewer-panel"
        role="tabpanel"
        aria-labelledby="cloud-files-tab"
      >
        <div class="files-empty-state files-empty-state--cloud">
          <div class="files-empty-state__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7.3 18.5h10.1a4 4 0 0 0 .6-7.9A6.2 6.2 0 0 0 6.3 9.2a4.7 4.7 0 0 0 1 9.3Z" />
            </svg>
          </div>
          <div>
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
        <label for="secret-file-json">{{ messages.importJsonLabel }}</label>
        <p>{{ messages.importJsonDescription }}</p>
        <textarea
          id="secret-file-json"
          v-model="importJson"
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
          type="url"
          inputmode="url"
          :placeholder="messages.cloudImportPlaceholder"
        />
        <button class="files-dialog-primary-action" type="submit" :disabled="!cloudImportUrl.trim()">
          {{ messages.cloudImportSubmit }}
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
