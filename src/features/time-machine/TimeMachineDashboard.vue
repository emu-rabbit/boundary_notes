<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import type { AppLocale } from '../../app/i18n';
import type { SecretFileTitleParts } from '../../app/useSecretFileTitle';
import SecretFileTitle from '../../components/SecretFileTitle.vue';
import {
  findCategoryVisualUrl,
  localizeQuestionBank,
  questionBank,
} from '../question-bank';
import { getQuestionnaireMessages } from '../questionnaire/messages';
import {
  isRoleIncludedInScope,
  type QuestionRole,
  type SecretFile,
} from '../secret-file';
import TimeMachineComparisonRow from './TimeMachineComparisonRow.vue';
import TimeMachineHardNoChanges from './TimeMachineHardNoChanges.vue';
import {
  compareSecretFiles,
  type TimeMachineComparisonChange,
  type TimeMachineComparisonSectionId,
} from './timeMachineComparison';
import {
  getTimeMachineComparisonMessages,
} from './timeMachineComparisonMessages';
import { formatTimeMachineDate, getTimeMachineMessages } from './timeMachineMessages';
import {
  hasHiddenTimeMachineChanges,
  selectTimeMachinePreviewChanges,
} from './timeMachinePreview';

interface ComparisonSection {
  changes: readonly TimeMachineComparisonChange[];
  groups: readonly ComparisonCategoryGroup[];
  hasMoreChanges: boolean;
  id: TimeMachineComparisonSectionId;
  previewChanges: readonly TimeMachineComparisonChange[];
  title: string;
}

interface ComparisonCategoryGroup {
  categoryId: string;
  categoryName: string;
  changes: TimeMachineComparisonChange[];
  visualUrl: string | null;
}

type RoleRecordGap = 'earlier' | 'later';

const props = defineProps<{
  locale: AppLocale;
  newer: SecretFile;
  older: SecretFile;
  titleParts: SecretFileTitleParts;
}>();

const previewLimits: Record<TimeMachineComparisonSectionId, number> = {
  spotlight: 4,
  category: 4,
  hardNo: 4,
  detail: 8,
};
const sectionOrder: readonly TimeMachineComparisonSectionId[] = [
  'spotlight',
  'category',
  'hardNo',
  'detail',
];
const allChangesDialog = ref<HTMLDialogElement | null>(null);
const dashboardRoot = ref<HTMLElement | null>(null);
const activeSectionId = ref<TimeMachineComparisonSectionId | null>(null);
const messages = computed(() => getTimeMachineComparisonMessages(props.locale));
const storyMessages = computed(() => getTimeMachineMessages(props.locale));
const questionnaireMessages = computed(() => getQuestionnaireMessages(props.locale));
const localizedQuestionBank = computed(() => localizeQuestionBank(questionBank, props.locale));
const comparison = computed(() => compareSecretFiles(
  props.older,
  props.newer,
  localizedQuestionBank.value,
));
const availableRoles = computed<readonly QuestionRole[]>(() => (['active', 'passive'] as const).filter(
  (role) => isRoleIncludedInScope(role, props.older.scope)
    || isRoleIncludedInScope(role, props.newer.scope),
));
const selectedRole = ref<QuestionRole>(getInitialRole());
const hasAnyContent = computed(() => availableRoles.value.some(hasContentForRole));
const showRoleSwitch = computed(() => availableRoles.value.length > 1 && hasAnyContent.value);
const sections = computed<ComparisonSection[]>(() => sectionOrder.map((id) => {
  const changes = (comparison.value[id] as readonly TimeMachineComparisonChange[]).filter(
    (change) => change.question.role === selectedRole.value,
  );
  const previewChanges = selectTimeMachinePreviewChanges(id, changes, previewLimits[id]);

  return {
    changes,
    groups: groupChanges(previewChanges),
    hasMoreChanges: hasHiddenTimeMachineChanges(id, changes, previewLimits[id]),
    id,
    previewChanges,
    title: messages.value.sections[id],
  };
}));
const visibleSections = computed(() => sections.value.filter((section) => section.changes.length > 0));
const activeSection = computed(() => sections.value.find(
  (section) => section.id === activeSectionId.value,
) ?? null);
const activeSectionGroups = computed(() => groupChanges(
  activeSection.value?.changes ?? [],
));
const profileNameChanged = computed(() => props.older.profileName !== props.newer.profileName);
const scopeChanged = computed(() => props.older.scope !== props.newer.scope);
const selectedRoleRecordGap = computed(() => getRoleRecordGap(selectedRole.value));
const selectedRoleNotice = computed(() => {
  const gap = selectedRoleRecordGap.value;
  const roleLabel = questionnaireMessages.value.roleLabels[selectedRole.value];

  if (gap === 'earlier') return messages.value.noEarlierRoleAnswers(roleLabel);
  if (gap === 'later') return messages.value.noLaterRoleAnswers(roleLabel);
  return '';
});

