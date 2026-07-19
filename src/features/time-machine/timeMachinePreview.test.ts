import { describe, expect, it } from 'vitest';
import type { TimeMachineAnswerChange } from './timeMachineComparison';
import {
  hasHiddenTimeMachineChanges,
  selectTimeMachinePreviewChanges,
} from './timeMachinePreview';

function hardNoChange(
  questionId: string,
  direction: 'entered' | 'removed',
): TimeMachineAnswerChange {
  return {
    kind: 'answer',
    newerAnswer: {
      experience: 'some',
      note: '',
      preference: direction === 'entered' ? 'hardNo' : 'neutral',
      state: 'answered',
    },
    olderAnswer: {
      experience: 'some',
      note: '',
      preference: direction === 'removed' ? 'hardNo' : 'neutral',
      state: 'answered',
    },
    question: {
      categoryId: 'category.preview.active',
      categoryName: '預覽分類',
      description: '',
      known: true,
      level: 'detail',
      questionId,
      role: 'active',
      title: questionId,
    },
  };
}

describe('time-machine section previews', () => {
  it('applies the hard-no preview limit independently to entered and removed changes', () => {
    const changes = [
      ...Array.from({ length: 5 }, (_, index) => hardNoChange(`entered-${index}`, 'entered')),
      ...Array.from({ length: 3 }, (_, index) => hardNoChange(`removed-${index}`, 'removed')),
    ];

    const preview = selectTimeMachinePreviewChanges('hardNo', changes, 4);

    expect(preview.map((change) => change.question.questionId)).toEqual([
      'entered-0',
      'entered-1',
      'entered-2',
      'entered-3',
      'removed-0',
      'removed-1',
      'removed-2',
    ]);
    expect(hasHiddenTimeMachineChanges('hardNo', changes, 4)).toBe(true);
  });

  it('does not offer a full-list dialog when both hard-no lanes fit their own limit', () => {
    const changes = [
      ...Array.from({ length: 4 }, (_, index) => hardNoChange(`entered-${index}`, 'entered')),
      ...Array.from({ length: 4 }, (_, index) => hardNoChange(`removed-${index}`, 'removed')),
    ];

    expect(selectTimeMachinePreviewChanges('hardNo', changes, 4)).toHaveLength(8);
    expect(hasHiddenTimeMachineChanges('hardNo', changes, 4)).toBe(false);
  });
});
