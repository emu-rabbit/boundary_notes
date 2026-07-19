<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useAppShell } from '../app/useAppShell';
import { useSecretFileTitle } from '../app/useSecretFileTitle';
import BrandMark from '../components/BrandMark.vue';
import RabbitScene from '../components/RabbitScene.vue';
import {
  listLinkedCloudShares,
  loadCloudSecretFile,
  type LinkedCloudShare,
} from '../features/cloud-sharing';
import { useSecretFileStore } from '../features/secret-file/application/useSecretFileStore';
import type { SecretFile, SecretFileScope } from '../features/secret-file';
import {
  rabbitPoseUrls,
  warmTimeMachineRabbitAssets,
  type RabbitPose,
} from '../features/story/rabbitAssets';
import {
  formatTimeMachineDate,
  getTimeMachineMessages,
} from '../features/time-machine/timeMachineMessages';
import { getTimeMachineComparisonMessages } from '../features/time-machine/timeMachineComparisonMessages';
import TimeMachineDashboard from '../features/time-machine/TimeMachineDashboard.vue';
import {
  getCalendarDayGap,
  getProfileBranch,
  getScopeBranch,
  orderTimeMachineFiles,
  type OrderedTimeMachineFiles,
} from '../features/time-machine/timeMachineStory';

type SelectionPosition = 'first' | 'second';

type TimeMachineStep =
  | 'select'
  | 'confirm'
  | 'sameProfile'
  | 'sameGood'
  | 'sameOkay'
  | 'sameBad'
  | 'differentProfile'
  | 'newName'
  | 'namePast'
  | 'stole'
  | 'nameTrash'
  | 'arrested'
  | 'sameActive'
  | 'samePassive'
  | 'sameAll'
  | 'singleToAll'
  | 'singleToSingle'
  | 'storyYes'
  | 'storyNo'
  | 'allToSingle'
  | 'allToSingleStop'
  | 'allToSingleFocus'
  | 'conclusion';

type TimeMachineAction =
  | 'confirmSelection'
  | 'profileBranch'
  | 'returnSelection'
  | 'returnSelectionClear'
  | 'sameGood'
  | 'sameOkay'
  | 'sameBad'
  | 'newName'
  | 'namePast'
  | 'stole'
  | 'nameTrash'
  | 'arrested'
  | 'scopeBranch'
  | 'conclusion'
  | 'storyYes'
  | 'storyNo'
  | 'allToSingleStop'
  | 'allToSingleFocus'
  | 'depart';

interface DialogueChoice {
  action: TimeMachineAction;
  label: string;
  primary?: boolean;
}

interface DialogueContent {
  choices: DialogueChoice[];
  lines: string[];
  pose: RabbitPose;
  system?: boolean;
}

interface TimeMachineFileOption {
  fileId: string;
  key: string;
  profileName: string | null;
  scope: SecretFileScope | null;
  source: 'cloud' | 'local';
  timestamp: string | null;
}

const store = useSecretFileStore();
const {
  appTitle,
  documentTitle,
  locale,
  messages: appMessages,
  navigate,
} = useAppShell();
const messages = computed(() => getTimeMachineMessages(locale.value));
const comparisonMessages = computed(() => getTimeMachineComparisonMessages(locale.value));
const phase = ref<'story' | 'dashboard'>('story');
const step = ref<TimeMachineStep>('select');
const firstFileId = ref<string | null>(null);
const secondFileId = ref<string | null>(null);
const comparison = ref<OrderedTimeMachineFiles | null>(null);
const linkedCloudFiles = ref<LinkedCloudShare[]>([]);
const pickerDialog = ref<HTMLDialogElement | null>(null);
const pickerList = ref<HTMLElement | null>(null);
const storyPanel = ref<HTMLElement | null>(null);
const pickerPosition = ref<SelectionPosition>('first');
const selectionError = ref('');
const selectionLoading = ref(false);
const comparisonProfileName = computed(() => comparison.value?.newer.profileName ?? '');
const {
  documentTitle: comparisonDocumentTitle,
  titleParts: comparisonTitleParts,
} = useSecretFileTitle(
  comparisonProfileName,
  appMessages,
);

