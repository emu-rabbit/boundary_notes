<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { SecretFileTitleParts } from '../app/useSecretFileTitle';
import BrandMark from '../components/BrandMark.vue';
import RabbitScene from '../components/RabbitScene.vue';
import { rabbitPoseUrls, warmStoryAssets } from '../features/story/rabbitAssets';
import StoryDialogue from '../features/story/StoryDialogue.vue';
import { type StepId, storyStepIndex, storySteps } from '../features/story/storySteps';

defineProps<{
  appTitle: string;
  profileName: string;
  titleParts: SecretFileTitleParts;
}>();

const emit = defineEmits<{
  complete: [];
  restart: [];
  'update:profileName': [name: string];
}>();

const stepId = ref<StepId>('self-question');
const activeStep = computed(() => storySteps[storyStepIndex.get(stepId.value) ?? 0]);
const activeRabbitUrl = computed(() => rabbitPoseUrls[activeStep.value.pose]);

function goToStep(next: StepId): void {
  stepId.value = next;
}

function continueFromMessage(): void {
  if (activeStep.value.next) {
    goToStep(activeStep.value.next);
  }
}

function resetStory(): void {
  stepId.value = 'self-question';
  emit('restart');
}

onMounted(() => {
  warmStoryAssets();
});
</script>

<template>
  <section class="story-route" :data-tone="activeStep.tone">
    <div class="ambient-grid" aria-hidden="true" />

    <header class="story-header">
      <BrandMark :title="appTitle" @restart="resetStory" />
    </header>

    <div class="story-layout">
      <RabbitScene
        :animation-key="activeStep.id"
        :image-url="activeRabbitUrl"
        :lamp-lit="activeStep.id === 'file'"
        :pose="activeStep.pose"
      />

      <StoryDialogue
        :profile-name="profileName"
        :step="activeStep"
        :title-parts="titleParts"
        @complete="emit('complete')"
        @continue="continueFromMessage"
        @go-to-step="goToStep"
        @update:profile-name="emit('update:profileName', $event)"
      />
    </div>
  </section>
</template>
