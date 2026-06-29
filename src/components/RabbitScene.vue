<script setup lang="ts">
import type { RabbitPose } from '../features/story/rabbitAssets';

defineProps<{
  imageUrl: string;
  pose: RabbitPose;
}>();
</script>

<template>
  <aside class="illustration-scene" :data-pose="pose" aria-hidden="true">
    <div class="scene-backdrop">
      <span class="shelf shelf-one" />
      <span class="shelf shelf-two" />
      <span class="lantern" />
    </div>
    <div class="scene-table">
      <span class="paper-stack stack-left" />
      <span class="paper-stack stack-right" />
      <span class="privacy-card" />
      <span class="tiny-lock" />
    </div>
    <img
      :key="imageUrl"
      :src="imageUrl"
      alt=""
      class="rabbit-pose"
      width="1024"
      height="1536"
      decoding="async"
      fetchpriority="high"
    />
  </aside>
</template>
