<script setup lang="ts">
import { computed } from 'vue';
import type { AppLocale, LocaleMessages, LocaleOption } from '../../app/i18n';
import type { SecretFileTitleParts } from '../../app/useSecretFileTitle';
import SecretFileTitle from '../../components/SecretFileTitle.vue';
import type { StepId, StoryStep } from './storySteps';

const props = defineProps<{
  activeLocale: AppLocale;
  localeOptions: LocaleOption[];
  profileName: string;
  step: StoryStep;
  messages: LocaleMessages;
  titleParts: SecretFileTitleParts;
}>();

const emit = defineEmits<{
  complete: [];
  continue: [];
  goToStep: [stepId: StepId];
  'update:locale': [locale: AppLocale];
  'update:profileName': [name: string];
}>();

const nameInput = computed({
  get: () => props.profileName,
  set: (value: string) => emit('update:profileName', value),
});

function chooseLocale(locale: AppLocale): void {
  emit('update:locale', locale);
  emit('continue');
}
</script>

<template>
  <Transition name="dialogue" mode="out-in">
    <article :key="step.id" class="dialogue-panel">
      <div
        v-if="step.showSpeaker !== false"
        class="speaker-name"
        :class="{ 'is-visually-held': step.id === 'language' }"
      >
        {{ messages.story.speakerName }}
      </div>
      <div v-if="step.kind === 'language'" class="dialogue-copy">
        <p v-for="line in step.lines" :key="line" class="rabbit-speech">
          {{ line }}
        </p>
        <div class="language-grid" role="list">
          <button
            v-for="option in localeOptions"
            :key="option.id"
            class="language-choice"
            :class="{ 'language-choice--active': option.id === activeLocale }"
            :aria-pressed="option.id === activeLocale"
            type="button"
            @click="chooseLocale(option.id)"
          >
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>

      <div v-else-if="step.kind === 'choice'" class="dialogue-copy">
        <p v-for="line in step.lines" :key="line" class="rabbit-speech">
          {{ line }}
        </p>
        <div class="choice-grid" role="list">
          <button
            v-for="choice in step.choices"
            :key="choice.label"
            class="choice-button"
            type="button"
            @click="emit('goToStep', choice.next)"
          >
            {{ choice.label }}
          </button>
        </div>
      </div>

      <div v-else-if="step.kind === 'message'" class="dialogue-copy">
        <p class="rabbit-speech">{{ step.message }}</p>
        <button class="primary-action" type="button" @click="emit('continue')">
          {{ step.action }}
        </button>
      </div>

      <form v-else-if="step.kind === 'name'" class="dialogue-copy" @submit.prevent="emit('continue')">
        <p v-for="line in step.lines" :key="line" class="rabbit-speech">
          {{ line }}
        </p>
        <label class="name-field">
          <span>{{ messages.story.nameFieldLabel }}</span>
          <input
            v-model="nameInput"
            autocomplete="nickname"
            :placeholder="messages.title.defaultProfileName"
            type="text"
          />
        </label>
        <button class="primary-action" type="submit">{{ step.action }}</button>
      </form>

      <div v-else class="dialogue-copy">
        <SecretFileTitle :parts="titleParts" variant="file" />
        <div class="file-body">
          <p v-for="paragraph in step.body" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
        <button class="primary-action" type="button" @click="emit('complete')">
          {{ step.action }}
        </button>
      </div>
    </article>
  </Transition>
</template>
