<script setup lang="ts">
import type { SecretFileTitleParts } from '../app/useSecretFileTitle';

withDefaults(
  defineProps<{
    parts: SecretFileTitleParts;
    variant?: 'home' | 'file';
  }>(),
  {
    variant: 'home',
  },
);
</script>

<template>
  <h1
    class="secret-file-title"
    :class="[`secret-file-title--${variant}`, `secret-file-title--${parts.density}`]"
    :style="{ '--owner-scale': parts.ownerScale }"
    :aria-label="parts.fullTitle"
  >
    <span class="secret-file-title__owner-line">
      <span class="secret-file-title__owner">{{ parts.ownerName }}</span>
      <span class="secret-file-title__connector">{{ parts.connector }}</span>
    </span>
    <span class="secret-file-title__object">{{ parts.objectLabel }}</span>
  </h1>
</template>
