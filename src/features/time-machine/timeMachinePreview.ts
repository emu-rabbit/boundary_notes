import type {
  TimeMachineAnswerChange,
  TimeMachineComparisonChange,
  TimeMachineComparisonSectionId,
} from './timeMachineComparison';

function isAnswerChange(
  change: TimeMachineComparisonChange,
): change is TimeMachineAnswerChange {
  return change.kind === 'answer';
}

function isHardNoEntered(change: TimeMachineAnswerChange): boolean {
  return change.newerAnswer.preference === 'hardNo';
}

function isHardNoRemoved(change: TimeMachineAnswerChange): boolean {
  return change.olderAnswer.preference === 'hardNo';
}

export function selectTimeMachinePreviewChanges(
  sectionId: TimeMachineComparisonSectionId,
  changes: readonly TimeMachineComparisonChange[],
  limit: number,
): TimeMachineComparisonChange[] {
  if (sectionId !== 'hardNo') return changes.slice(0, limit);

  const answerChanges = changes.filter(isAnswerChange);

  return [
    ...answerChanges.filter(isHardNoEntered).slice(0, limit),
    ...answerChanges.filter(isHardNoRemoved).slice(0, limit),
  ];
}

export function hasHiddenTimeMachineChanges(
  sectionId: TimeMachineComparisonSectionId,
  changes: readonly TimeMachineComparisonChange[],
  limit: number,
): boolean {
  if (sectionId !== 'hardNo') return changes.length > limit;

  const answerChanges = changes.filter(isAnswerChange);

  return answerChanges.filter(isHardNoEntered).length > limit
    || answerChanges.filter(isHardNoRemoved).length > limit;
}
