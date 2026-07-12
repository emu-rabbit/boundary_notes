<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import { getFileManagerMessages } from '../features/secret-file/fileManagerMessages';
import { useSecretFileStore } from '../features/secret-file/application/useSecretFileStore';

const router = useRouter();
const store = useSecretFileStore();
const { locale, navigate } = useAppShell();
const messages = computed(() => getFileManagerMessages(locale.value));
const importJson = ref('');
const importFeedback = ref('');
const importFeedbackKind = ref<'error' | 'success' | null>(null);

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

function editFile(fileId: string): void {
  void router.push({ name: 'create', query: { file: fileId, view: 'results' } });
}

function viewFile(fileId: string): void {
  void router.push({ name: 'preview', query: { file: fileId, source: 'local' } });
}

function deleteFile(fileId: string, profileName: string): void {
  if (window.confirm(messages.value.deleteConfirmation(profileName))) {
    store.deleteFile(fileId);
  }
}

function submitImport(): void {
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
    void router.push({ name: 'preview', query: { file: secretFile.fileId, source: 'local' } });
  } catch (error) {
    importFeedback.value = error instanceof Error ? error.message : String(error);
    importFeedbackKind.value = 'error';
  }
}

onMounted(() => {
  store.refresh();
  window.scrollTo({ left: 0, top: 0 });
});
</script>

<template>
  <section class="files-route">
    <div class="files-stage">
      <header class="files-heading">
        <p class="home-kicker">{{ messages.title }}</p>
        <h1>{{ messages.title }}</h1>
      </header>

      <form class="file-import-panel" @submit.prevent="submitImport">
        <label for="secret-file-json">{{ messages.importLabel }}</label>
        <p>{{ messages.importDescription }}</p>
        <textarea
          id="secret-file-json"
          v-model="importJson"
          :placeholder="messages.importPlaceholder"
          rows="7"
          spellcheck="false"
        />
        <button class="quiet-action" type="submit" :disabled="!importJson.trim()">
          {{ messages.importJson }}
        </button>
        <p
          v-if="importFeedback"
          class="file-import-feedback"
          :class="`file-import-feedback--${importFeedbackKind}`"
          role="status"
          aria-live="polite"
        >
          {{ importFeedback }}
        </p>
      </form>

      <div v-if="store.files.length" class="file-list">
        <article v-for="file in store.files" :key="file.fileId" class="file-list-item">
          <div class="file-list-item__copy">
            <h2>{{ file.profileName }}</h2>
            <p>{{ messages.createdAt(formatDateTime(file.createdAt)) }}</p>
            <small>{{ messages.progress(file.answered, file.total) }}</small>
          </div>
          <div class="file-list-item__actions">
            <button class="quiet-action" type="button" @click="viewFile(file.fileId)">
              {{ messages.view }}
            </button>
            <button class="quiet-action" type="button" @click="editFile(file.fileId)">
              {{ messages.edit }}
            </button>
            <button class="file-delete-action" type="button" @click="deleteFile(file.fileId, file.profileName)">
              {{ messages.delete }}
            </button>
          </div>
        </article>
      </div>

      <div v-else class="files-empty-state">
        <p>{{ messages.empty }}</p>
        <button class="quiet-action" type="button" @click="navigate('create')">
          {{ messages.emptyAction }}
        </button>
      </div>

      <button class="soft-link-action files-home-action" type="button" @click="navigate('home')">
        {{ messages.backHome }}
      </button>
    </div>
  </section>
</template>
