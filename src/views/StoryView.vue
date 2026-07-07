<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { AppLocale, LocaleMessages, LocaleOption } from '../app/i18n';
import type { SecretFileTitleParts } from '../app/useSecretFileTitle';
import BrandMark from '../components/BrandMark.vue';
import RabbitScene from '../components/RabbitScene.vue';
import { rabbitPoseUrls, warmStoryAssets } from '../features/story/rabbitAssets';
import StoryDialogue from '../features/story/StoryDialogue.vue';
import { getStoryStepIndex, getStorySteps, type StepId } from '../features/story/storySteps';

const props = defineProps<{
  activeLocale: AppLocale;
  appTitle: string;
  localeOptions: LocaleOption[];
  messages: LocaleMessages;
  profileName: string;
  titleParts: SecretFileTitleParts;
}>();

const emit = defineEmits<{
  complete: [];
  restart: [];
  'update:locale': [locale: AppLocale];
  'update:profileName': [name: string];
}>();

const stepId = ref<StepId>('language');
const storySteps = computed(() => getStorySteps(props.messages));
const storyStepIndex = computed(() => getStoryStepIndex(storySteps.value));
const activeStep = computed(() => storySteps.value[storyStepIndex.value.get(stepId.value) ?? 0]);
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
  stepId.value = 'language';
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
      <BrandMark :hidden="activeStep.id === 'language'" :messages="messages" :title="appTitle" @restart="resetStory" />
    </header>

    <div class="story-layout">
      <RabbitScene
        :animation-key="activeStep.id"
        :image-url="activeRabbitUrl"
        :lamp-lit="activeStep.id === 'file'"
        :pose="activeStep.pose"
      />

      <StoryDialogue
        :active-locale="activeLocale"
        :locale-options="localeOptions"
        :messages="messages"
        :profile-name="profileName"
        :step="activeStep"
        :title-parts="titleParts"
        @complete="emit('complete')"
        @continue="continueFromMessage"
        @go-to-step="goToStep"
        @update:locale="emit('update:locale', $event)"
        @update:profile-name="emit('update:profileName', $event)"
      />
    </div>
  </section>
</template>
