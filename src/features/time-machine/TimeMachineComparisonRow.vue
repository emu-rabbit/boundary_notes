<script setup lang="ts">
import { computed } from 'vue';
import type { QuestionnaireMessages } from '../questionnaire/messages';
import type {
  TimeMachineAnswerChange,
  TimeMachineComparisonChange,
} from './timeMachineComparison';
import type { TimeMachineComparisonMessages } from './timeMachineComparisonMessages';

interface DisplayField {
  id: 'experience' | 'note' | 'preference';
  label: string;
  newer: string;
  older: string;
}

const props = withDefaults(defineProps<{
  change: TimeMachineComparisonChange;
  compactTimeline?: boolean;
  messages: TimeMachineComparisonMessages;
  questionnaireMessages: QuestionnaireMessages;
  showQuestionTitle?: boolean;
  useCategoryNameAsTitle?: boolean;
}>(), {
  compactTimeline: false,
  showQuestionTitle: true,
  useCategoryNameAsTitle: false,
});

const title = computed(() => {
  if (!props.change.question.known) return props.messages.unknownQuestion;
  if (props.change.question.level === 'category') {
    if (props.useCategoryNameAsTitle) {
      return props.change.question.categoryName || props.messages.categoryOverall;
    }

    return props.messages.categoryOverall;
  }
  return props.change.question.title;
});

function noteValue(answer: TimeMachineAnswerChange['olderAnswer']): string {
  if (!answer.note) return props.messages.emptyValue;
  return answer.note;
}

function createAnswerFields(change: TimeMachineAnswerChange): DisplayField[] {
  const older = change.olderAnswer;
  const newer = change.newerAnswer;
  const fields: DisplayField[] = [];

  if (older.experience !== newer.experience) {
    fields.push({
      id: 'experience',
      label: props.messages.experience,
      newer: props.questionnaireMessages.experienceLabels[newer.experience],
      older: props.questionnaireMessages.experienceLabels[older.experience],
    });
  }

  if (older.preference !== newer.preference) {
    fields.push({
      id: 'preference',
      label: props.messages.preference,
      newer: props.questionnaireMessages.preferenceLabels[newer.preference],
      older: props.questionnaireMessages.preferenceLabels[older.preference],
    });
  }

  if (older.note !== newer.note) {
    fields.push({
      id: 'note',
      label: props.messages.note,
      newer: noteValue(newer),
      older: noteValue(older),
    });
  }

  return fields;
}

const answerFields = computed(() => props.change.kind === 'answer'
  ? createAnswerFields(props.change)
  : []);
const primaryAnswerFieldCount = computed(() => answerFields.value.filter(
  (field) => field.id !== 'note',
).length);

const spotlightChange = computed(() => {
  if (props.change.kind !== 'spotlight') return '';
  if (props.change.olderRank === null) {
    return props.messages.spotlightAdded(props.change.newerRank ?? 1);
  }
  if (props.change.newerRank === null) return props.messages.spotlightRemoved;
  return props.messages.spotlightMoved(props.change.olderRank, props.change.newerRank);
});
const olderIsHardNo = computed(() => props.change.kind === 'answer'
  && props.change.olderAnswer.preference === 'hardNo');
const newerIsHardNo = computed(() => props.change.kind === 'answer'
  && props.change.newerAnswer.preference === 'hardNo');
</script>

<template>
  <div
    class="time-machine-change-row"
    :class="[
      `time-machine-change-row--${change.kind}`,
      `time-machine-change-row--${change.question.level}-question`,
      {
        'time-machine-change-row--category-name-title': useCategoryNameAsTitle
          && change.question.level === 'category',
      },
    ]"
  >
    <header
      v-if="showQuestionTitle || change.kind === 'spotlight'"
      class="time-machine-change-row__heading"
    >
      <h4 v-if="showQuestionTitle">{{ title }}</h4>
      <strong v-if="change.kind === 'spotlight'" class="time-machine-change-row__spotlight">
        {{ spotlightChange }}
      </strong>
    </header>

    <div
      v-if="change.kind === 'answer' && compactTimeline"
      class="time-machine-change-summary"
      :class="{
        'time-machine-change-summary--single-primary': primaryAnswerFieldCount === 1,
      }"
    >
      <dl
        class="time-machine-change-summary__side time-machine-change-summary__side--older"
        :aria-label="messages.earlier"
      >
        <div
          v-for="field in answerFields"
          :key="field.id"
          class="time-machine-change-summary__field"
          :class="`time-machine-change-summary__field--${field.id}`"
        >
          <dt>{{ field.label }}</dt>
          <dd>{{ field.older }}</dd>
        </div>
      </dl>

      <span class="time-machine-change-summary__arrow" aria-hidden="true">→</span>

      <dl
        class="time-machine-change-summary__side time-machine-change-summary__side--newer"
        :aria-label="messages.later"
      >
        <div
          v-for="field in answerFields"
          :key="field.id"
          class="time-machine-change-summary__field"
          :class="`time-machine-change-summary__field--${field.id}`"
        >
          <dt>{{ field.label }}</dt>
          <dd>{{ field.newer }}</dd>
        </div>
      </dl>
    </div>

    <dl v-else-if="change.kind === 'answer'" class="time-machine-change-fields">
      <div
        v-for="field in answerFields"
        :key="field.id"
        class="time-machine-change-field"
        :class="`time-machine-change-field--${field.id}`"
      >
        <dt>{{ field.label }}</dt>
        <dd
          :class="{
            'is-older-hard-no': field.id === 'preference' && olderIsHardNo,
            'is-newer-hard-no': field.id === 'preference' && newerIsHardNo,
          }"
        >
          <span class="sr-only">{{ messages.earlier }}：</span>
          <span class="time-machine-change-field__value time-machine-change-field__value--older">
            {{ field.older }}
          </span>
          <span class="time-machine-change-field__arrow" aria-hidden="true">→</span>
          <span class="sr-only">{{ messages.later }}：</span>
          <span class="time-machine-change-field__value time-machine-change-field__value--newer">
            {{ field.newer }}
          </span>
        </dd>
      </div>
    </dl>
  </div>
</template>
