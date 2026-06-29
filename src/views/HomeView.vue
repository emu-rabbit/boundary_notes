<script setup lang="ts">
import type { AppRouteDefinition, AppRouteId } from '../app/routes';
import { homeRabbitUrl } from '../features/story/rabbitAssets';

defineProps<{
  appTitle: string;
  entrances: AppRouteDefinition[];
}>();

const emit = defineEmits<{
  navigate: [routeId: AppRouteId];
}>();
</script>

<template>
  <section class="home-route">
    <div class="home-ambient" aria-hidden="true" />
    <div class="home-stage">
      <img
        :src="homeRabbitUrl"
        alt="白色兔子抱著秘密檔案資料夾。"
        class="home-rabbit"
        width="1024"
        height="1536"
        decoding="async"
      />
      <div class="home-copy">
        <p class="home-kicker">主頁</p>
        <h1>{{ appTitle }}</h1>
        <p>把測驗、檔案、分享與變化記錄分開入口，讓每一次核對都可以慢慢來。</p>
      </div>
    </div>

    <nav class="home-entrances" aria-label="秘密檔案功能入口">
      <button
        v-for="entrance in entrances"
        :key="entrance.id"
        class="entrance-card"
        type="button"
        @click="emit('navigate', entrance.id)"
      >
        <span class="entrance-state">
          {{ entrance.state === 'ready' ? '可使用' : '規劃中' }}
        </span>
        <span class="entrance-title">{{ entrance.label }}</span>
        <span class="entrance-summary">{{ entrance.summary }}</span>
      </button>
    </nav>

    <button class="quiet-action home-replay" type="button" @click="emit('navigate', 'story')">
      再看一次開場
    </button>
  </section>
</template>
