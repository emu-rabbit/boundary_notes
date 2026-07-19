<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { normalizeProfileName } from '../app/useProfileNameStorage';
import { useAppShell } from '../app/useAppShell';
import BrandMark from '../components/BrandMark.vue';
import RabbitScene from '../components/RabbitScene.vue';
import { rabbitPoseUrls, warmRabbitAssets } from '../features/story/rabbitAssets';
import StoryDialogue from '../features/story/StoryDialogue.vue';
import { getStoryStepIndex, getStorySteps, type StepId } from '../features/story/storySteps';

const {
  appTitle,
  completeStory,
  locale,
  localeOptions,
  messages,
  navigate,
  profileName,
  setLocale,
  titleParts,
} = useAppShell();

const stepId = ref<StepId>('language');
const storySteps = computed(() => getStorySteps(messages.value));
const storyStepIndex = computed(() => getStoryStepIndex(storySteps.value));
const activeStep = computed(() => storySteps.value[storyStepIndex.value.get(stepId.value) ?? 0]);
const activeRabbitUrl = computed(() => rabbitPoseUrls[activeStep.value.pose]);
const canSkipStory = computed(() => Boolean(normalizeProfileName(profileName.value)));

function goToStep(next: StepId): void {
  stepId.value = next;
}

function continueFromMessage(): void {
  if (activeStep.value.next) {
    goToStep(activeStep.value.next);
  }
}

function resetStory(): void {
  stepId.value = 'language';
  navigate('story');
}

function updateProfileNameDraft(name: string): void {
  profileName.value = name;
}

function skipStory(): void {
  completeStory();
}

onMounted(() => {
  warmRabbitAssets();
});
</script>

<template>
  <section class="story-route" :data-tone="activeStep.tone">
    <div class="ambient-grid" aria-hidden="true" />

    <header class="story-header">
      <BrandMark :hidden="activeStep.id === 'language'" :messages="messages" :title="appTitle" @restart="resetStory" />
      <button
        v-if="canSkipStory"
        class="story-skip-action"
        type="button"
        @click="skipStory"
      >
        {{ messages.common.skipStory }}
      </button>
    </header>

    <div class="story-layout">
      <RabbitScene
        :animation-key="activeStep.id"
        :image-url="activeRabbitUrl"
        :lamp-lit="activeStep.id === 'file'"
        :pose="activeStep.pose"
      />

      <StoryDialogue
        :active-locale="locale"
        :locale-options="localeOptions"
        :messages="messages"
        :profile-name="profileName"
        :step="activeStep"
        :title-parts="titleParts"
        @complete="completeStory"
        @continue="continueFromMessage"
        @go-to-step="goToStep"
        @update:locale="setLocale"
        @update:profile-name="updateProfileNameDraft"
      />
    </div>
  </section>
</template>
