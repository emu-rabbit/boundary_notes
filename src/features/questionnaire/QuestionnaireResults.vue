<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  getCategoryQuestionId,
  questionBank,
} from '../question-bank';
import type {
  AnsweredSecretFileAnswer,
  QuestionRole,
  SecretFile,
} from '../secret-file/domain/types';
import type { QuestionnaireMessages } from './messages';

const props = defineProps<{
  backHome: string;
  messages: QuestionnaireMessages;
  secretFile: SecretFile;
  storageWarning: boolean;
}>();

const emit = defineEmits<{
  home: [];
}>();

const selectedRole = ref<QuestionRole>(
  props.secretFile.scope === 'passiveOnly' ? 'passive' : 'active',
);
const availableRoles = computed<readonly QuestionRole[]>(() => {
  if (props.secretFile.scope === 'all') {
    return ['active', 'passive'];
  }

  return [props.secretFile.scope === 'activeOnly' ? 'active' : 'passive'];
});

function getCategoryAnswer(categoryId: string): AnsweredSecretFileAnswer | null {
  const answer = props.secretFile.answers[getCategoryQuestionId(categoryId, selectedRole.value)];
  return answer?.state === 'answered' ? answer : null;
}

function getDetailAnsweredCount(categoryId: string): number {
  const prefix = `detail.${categoryId}.`;
  const roleSuffix = `.${selectedRole.value}`;

  return Object.entries(props.secretFile.answers).filter(
    ([questionId, answer]) =>
      questionId.startsWith(prefix) &&
      questionId.endsWith(roleSuffix) &&
      answer.state === 'answered',
  ).length;
}
</script>

<template>
  <section class="questionnaire-route questionnaire-results-route">
    <div class="questionnaire-page-shell questionnaire-results-shell">
      <header class="results-heading">
        <p class="questionnaire-kicker">{{ messages.results.completed }}</p>
        <h1>{{ messages.results.title }}</h1>
        <p>{{ messages.results.firstPhaseComplete }}</p>
      </header>

      <p v-if="storageWarning" class="questionnaire-warning" role="status">
        {{ messages.storageWarning }}
      </p>

      <div v-if="availableRoles.length > 1" class="result-role-switch" role="group">
        <button
          v-for="role in availableRoles"
          :key="role"
          :class="{ 'is-selected': selectedRole === role }"
          :aria-pressed="selectedRole === role"
          type="button"
          @click="selectedRole = role"
        >
          {{ messages.roleLabels[role] }}
        </button>
      </div>

      <div class="result-category-grid">
        <article
          v-for="category in questionBank.categories"
          :key="`${category.categoryId}.${selectedRole}`"
          class="result-category-card"
          :class="{ 'is-other': !category.includeInCategoryRound }"
        >
          <div>
            <span class="category-role-chip">{{ messages.roleLabels[selectedRole] }}</span>
            <h2>{{ category.name }}</h2>
          </div>

          <template v-if="category.includeInCategoryRound">
            <dl v-if="getCategoryAnswer(category.categoryId)" class="category-answer-summary">
              <div>
                <dt>{{ messages.results.experience }}</dt>
                <dd>{{ messages.experienceLabels[getCategoryAnswer(category.categoryId)!.experience] }}</dd>
              </div>
              <div>
                <dt>{{ messages.results.preference }}</dt>
                <dd>{{ messages.preferenceLabels[getCategoryAnswer(category.categoryId)!.preference] }}</dd>
              </div>
            </dl>
          </template>
          <p v-else class="result-other-copy">{{ messages.results.noCategoryAnswer }}</p>

          <p class="detail-progress-label">
            {{ messages.results.detailProgress(getDetailAnsweredCount(category.categoryId), category.itemCount) }}
          </p>
        </article>
      </div>

      <aside class="result-consent-note">
        {{ messages.results.warning(secretFile.profileName) }}
      </aside>

      <button class="quiet-action" type="button" @click="emit('home')">
        {{ backHome }}
      </button>
    </div>
  </section>
</template>
