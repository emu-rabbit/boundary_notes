<script setup lang="ts">
defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  restart: [];
}>();
</script>

<template>
  <button class="brand-mark" type="button" @click="emit('restart')">
    <span class="brand-orbit" aria-hidden="true" />
    <span>{{ title }}</span>
  </button>
</template>
