<script setup lang="ts">
import type { ActionFeedbackKind } from '../app/useTransientActionFeedback';

defineProps<{ kind: ActionFeedbackKind }>();
</script>

<template>
  <svg class="action-feedback-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path v-if="kind === 'success'" d="m5 12.5 4.2 4.2L19 7" />
    <template v-else>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.8v5.7M12 16.8v.1" />
    </template>
  </svg>
</template>
