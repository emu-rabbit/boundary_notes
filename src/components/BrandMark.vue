<script setup lang="ts">
defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  restart: [];
}>();
</script>

<template>
  <button class="brand-mark" type="button" :aria-label="`${title}：重新開始前導劇情`" @click="emit('restart')">
    <span class="brand-folder-shell" aria-hidden="true">
      <svg class="brand-folder" viewBox="0 0 24 24" focusable="false">
        <path
          d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h4.2c.61 0 1.18.25 1.6.68l1.08 1.07H18A2.25 2.25 0 0 1 20.25 8.5v.75H3.75v-2.5Z"
        />
        <path
          d="M3.75 8.25h16.5v8.5A2.25 2.25 0 0 1 18 19H6a2.25 2.25 0 0 1-2.25-2.25v-8.5Z"
        />
      </svg>
    </span>
    <span>{{ title }}</span>
  </button>
</template>
