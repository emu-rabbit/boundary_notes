<script setup lang="ts">
import type { AppRouteId } from '../app/routes';
import { homeRabbitUrl } from '../features/story/rabbitAssets';

defineProps<{
  appTitle: string;
}>();

const emit = defineEmits<{
  navigate: [routeId: AppRouteId];
}>();
</script>

<template>
  <section class="about-route">
    <div class="home-ambient" aria-hidden="true" />
    <div class="about-stage">
      <img
        :src="homeRabbitUrl"
        alt="白色兔子揮手，懷裡抱著秘密檔案筆記本。"
        class="planned-rabbit"
        width="1024"
        height="1536"
        decoding="async"
      />
      <div class="about-copy">
        <p class="home-kicker">{{ appTitle }}</p>
        <h1>關於這隻兔子</h1>
        <p>
          這隻兔子會陪你把目前的感覺、界線與想說清楚的事整理成一份檔案。它只是溝通起點，不會替任何人做決定。
        </p>
        <div class="about-actions">
          <button class="quiet-action" type="button" @click="emit('navigate', 'story')">
            重播前導劇情
          </button>
          <button class="soft-link-action" type="button" @click="emit('navigate', 'home')">
            回主頁
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