const selectableFiles = computed<TimeMachineFileOption[]>(() => [
  ...store.files.map((file) => ({
    fileId: file.fileId,
    key: `local:${file.fileId}`,
    profileName: file.profileName,
    scope: file.scope,
    source: 'local' as const,
    timestamp: file.updatedAt,
  })),
  ...linkedCloudFiles.value.map((file) => ({
    fileId: file.shareId,
    key: `cloud:${file.shareId}`,
    profileName: file.profileName,
    scope: file.scope,
    source: 'cloud' as const,
    timestamp: file.createdAt,
  })),
].sort((left, right) => Date.parse(right.timestamp ?? '') - Date.parse(left.timestamp ?? '')));
const showFileSources = computed(() => new Set(
  selectableFiles.value.map((file) => file.source),
).size > 1);
const firstFile = computed(() => findOption(firstFileId.value));
const secondFile = computed(() => findOption(secondFileId.value));
const selectionSlots = computed(() => [
  { file: firstFile.value, label: messages.value.picker.firstFile, position: 'first' as const },
  { file: secondFile.value, label: messages.value.picker.secondFile, position: 'second' as const },
]);
const pickerPositionLabel = computed(() => pickerPosition.value === 'first'
  ? messages.value.picker.firstFile
  : messages.value.picker.secondFile);
const unavailableFileId = computed(() => pickerPosition.value === 'first'
  ? secondFileId.value
  : firstFileId.value);
const gap = computed(() => comparison.value
  ? messages.value.timeGap(getCalendarDayGap(comparison.value))
  : messages.value.timeGap(0));
const olderScope = computed(() => comparison.value
  ? messages.value.scopeLabel(comparison.value.older.scope)
  : '');
const newerScope = computed(() => comparison.value
  ? messages.value.scopeLabel(comparison.value.newer.scope)
  : '');
const excludedScope = computed(() => {
  const scope = comparison.value?.newer.scope;

  if (scope === 'activeOnly') return messages.value.scopeLabel('passiveOnly');
  if (scope === 'passiveOnly') return messages.value.scopeLabel('activeOnly');
  return '';
});

function findOption(fileKey: string | null): TimeMachineFileOption | null {
  return selectableFiles.value.find((file) => file.key === fileKey) ?? null;
}

function formatDate(value: string): string {
  return formatTimeMachineDate(locale.value, value);
}

function choice(label: string, action: TimeMachineAction, primary = false): DialogueChoice {
  return { action, label, primary };
}

function content(
  lines: string[],
  choices: DialogueChoice[],
  pose: RabbitPose = 'timeMachineFiles',
  system = false,
): DialogueContent {
  return { choices, lines, pose, system };
}

