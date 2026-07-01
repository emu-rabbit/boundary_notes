<script setup lang="ts">
import type { AppRouteDefinition, AppRouteId } from '../app/routes';
import { homeRabbitUrl } from '../features/story/rabbitAssets';

defineProps<{
  appTitle: string;
  route: AppRouteDefinition;
}>();

const emit = defineEmits<{
  navigate: [routeId: AppRouteId];
}>();
</script>

<template>
  <section class="planned-route">
    <div class="home-ambient" aria-hidden="true" />
    <div class="planned-stage">
      <img
        :src="homeRabbitUrl"
        alt="白色兔子揮手，懷裡抱著秘密檔案筆記本。"
        class="planned-rabbit"
        width="1024"
        height="1536"
        decoding="async"
      />
      <div class="planned-copy">
        <p class="home-kicker">{{ appTitle }}</p>
        <h1>{{ route.label }}</h1>
        <p>{{ route.summary }}</p>
        <button class="quiet-action" type="button" @click="emit('navigate', 'home')">
          回主頁
        </button>
      </div>
    </div>
  </section>
</template>
