<script setup lang="ts">
import { computed } from 'vue';
import { findCategoryVisualUrl } from '../question-bank';
import type { QuestionnaireMessages } from '../questionnaire/messages';
import type {
  TimeMachineAnswerChange,
  TimeMachineComparisonChange,
} from './timeMachineComparison';
import type { TimeMachineComparisonMessages } from './timeMachineComparisonMessages';

interface HardNoCategoryGroup {
  categoryId: string;
  categoryName: string;
  changes: TimeMachineAnswerChange[];
  visualUrl: string | null;
}

interface HardNoLane {
  groups: HardNoCategoryGroup[];
  id: 'entered' | 'removed';
  title: string;
}

const props = defineProps<{
  changes: readonly TimeMachineComparisonChange[];
  messages: TimeMachineComparisonMessages;
  questionnaireMessages: QuestionnaireMessages;
}>();

const answerChanges = computed(() => props.changes.filter(
  (change): change is TimeMachineAnswerChange => change.kind === 'answer',
));
const lanes = computed<HardNoLane[]>(() => [
  {
    groups: groupByCategory(answerChanges.value.filter(
      (change) => change.newerAnswer.preference === 'hardNo',
    )),
    id: 'entered',
    title: props.messages.hardNoEntered,
  },
  {
    groups: groupByCategory(answerChanges.value.filter(
      (change) => change.olderAnswer.preference === 'hardNo',
    )),
    id: 'removed',
    title: props.messages.hardNoRemoved,
  },
]);

function groupByCategory(
  changes: readonly TimeMachineAnswerChange[],
): HardNoCategoryGroup[] {
  const groups = new Map<string, HardNoCategoryGroup>();

  for (const change of changes) {
    const categoryId = change.question.categoryId;
    const existingGroup = groups.get(categoryId);

    if (existingGroup) {
      existingGroup.changes.push(change);
      continue;
    }

    groups.set(categoryId, {
      categoryId,
      categoryName: change.question.categoryName,
      changes: [change],
      visualUrl: findCategoryVisualUrl(categoryId),
    });
  }

  return [...groups.values()];
}

function questionTitle(change: TimeMachineAnswerChange): string {
  if (!change.question.known) return props.messages.unknownQuestion;
  if (change.question.level === 'category') {
    return change.question.categoryName || props.messages.categoryOverall;
  }
  return change.question.title;
}

function preferenceLabel(change: TimeMachineAnswerChange, side: 'newer' | 'older'): string {
  const preference = side === 'older'
    ? change.olderAnswer.preference
    : change.newerAnswer.preference;

  return props.questionnaireMessages.preferenceLabels[preference];
}
</script>

<template>
  <div class="time-machine-hard-no">
    <section
      v-for="lane in lanes"
      :key="lane.id"
      class="time-machine-hard-no__lane"
      :class="`time-machine-hard-no__lane--${lane.id}`"
    >
      <h3>{{ lane.title }}</h3>

      <ol v-if="lane.groups.length" class="time-machine-hard-no__groups">
        <li v-for="group in lane.groups" :key="group.categoryId">
          <article
            class="time-machine-hard-no__group"
            :class="{ 'time-machine-hard-no__group--without-visual': !group.visualUrl }"
            :aria-label="group.categoryName"
          >
            <div v-if="group.visualUrl" class="time-machine-hard-no__identity">
              <figure>
                <img
                  :src="group.visualUrl"
                  alt=""
                  width="320"
                  height="320"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>

            <ul class="time-machine-hard-no__items">
              <li
                v-for="change in group.changes"
                :key="change.question.questionId"
              >
                <strong>{{ questionTitle(change) }}</strong>
                <div class="time-machine-hard-no__transition">
                  <span class="sr-only">{{ messages.earlier }}：</span>
                  <span
                    class="time-machine-hard-no__value"
                    :class="{
                      'is-hard-no': change.olderAnswer.preference === 'hardNo',
                    }"
                  >
                    {{ preferenceLabel(change, 'older') }}
                  </span>
                  <span aria-hidden="true">→</span>
                  <span class="sr-only">{{ messages.later }}：</span>
                  <span
                    class="time-machine-hard-no__value"
                    :class="{
                      'is-hard-no': change.newerAnswer.preference === 'hardNo',
                    }"
                  >
                    {{ preferenceLabel(change, 'newer') }}
                  </span>
                </div>
              </li>
            </ul>
          </article>
        </li>
      </ol>

      <p v-else class="time-machine-hard-no__empty">
        {{ messages.emptyValue }}
      </p>
    </section>
  </div>
</template>