const activeDialogue = computed<DialogueContent>(() => {
  const copy = messages.value;
  const files = comparison.value;

  switch (step.value) {
    case 'select':
      return content([copy.story.select], [], 'timeMachineFiles');
    case 'confirm':
      return content([
        copy.story.confirm(
          formatDate(files?.older.updatedAt ?? ''),
          formatDate(files?.newer.updatedAt ?? ''),
          gap.value,
        ),
      ], [
        choice(copy.choices.confirmReady, 'profileBranch', true),
        choice(copy.choices.confirmWrong, 'returnSelection'),
      ], 'thinking');
    case 'sameProfile':
      return content(
        [copy.story.sameProfile(files?.newer.profileName ?? '', gap.value)],
        [
          choice(copy.choices.great, 'sameGood'),
          choice(copy.choices.okay, 'sameOkay'),
          choice(copy.choices.notGood, 'sameBad'),
        ],
        'questioning',
      );
    case 'sameGood':
      return content(
        [copy.story.sameGood],
        [choice(copy.choices.proud, 'scopeBranch', true)],
        'timeMachineProud',
      );
    case 'sameOkay':
      return content(
        [copy.story.sameOkay],
        [choice(copy.choices.maybe, 'scopeBranch', true)],
        'storyGreeting',
      );
    case 'sameBad':
      return content(
        [copy.story.sameBad],
        [choice(copy.choices.hug, 'scopeBranch', true)],
        'timeMachineHug',
      );
    case 'differentProfile':
      return content([copy.story.differentProfile], [
        choice(copy.choices.preferNewName, 'newName'),
        choice(copy.choices.oldNamePast(files?.older.profileName ?? ''), 'namePast'),
        choice(copy.choices.stoleFile, 'stole'),
      ]);
    case 'newName':
      return content([
        copy.story.newName(files?.newer.profileName ?? ''),
      ], [choice(copy.choices.yes, 'scopeBranch', true)], 'naming');
    case 'namePast':
      return content([copy.story.namePast], [
        choice(copy.choices.commemorate, 'scopeBranch'),
        choice(copy.choices.trash, 'nameTrash'),
      ], 'thinking');
    case 'stole':
      return content(
        [copy.story.stole],
        [choice(copy.choices.confused, 'arrested', true)],
        'timeMachinePolice',
      );
    case 'nameTrash':
      return content(
        [copy.story.nameTrash],
        [choice(copy.choices.giggle, 'scopeBranch', true)],
        'timeMachineGiggle',
      );
    case 'arrested':
      return content(
        [copy.story.systemArrested],
        [choice(copy.choices.crying, 'returnSelectionClear', true)],
        'timeMachinePolice',
        true,
      );
    case 'sameActive':
      return content(
        [copy.story.sameActive],
        [choice(copy.choices.exactly, 'conclusion', true)],
        'folder',
      );
    case 'samePassive':
      return content(
        [copy.story.samePassive],
        [choice(copy.choices.shy, 'conclusion', true)],
        'naming',
      );
    case 'sameAll':
      return content([copy.story.sameAll], [choice(copy.choices.bothAttractive, 'conclusion', true)]);
    case 'singleToAll':
      return content([copy.story.singleToAll(olderScope.value)], [
        choice(copy.choices.overwhelmed, 'conclusion'),
        choice(copy.choices.easy, 'conclusion'),
        choice(copy.choices.doubleJoy, 'conclusion'),
      ], 'timeMachineOverwhelmed');
    case 'singleToSingle':
      return content([copy.story.singleToSingle(olderScope.value, newerScope.value)], [
        choice(copy.choices.tellStory, 'storyYes'),
        choice(copy.choices.hardToSay, 'storyNo'),
      ], 'questioning');
    case 'storyYes':
      return content(
        [copy.story.grandmother],
        [choice(copy.choices.greatAnswer, 'conclusion', true)],
        'timeMachineStory',
      );
    case 'storyNo':
      return content(
        [copy.story.storyPrivate],
        [choice(copy.choices.secretAnswer, 'conclusion', true)],
        'thinking',
      );
    case 'allToSingle':
      return content([copy.story.allToSingle(newerScope.value)], [
        choice(copy.choices.stopLooking(excludedScope.value), 'allToSingleStop'),
        choice(copy.choices.focusOn(newerScope.value), 'allToSingleFocus'),
      ], 'folder');
    case 'allToSingleStop':
      return content(
        [copy.story.allToSingleStop],
        [choice(copy.choices.okayAnswer, 'conclusion', true)],
        'thinking',
      );
    case 'allToSingleFocus':
      return content(
        [copy.story.allToSingleFocus],
        [choice(copy.choices.okayAnswer, 'conclusion', true)],
        'folder',
      );
    case 'conclusion':
      return content(copy.story.conclusion(gap.value), [
        choice(copy.choices.departReady, 'depart', true),
        choice(copy.choices.notReady.replace('。', '…'), 'returnSelection'),
      ], 'timeMachineDepart');
  }
});

