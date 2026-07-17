<script setup lang="ts">
import { computed, ref } from 'vue';
import type { AppLocale } from '../../app/i18n';
import serviceWalletUrl from '../../assets/categories/07-service.webp';
import { getSponsorMessages } from './sponsorMessages';

const props = defineProps<{
  locale: AppLocale;
}>();

const dialog = ref<HTMLDialogElement | null>(null);
const messages = computed(() => getSponsorMessages(props.locale));

function open(): void {
  dialog.value?.showModal();
}

function close(): void {
  dialog.value?.close();
}

function closeFromBackdrop(event: MouseEvent): void {
  if (event.target === dialog.value) close();
}

defineExpose({ open });
</script>

<template>
  <dialog ref="dialog" class="sponsor-dialog" aria-labelledby="sponsor-dialog-title" @click="closeFromBackdrop">
    <div class="sponsor-dialog__panel">
      <button class="sponsor-dialog__close" type="button" :aria-label="messages.close" @click="close">×</button>

      <div class="sponsor-dialog__visual">
        <img :src="serviceWalletUrl" :alt="messages.imageAlt" width="768" height="768" />
      </div>

      <div class="sponsor-dialog__content">
        <h2 id="sponsor-dialog-title">{{ messages.title }}</h2>
        <p class="sponsor-dialog__description">{{ messages.description }}</p>

        <div class="sponsor-dialog__channels">
          <a href="https://p.ecpay.com.tw/C3D0915" target="_blank" rel="noopener noreferrer">
            <strong>{{ messages.ecpayLabel }}</strong>
            <span>{{ messages.ecpayDescription }}</span>
            <small aria-hidden="true">↗</small>
          </a>
          <a href="https://ko-fi.com/emu_rabbit2526" target="_blank" rel="noopener noreferrer">
            <strong>{{ messages.kofiLabel }}</strong>
            <span>{{ messages.kofiDescription }}</span>
            <small aria-hidden="true">↗</small>
          </a>
        </div>

        <p class="sponsor-dialog__contact">
          {{ messages.contact }}
          <a href="mailto:mausu2526@gmail.com">{{ messages.contactLabel }}</a>
        </p>
      </div>
    </div>
  </dialog>
</template>