function hasChangesForRole(role: QuestionRole): boolean {
  return sectionOrder.some((id) => comparison.value[id].some(
    (change) => change.question.role === role,
  ));
}

function getRoleRecordGap(role: QuestionRole): RoleRecordGap | null {
  const olderIncluded = isRoleIncludedInScope(role, props.older.scope);
  const newerIncluded = isRoleIncludedInScope(role, props.newer.scope);

  if (!olderIncluded && newerIncluded) return 'earlier';
  if (olderIncluded && !newerIncluded) return 'later';
  return null;
}

function hasContentForRole(role: QuestionRole): boolean {
  return hasChangesForRole(role) || getRoleRecordGap(role) !== null;
}

function groupChanges(
  changes: readonly TimeMachineComparisonChange[],
): ComparisonCategoryGroup[] {
  const groups = new Map<string, ComparisonCategoryGroup>();

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

function usesStateSummary(
  sectionId: TimeMachineComparisonSectionId,
  groupIndex: number,
  groupCount: number,
): boolean {
  if (sectionId === 'detail') return true;
  if (sectionId !== 'category') return false;

  return groupCount % 2 === 1 && groupIndex === groupCount - 1;
}

function getInitialRole(): QuestionRole {
  if (hasChangesForRole('active')) return 'active';
  if (hasChangesForRole('passive')) return 'passive';

  const newerPreferredRole: QuestionRole = props.newer.scope === 'passiveOnly'
    ? 'passive'
    : 'active';
  const otherRole: QuestionRole = newerPreferredRole === 'active' ? 'passive' : 'active';

  if (getRoleRecordGap(newerPreferredRole)) return newerPreferredRole;
  if (getRoleRecordGap(otherRole)) return otherRole;
  return newerPreferredRole;
}

function formatDate(value: string): string {
  return formatTimeMachineDate(props.locale, value);
}

function scopeLabel(scope: SecretFile['scope']): string {
  return storyMessages.value.scopeLabel(scope);
}

function openAllChanges(sectionId: TimeMachineComparisonSectionId): void {
  activeSectionId.value = sectionId;
  void nextTick(() => allChangesDialog.value?.showModal());
}

function closeAllChanges(): void {
  allChangesDialog.value?.close();
}

function closeDialogOnBackdrop(event: MouseEvent): void {
  if (event.target === event.currentTarget) closeAllChanges();
}

onMounted(() => {
  dashboardRoot.value?.focus({ preventScroll: true });
});
</script>

<template>
  <section
    ref="dashboardRoot"
    class="time-machine-dashboard"
    tabindex="-1"
    :aria-label="messages.title"
  >
    <div class="time-machine-dashboard__summary">
      <header class="time-machine-dashboard__heading">
        <div class="time-machine-dashboard__title">
          <SecretFileTitle :parts="titleParts" variant="file" />
          <span v-if="profileNameChanged" class="time-machine-dashboard__former-name">
            {{ messages.originalProfileName(older.profileName) }}
          </span>
        </div>
      </header>

      <div class="time-machine-journey" :aria-label="messages.lastEdited">
        <div class="time-machine-journey__moment time-machine-journey__moment--older">
          <span>{{ messages.earlier }}</span>
          <time :datetime="older.updatedAt">{{ formatDate(older.updatedAt) }}</time>
        </div>

        <div class="time-machine-journey__track" aria-hidden="true">
          <i></i>
          <span>→</span>
          <i></i>
        </div>

        <div class="time-machine-journey__moment time-machine-journey__moment--newer">
          <span>{{ messages.later }}</span>
          <time :datetime="newer.updatedAt">{{ formatDate(newer.updatedAt) }}</time>
        </div>

        <div class="time-machine-journey__scope">
          <span class="time-machine-journey__scope-label">{{ messages.scope }}</span>
          <span>{{ scopeLabel(older.scope) }}</span>
          <template v-if="scopeChanged">
            <span class="time-machine-journey__scope-arrow" aria-hidden="true">→</span>
            <span>{{ scopeLabel(newer.scope) }}</span>
          </template>
        </div>
      </div>

      <div
        v-if="showRoleSwitch"
        class="time-machine-dashboard__role-switch"
        role="group"
        :aria-label="questionnaireMessages.results.roleSwitchLabel"
      >
        <button
          v-for="role in availableRoles"
          :key="role"
          type="button"
          :class="{ 'is-active': selectedRole === role }"
          :aria-pressed="selectedRole === role"
          @click="selectedRole = role"
        >
          {{ questionnaireMessages.roleLabels[role] }}
        </button>
      </div>
    </div>

    <p
      v-if="selectedRoleNotice"
      class="time-machine-dashboard__scope-notice"
      role="status"
    >
      {{ selectedRoleNotice }}
    </p>

    <div v-if="visibleSections.length" class="time-machine-difference-sections">
      <section
        v-for="section in visibleSections"
        :key="section.id"
        class="time-machine-difference-section"
        :class="[
          `time-machine-difference-section--${section.id}`,
        ]"
      >
        <header class="time-machine-difference-section__heading">
          <h2>{{ section.title }}</h2>
        </header>

        <TimeMachineHardNoChanges
          v-if="section.id === 'hardNo'"
          :changes="section.previewChanges"
          :messages="messages"
          :questionnaire-messages="questionnaireMessages"
        />

        <ol v-else class="time-machine-category-groups">
          <li
            v-for="(group, groupIndex) in section.groups"
            :key="group.categoryId"
          >
            <article
              class="time-machine-category-group"
              :class="[
                `time-machine-category-group--${section.id}`,
                {
                  'time-machine-category-group--image-context': section.id !== 'category'
                    && Boolean(group.visualUrl),
                  'time-machine-category-group--without-visual': !group.visualUrl,
                },
              ]"
              :aria-label="section.id !== 'category' ? group.categoryName : undefined"
            >
              <div
                v-if="group.visualUrl || (section.id === 'category' && group.categoryName)"
                class="time-machine-category-group__identity"
              >
                <figure v-if="group.visualUrl">
                  <img
                    :src="group.visualUrl"
                    alt=""
                    width="320"
                    height="320"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <h3 v-if="section.id === 'category' && group.categoryName">
                  {{ group.categoryName }}
                </h3>
              </div>

              <ol class="time-machine-category-group__changes">
                <li
                  v-for="change in group.changes"
                  :key="`${change.kind}-${change.question.questionId}`"
                >
                  <TimeMachineComparisonRow
                    :change="change"
                    :compact-timeline="usesStateSummary(
                      section.id,
                      groupIndex,
                      section.groups.length,
                    )"
                    :messages="messages"
                    :questionnaire-messages="questionnaireMessages"
                    :show-question-title="section.id !== 'category' || !group.categoryName"
                    :use-category-name-as-title="section.id !== 'category'"
                  />
                </li>
              </ol>
            </article>
          </li>
        </ol>

        <button
          v-if="section.hasMoreChanges"
          class="time-machine-difference-section__all"
          type="button"
          @click="openAllChanges(section.id)"
        >
          {{ messages.viewAll(section.changes.length) }}
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>

    <p v-else-if="!selectedRoleNotice" class="time-machine-dashboard__empty">
      {{ showRoleSwitch ? messages.noChangesForRole : messages.noChanges }}
    </p>

  </section>

  <dialog
    ref="allChangesDialog"
    class="time-machine-all-changes"
    aria-labelledby="time-machine-all-changes-title"
    @click="closeDialogOnBackdrop"
  >
    <article v-if="activeSection">
      <header>
        <h2 id="time-machine-all-changes-title">{{ activeSection.title }}</h2>
        <button type="button" :aria-label="messages.close" @click="closeAllChanges">×</button>
      </header>

      <TimeMachineHardNoChanges
        v-if="activeSection.id === 'hardNo'"
        class="time-machine-hard-no--all"
        :changes="activeSection.changes"
        :messages="messages"
        :questionnaire-messages="questionnaireMessages"
      />

      <ol v-else class="time-machine-category-groups time-machine-category-groups--all">
        <li v-for="group in activeSectionGroups" :key="group.categoryId">
          <article
            class="time-machine-category-group"
            :class="[
              `time-machine-category-group--${activeSection.id}`,
              {
                'time-machine-category-group--image-context': activeSection.id !== 'category'
                  && Boolean(group.visualUrl),
                'time-machine-category-group--without-visual': !group.visualUrl,
              },
            ]"
            :aria-label="activeSection.id !== 'category' ? group.categoryName : undefined"
          >
            <div
              v-if="group.visualUrl || (activeSection.id === 'category' && group.categoryName)"
              class="time-machine-category-group__identity"
            >
              <figure v-if="group.visualUrl">
                <img
                  :src="group.visualUrl"
                  alt=""
                  width="320"
                  height="320"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <h3 v-if="activeSection.id === 'category' && group.categoryName">
                {{ group.categoryName }}
              </h3>
            </div>

            <ol class="time-machine-category-group__changes">
              <li
                v-for="change in group.changes"
                :key="`${change.kind}-${change.question.questionId}`"
              >
                <TimeMachineComparisonRow
                  :change="change"
                  :compact-timeline="activeSection.id === 'category'
                    || activeSection.id === 'detail'"
                  :messages="messages"
                  :questionnaire-messages="questionnaireMessages"
                  :show-question-title="activeSection.id !== 'category' || !group.categoryName"
                  :use-category-name-as-title="activeSection.id !== 'category'"
                />
              </li>
            </ol>
          </article>
        </li>
      </ol>
    </article>
  </dialog>
</template>
