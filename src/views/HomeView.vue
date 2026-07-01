<script setup lang="ts">
import { computed } from 'vue';
import type { AppRouteDefinition, AppRouteId } from '../app/routes';
import type { SecretFileTitleParts } from '../app/useSecretFileTitle';
import SecretFileTitle from '../components/SecretFileTitle.vue';
import { homeRabbitUrl } from '../features/story/rabbitAssets';

const props = defineProps<{
  entrances: AppRouteDefinition[];
  titleParts: SecretFileTitleParts;
}>();

const emit = defineEmits<{
  navigate: [routeId: AppRouteId];
}>();

const routeById = computed(() => new Map(props.entrances.map((entrance) => [entrance.id, entrance])));
const primaryEntrances = computed(() =>
  props.entrances.filter(
    (entrance) =>
      entrance.id === 'create' || entrance.id === 'files' || entrance.id === 'timeMachine',
  ),
);
const aboutEntrance = computed(() => routeById.value.get('about'));
const settingsEntrance = computed(() => routeById.value.get('settings'));
</script>

<template>
  <section class="home-route">
    <div class="home-ambient" aria-hidden="true" />

    <div class="home-stage">
      <img
        :src="homeRabbitUrl"
        alt="白色兔子揮手，懷裡抱著秘密檔案筆記本。"
        class="home-rabbit"
        width="1024"
        height="1536"
        decoding="async"
      />
      <div class="home-copy">
        <p class="home-kicker">歡迎回來</p>
        <SecretFileTitle :parts="titleParts" variant="home" />
        <p>
          今天也可以慢慢來，可以創建新的檔案，也可以從舊的檔案繼續作答。噢，還是你打算查看自己的變化，或是分享給別人這一部分的你呢？
        </p>
      </div>
    </div>

    <nav class="home-entrances" aria-label="秘密檔案主要入口">
      <button
        v-for="entrance in primaryEntrances"
        :key="entrance.id"
        class="entrance-card"
        :data-route="entrance.id"
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

    <div class="home-footer-actions">
      <button
        v-if="settingsEntrance"
        class="soft-link-action"
        type="button"
        @click="emit('navigate', settingsEntrance.id)"
      >
        {{ settingsEntrance.label }}
      </button>
      <button
        v-if="aboutEntrance"
        class="soft-link-action"
        type="button"
        @click="emit('navigate', aboutEntrance.id)"
      >
        {{ aboutEntrance.label }}
      </button>
    </div>
  </section>
</template>
