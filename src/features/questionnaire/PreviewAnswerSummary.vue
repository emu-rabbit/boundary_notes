<script setup lang="ts">
import type { AnsweredSecretFileAnswer, ExperienceAnswer, PreferenceAnswer } from '../secret-file';
import AnswerRatingIcon from './AnswerRatingIcon.vue';

const props = defineProps<{
  answer: AnsweredSecretFileAnswer;
  summary: string;
}>();

function iconKind(
  kind: 'experience' | 'preference',
  value: ExperienceAnswer | PreferenceAnswer,
): 'experience' | 'preference' | 'special' {
  return value === 'unsure' || value === 'seeDetails' ? 'special' : kind;
}

function tone(kind: 'experience' | 'preference', value: ExperienceAnswer | PreferenceAnswer): string {
  if (kind === 'preference' && value === 'hardNo') return 'is-negative-extreme';
  if (kind === 'preference' && value === 'love') return 'is-positive-extreme';
  if (kind === 'experience' && value === 'none') return 'is-negative-extreme';
  if (kind === 'experience' && value === 'veryExtensive') return 'is-positive-extreme';
  return '';
}
</script>

<template>
  <div class="preview-answer-summary">
    <span class="preview-answer-signal" :class="tone('experience', props.answer.experience)" aria-hidden="true">
      <AnswerRatingIcon
        :kind="iconKind('experience', props.answer.experience)"
        :value="props.answer.experience"
      />
    </span>
    <span class="preview-answer-signal" :class="tone('preference', props.answer.preference)" aria-hidden="true">
      <AnswerRatingIcon
        :kind="iconKind('preference', props.answer.preference)"
        :value="props.answer.preference"
      />
    </span>
    <span class="preview-answer-copy">{{ summary }}</span>
  </div>
</template>
