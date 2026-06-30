<script setup lang="ts">
import type { RabbitPose } from '../features/story/rabbitAssets';

defineProps<{
  imageUrl: string;
  animationKey: string;
  lampLit: boolean;
  pose: RabbitPose;
}>();
</script>

<template>
  <aside class="illustration-scene" :data-lit="lampLit ? 'true' : 'false'" :data-pose="pose" aria-hidden="true">
    <div class="scene-backdrop">
      <span class="stage-curtain" />
      <span class="shelf shelf-one" />
      <span class="shelf shelf-two" />
      <span class="notice-board" />
      <span class="archive-cubby">
        <span class="cubby-drawer cubby-drawer-top" />
        <span class="cubby-drawer cubby-drawer-bottom" />
      </span>
      <span class="stage-lamp">
        <span class="lamp-cord" />
        <span class="lamp-head" />
        <span class="lamp-beam" />
      </span>
    </div>
    <div class="scene-table">
      <span class="paper-stack stack-left" />
      <span class="paper-stack stack-right" />
      <span class="desk-folder" />
      <span class="privacy-card" />
      <span class="sealed-note" />
    </div>
    <img
      :key="animationKey"
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
