import { describe, expect, it } from 'vitest';
import { answerSecretFileQuestion } from './answers';
import { createSecretFile, reconcileSecretFileQuestions } from './secretFile';
import { calculateProgressPercent, getSecretFileProgress } from './progress';
import type { QuestionDefinition } from './types';

const createdAt = '2026-07-10T06:00:00.000Z';
const questions: readonly QuestionDefinition[] = [
  { id: 'category.impact.active', level: 'category', role: 'active' },
  { id: 'detail.impact.hand.active', level: 'detail', role: 'active' },
  { id: 'detail.impact.hand.passive', level: 'detail', role: 'passive' },
];

function createActiveOnlyFile() {
  return createSecretFile({
    bankSchemaVersion: 1,
    bankVersion: '2026-07-08',
    createdAt,
    fileId: 'local_test-file-1234',
    profileName: '兔子',
    questions,
    scope: 'activeOnly',
  });
}

describe('secret-file domain', () => {
  it('rounds progress down so incomplete work never displays as 100 percent', () => {
    expect(calculateProgressPercent(0, 0)).toBe(0);
    expect(calculateProgressPercent(1, 3)).toBe(33);
    expect(calculateProgressPercent(198, 199)).toBe(99);
    expect(calculateProgressPercent(199, 199)).toBe(100);
  });

  it('initializes unanswered and filteredOut states from the selected scope', () => {
    const secretFile = createActiveOnlyFile();

    expect(secretFile.answers['category.impact.active']).toEqual({ state: 'unanswered' });
    expect(secretFile.answers['detail.impact.hand.active']).toEqual({ state: 'unanswered' });
    expect(secretFile.answers['detail.impact.hand.passive']).toEqual({ state: 'filteredOut' });
    expect(getSecretFileProgress(secretFile, questions)).toEqual({
      answered: 0,
      percent: 0,
      total: 2,
      unanswered: 2,
    });
  });

  it('allows seeDetails for a category but rejects it for a detail question', () => {
    const secretFile = createActiveOnlyFile();
    const answeredCategory = answerSecretFileQuestion(
      secretFile,
      questions[0],
      { experience: 'seeDetails', note: '', preference: 'seeDetails' },
      '2026-07-10T06:01:00.000Z',
    );

    expect(answeredCategory.answers['category.impact.active']).toEqual({
      experience: 'seeDetails',
      note: '',
      preference: 'seeDetails',
      state: 'answered',
    });
    expect(() =>
      answerSecretFileQuestion(
        secretFile,
        questions[1],
        { experience: 'seeDetails', note: '', preference: 'neutral' },
      ),
    ).toThrow('Only category questions');
  });

  it('preserves the last-edited time when the saved answer is unchanged', () => {
    const firstUpdatedAt = '2026-07-10T06:01:00.000Z';
    const answer = { experience: 'some', note: '目前先記下這個感覺', preference: 'like' } as const;
    const answered = answerSecretFileQuestion(
      createActiveOnlyFile(),
      questions[1],
      answer,
      firstUpdatedAt,
    );
    const unchanged = answerSecretFileQuestion(
      answered,
      questions[1],
      answer,
      '2026-07-10T06:02:00.000Z',
    );

    expect(unchanged).toBe(answered);
    expect(unchanged.updatedAt).toBe(firstUpdatedAt);
  });

  it('preserves old answers and only appends newly introduced questions', () => {
    const secretFile = answerSecretFileQuestion(
      createActiveOnlyFile(),
      questions[1],
      { experience: 'some', note: '目前先記下這個感覺', preference: 'like' },
      '2026-07-10T06:01:00.000Z',
    );
    const newQuestion: QuestionDefinition = {
      id: 'detail.impact.paddle.active',
      level: 'detail',
      role: 'active',
    };
    const reconciled = reconcileSecretFileQuestions(
      secretFile,
      [...questions, newQuestion],
    );

    expect(reconciled.answers['detail.impact.hand.active']).toEqual(
      secretFile.answers['detail.impact.hand.active'],
    );
    expect(reconciled.answers[newQuestion.id]).toEqual({ state: 'unanswered' });
    expect(reconciled.updatedAt).toBe(secretFile.updatedAt);
  });

  it('does not change or rewrite a file when its question set is already current', () => {
    const secretFile = createActiveOnlyFile();
    const reconciled = reconcileSecretFileQuestions(secretFile, questions);

    expect(reconciled).toBe(secretFile);
    expect(reconciled.updatedAt).toBe(createdAt);
  });
});
