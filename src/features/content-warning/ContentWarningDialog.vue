<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { AppLocale } from '../../app/i18n';
import {
  hasRecentContentWarningConfirmation,
  saveContentWarningConfirmation,
} from './contentWarning';
import { getContentWarningMessages } from './contentWarningMessages';

const props = defineProps<{
  locale: AppLocale;
}>();

const dialog = ref<HTMLDialogElement | null>(null);
const isPending = ref(!hasRecentContentWarningConfirmation());
const messages = computed(() => getContentWarningMessages(props.locale));

onMounted(() => {
  if (isPending.value) dialog.value?.showModal();
});

function confirm(): void {
  saveContentWarningConfirmation();
  dialog.value?.close();
  isPending.value = false;
}

function keepDialogOpen(event: Event): void {
  event.preventDefault();
}

function leave(): void {
  window.location.replace('about:blank');
}
</script>

<template>
  <dialog
    v-if="isPending"
    ref="dialog"
    class="content-warning-dialog"
    aria-describedby="content-warning-description"
    aria-labelledby="content-warning-title"
    @cancel="keepDialogOpen"
  >
    <div class="content-warning-dialog__content">
      <h2 id="content-warning-title">{{ messages.title }}</h2>
      <p id="content-warning-description">{{ messages.description }}</p>
      <div class="content-warning-dialog__actions">
        <button class="content-warning-dialog__action" type="button" @click="leave">
          {{ messages.leave }}
        </button>
        <button class="content-warning-dialog__action content-warning-dialog__action--confirm" type="button" autofocus @click="confirm">
          {{ messages.confirm }}
        </button>
      </div>
    </div>
  </dialog>
</template>