const activeRabbitUrl = computed(() => rabbitPoseUrls[activeDialogue.value.pose]);
const speakerName = computed(() => activeDialogue.value.system
  ? messages.value.systemSpeakerName
  : messages.value.speakerName);

function openPicker(position: SelectionPosition): void {
  if (selectableFiles.value.length < 2) return;

  pickerPosition.value = position;
  selectionError.value = '';
  pickerDialog.value?.showModal();

  void nextTick(() => {
    const list = pickerList.value;
    if (!list) return;

    const selectedKey = position === 'first' ? firstFileId.value : secondFileId.value;
    const selectedOption = [...list.querySelectorAll<HTMLButtonElement>('[data-file-key]')]
      .find((option) => option.dataset.fileKey === selectedKey);

    if (selectedOption) {
      selectedOption.scrollIntoView({ block: 'nearest' });
    } else {
      list.scrollTop = 0;
    }
  });
}

function selectFile(fileKey: string): void {
  if (fileKey === unavailableFileId.value) return;

  if (pickerPosition.value === 'first') {
    firstFileId.value = fileKey;
  } else {
    secondFileId.value = fileKey;
  }

  selectionError.value = '';
  pickerDialog.value?.close();
}

function closePickerOnBackdrop(event: MouseEvent): void {
  if (event.target === event.currentTarget) pickerDialog.value?.close();
}

async function readSelectedFile(option: TimeMachineFileOption): Promise<SecretFile | null> {
  if (option.source === 'local') return store.read(option.fileId);

  return (await loadCloudSecretFile(option.fileId)).secretFile;
}

async function confirmSelection(): Promise<void> {
  if (!firstFileId.value || !secondFileId.value || firstFileId.value === secondFileId.value) {
    selectionError.value = messages.value.picker.selectionRequired;
    return;
  }

  const firstOption = findOption(firstFileId.value);
  const secondOption = findOption(secondFileId.value);

  if (!firstOption || !secondOption) {
    store.refresh();
    selectionError.value = messages.value.picker.loadFailed;
    return;
  }

  selectionLoading.value = true;
  selectionError.value = '';

  try {
    const [first, second] = await Promise.all([
      readSelectedFile(firstOption),
      readSelectedFile(secondOption),
    ]);

    if (!first || !second) throw new Error('The selected time-machine file is unavailable.');

    comparison.value = orderTimeMachineFiles(first, second);
    step.value = 'confirm';
  } catch {
    store.refresh();
    linkedCloudFiles.value = listLinkedCloudShares();
    selectionError.value = messages.value.picker.loadFailed;
  } finally {
    selectionLoading.value = false;
  }
}

function goToProfileBranch(): void {
  if (comparison.value) step.value = getProfileBranch(comparison.value);
}

function goToScopeBranch(): void {
  if (comparison.value) step.value = getScopeBranch(comparison.value);
}

function returnToSelection(clearSelection = false): void {
  phase.value = 'story';
  step.value = 'select';
  comparison.value = null;
  selectionError.value = '';

  if (clearSelection) {
    firstFileId.value = null;
    secondFileId.value = null;
  }

  void nextTick(() => {
    window.scrollTo({ left: 0, top: 0 });
    storyPanel.value?.focus({ preventScroll: true });
  });
}

function showDashboard(): void {
  if (!comparison.value) return;

  phase.value = 'dashboard';
  void nextTick(() => window.scrollTo({ left: 0, top: 0 }));
}

function handleAction(action: TimeMachineAction): void {
  const directSteps: Partial<Record<TimeMachineAction, TimeMachineStep>> = {
    sameGood: 'sameGood',
    sameOkay: 'sameOkay',
    sameBad: 'sameBad',
    newName: 'newName',
    namePast: 'namePast',
    stole: 'stole',
    nameTrash: 'nameTrash',
    arrested: 'arrested',
    conclusion: 'conclusion',
    storyYes: 'storyYes',
    storyNo: 'storyNo',
    allToSingleStop: 'allToSingleStop',
    allToSingleFocus: 'allToSingleFocus',
  };

  if (directSteps[action]) {
    step.value = directSteps[action];
    return;
  }

  if (action === 'confirmSelection') void confirmSelection();
  if (action === 'profileBranch') goToProfileBranch();
  if (action === 'scopeBranch') goToScopeBranch();
  if (action === 'returnSelection') returnToSelection();
  if (action === 'returnSelectionClear') returnToSelection(true);
  if (action === 'depart') showDashboard();
}

function scopeOf(scope: SecretFileScope | null): string {
  return scope ? messages.value.scopeLabel(scope) : '';
}

function optionName(option: TimeMachineFileOption): string {
  return option.profileName ?? messages.value.picker.cloudFileFallback;
}

function sourceLabel(option: TimeMachineFileOption): string {
  return option.source === 'local'
    ? messages.value.picker.localSource
    : messages.value.picker.cloudSource;
}

onMounted(() => {
  store.refresh();
  linkedCloudFiles.value = listLinkedCloudShares();
  warmTimeMachineRabbitAssets();
  window.scrollTo({ left: 0, top: 0 });
});

watch([phase, comparisonDocumentTitle], ([currentPhase, currentComparisonTitle]) => {
  document.title = currentPhase === 'dashboard'
    ? currentComparisonTitle
    : documentTitle.value;
}, { immediate: true });

onUnmounted(() => {
  document.title = documentTitle.value;
});
</script>

<template>
  <section
    class="story-route time-machine-route"
    :class="{ 'time-machine-route--dashboard': phase === 'dashboard' }"
    data-tone="archive"
  >
    <div class="ambient-grid" aria-hidden="true" />

    <header class="story-header">
      <BrandMark
        :action-label="appMessages.common.backHome"
        :messages="appMessages"
        :title="phase === 'dashboard' ? appMessages.common.backHome : appTitle"
        @restart="navigate('home')"
      />

      <button
        v-if="phase === 'dashboard'"
        class="time-machine-dashboard__reset"
        type="button"
        @click="returnToSelection()"
      >
        <span aria-hidden="true">↺</span>
        {{ comparisonMessages.compareAgain }}
      </button>
    </header>

    <TimeMachineDashboard
      v-if="phase === 'dashboard' && comparison"
      :locale="locale"
      :newer="comparison.newer"
      :older="comparison.older"
      :title-parts="comparisonTitleParts"
    />

    <div v-else class="story-layout time-machine-layout">
      <RabbitScene
        :animation-key="step"
        :image-url="activeRabbitUrl"
        :lamp-lit="step === 'confirm' || step === 'conclusion'"
        :pose="activeDialogue.pose"
      />

      <Transition name="dialogue" mode="out-in">
        <article
          :key="step"
          ref="storyPanel"
          class="dialogue-panel time-machine-panel"
          tabindex="-1"
        >
          <div class="speaker-name">{{ speakerName }}</div>

          <div v-if="step === 'select'" class="dialogue-copy time-machine-selection-copy">
            <p class="rabbit-speech">{{ activeDialogue.lines[0] }}</p>

            <p v-if="selectableFiles.length < 2" class="time-machine-empty-message">
              {{ messages.picker.needTwoFiles }}
            </p>

            <template v-else>
              <div class="time-machine-selection-grid">
                <button
                  v-for="slot in selectionSlots"
                  :key="slot.position"
                  class="time-machine-file-slot"
                  :class="{ 'time-machine-file-slot--selected': slot.file }"
                  type="button"
                  :disabled="selectableFiles.length < 2 || selectionLoading"
                  @click="openPicker(slot.position)"
                >
                  <span class="time-machine-file-slot__label">
                    {{ slot.label }}
                  </span>
                  <template v-if="slot.file">
                    <span class="time-machine-file-slot__source">{{ sourceLabel(slot.file) }}</span>
                    <strong>{{ optionName(slot.file) }}</strong>
                    <time v-if="slot.file.timestamp" :datetime="slot.file.timestamp">
                      {{ formatDate(slot.file.timestamp) }}
                    </time>
                    <small v-if="slot.file.scope">{{ scopeOf(slot.file.scope) }}</small>
                  </template>
                  <template v-else>
                    <span class="time-machine-file-slot__plus" aria-hidden="true">＋</span>
                    <span class="time-machine-file-slot__action">{{ messages.picker.chooseFile }}</span>
                  </template>
                </button>
              </div>

              <p class="time-machine-selection-hint">{{ messages.picker.localOnlyHint }}</p>
              <p v-if="selectionError" class="time-machine-error" role="alert">
                {{ selectionError }}
              </p>

              <button
                class="primary-action time-machine-selection-continue"
                type="button"
                :disabled="!firstFile || !secondFile || selectionLoading"
                @click="handleAction('confirmSelection')"
              >
                {{ selectionLoading ? messages.picker.loading : messages.choices.ready }}
              </button>
            </template>
          </div>

          <div v-else class="dialogue-copy time-machine-dialogue-copy">
            <div
              class="time-machine-lines"
              :class="{ 'time-machine-lines--long': step === 'conclusion' }"
            >
              <p v-for="line in activeDialogue.lines" :key="line" class="rabbit-speech">
                {{ line }}
              </p>
            </div>
            <div class="choice-grid time-machine-choices">
              <button
                v-for="dialogueChoice in activeDialogue.choices"
                :key="`${dialogueChoice.action}-${dialogueChoice.label}`"
                class="choice-button"
                :class="{ 'time-machine-choice--primary': dialogueChoice.primary }"
                type="button"
                @click="handleAction(dialogueChoice.action)"
              >
                {{ dialogueChoice.label }}
              </button>
            </div>
          </div>
        </article>
      </Transition>
    </div>

    <dialog
      v-if="phase === 'story'"
      ref="pickerDialog"
      class="time-machine-picker"
      @click="closePickerOnBackdrop"
    >
      <article>
        <header>
          <div>
            <h2>{{ messages.picker.selectFileTitle(pickerPositionLabel) }}</h2>
          </div>
          <form method="dialog">
            <button type="submit" :aria-label="messages.picker.close">×</button>
          </form>
        </header>

        <div ref="pickerList" class="time-machine-picker-list">
          <button
            v-for="file in selectableFiles"
            :key="file.key"
            class="time-machine-picker-option"
            :data-file-key="file.key"
            :class="{
              'time-machine-picker-option--selected': file.key === (pickerPosition === 'first' ? firstFileId : secondFileId),
            }"
            type="button"
            :disabled="file.key === unavailableFileId"
            @click="selectFile(file.key)"
          >
            <span class="time-machine-picker-option__heading">
              <strong>{{ optionName(file) }}</strong>
              <span
                v-if="showFileSources"
                class="time-machine-picker-option__source"
              >
                {{ sourceLabel(file) }}
              </span>
            </span>

            <span v-if="file.scope || file.timestamp" class="time-machine-picker-option__meta">
              <small v-if="file.scope">{{ scopeOf(file.scope) }}</small>
              <time
                v-if="file.timestamp"
                :datetime="file.timestamp"
                :aria-label="file.source === 'local'
                  ? messages.picker.updatedAt(formatDate(file.timestamp))
                  : messages.picker.cloudUploadedAt(formatDate(file.timestamp))"
              >
                {{ formatDate(file.timestamp) }}
              </time>
            </span>
          </button>
        </div>
      </article>
    </dialog>
  </section>
</template>
