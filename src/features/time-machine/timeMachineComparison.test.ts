import { describe, expect, it } from 'vitest';
import { questionBank } from '../question-bank';
import type { SecretFile, SecretFileAnswer, SecretFileScope } from '../secret-file';
import { compareSecretFiles } from './timeMachineComparison';

const categoryId = 'category.impact_spanking.active';
const detailId = 'detail.impact_spanking.detail-impact_spanking-1qzzr10.active';
const secondDetailId = 'detail.impact_spanking.detail-impact_spanking-gwssxu.active';
const thirdDetailId = 'detail.impact_spanking.detail-impact_spanking-1uy95nk.active';
const fourthDetailId = 'detail.impact_spanking.detail-impact_spanking-i4vf80.active';

function answered(
  preference: 'hardNo' | 'neutral' | 'like' | 'love',
  note = '',
): SecretFileAnswer {
  return {
    experience: 'some',
    note,
    preference,
    state: 'answered',
  };
}

function createFile(
  fileId: string,
  answers: Record<string, SecretFileAnswer>,
  options: {
    scope?: SecretFileScope;
    spotlight?: string[];
    updatedAt?: string;
  } = {},
): SecretFile {
  const updatedAt = options.updatedAt ?? '2026-07-18T08:00:00.000Z';

  return {
    answers,
    createdAt: updatedAt,
    fileId,
    profileName: '兔子',
    questionBank: { bankVersion: questionBank.bankVersion, schemaVersion: questionBank.schemaVersion },
    schemaVersion: 2,
    scope: options.scope ?? 'activeOnly',
    spotlight: {
      active: { selectedQuestionIds: options.spotlight ?? [] },
      passive: { selectedQuestionIds: [] },
    },
    updatedAt,
  };
}

describe('time-machine file comparison', () => {
  it('compares category and detail answers only when both files answered the question', () => {
    const older = createFile('local_older_file', {
      [categoryId]: answered('neutral'),
      [detailId]: answered('neutral'),
      [secondDetailId]: { state: 'unanswered' },
      'detail.whipping.detail-whipping-9q3jnv.passive': { state: 'filteredOut' },
    });
    const newer = createFile('local_newer_file', {
      [categoryId]: answered('like'),
      [detailId]: answered('love'),
      [secondDetailId]: answered('love'),
      'detail.whipping.detail-whipping-9q3jnv.passive': { state: 'unanswered' },
    }, { scope: 'all' });

    const comparison = compareSecretFiles(older, newer, questionBank);

    expect(comparison.category.map((change) => change.question.questionId)).toEqual([categoryId]);
    expect(comparison.detail.map((change) => change.question.questionId)).toEqual([detailId]);
    expect(comparison.hardNo).toEqual([]);
  });

  it('extracts hard-no transitions without repeating them in category or detail sections', () => {
    const older = createFile('local_older_file', {
      [categoryId]: answered('hardNo', '以前不接受'),
      [detailId]: answered('like'),
      [secondDetailId]: answered('hardNo'),
    });
    const newer = createFile('local_newer_file', {
      [categoryId]: answered('neutral', '現在需要逐次確認'),
      [detailId]: answered('hardNo', '現在不接受'),
      [secondDetailId]: answered('hardNo', '底線不變，只更新備註'),
    });

    const comparison = compareSecretFiles(older, newer, questionBank);

    expect(comparison.hardNo.map((change) => change.question.questionId)).toEqual([
      categoryId,
      detailId,
    ]);
    expect(comparison.category).toEqual([]);
    expect(comparison.detail.map((change) => change.question.questionId)).toEqual([secondDetailId]);
  });

  it('does not compare any questions from a direction absent in either file scope', () => {
    const passiveCategoryId = 'category.impact_spanking.passive';
    const passiveDetailId = 'detail.impact_spanking.detail-impact_spanking-1qzzr10.passive';
    const older = createFile('local_older_file', {
      [passiveCategoryId]: answered('hardNo'),
      [passiveDetailId]: answered('love'),
    }, { scope: 'all' });
    const newer = createFile('local_newer_file', {
      [passiveCategoryId]: { state: 'filteredOut' },
      [passiveDetailId]: { state: 'filteredOut' },
    }, { scope: 'activeOnly' });

    const comparison = compareSecretFiles(older, newer, questionBank);

    expect(comparison).toEqual({
      category: [],
      detail: [],
      hardNo: [],
      spotlight: [],
    });
  });

  it('excludes unanswered, filtered-out, and missing counterparts even for hard-no answers', () => {
    const older = createFile('local_older_file', {
      [categoryId]: answered('hardNo'),
      [detailId]: answered('hardNo'),
      [secondDetailId]: answered('hardNo'),
    });
    const newer = createFile('local_newer_file', {
      [categoryId]: { state: 'unanswered' },
      [detailId]: { state: 'filteredOut' },
    });

    expect(compareSecretFiles(older, newer, questionBank)).toEqual({
      category: [],
      detail: [],
      hardNo: [],
      spotlight: [],
    });
  });

  it('orders spotlight changes by first place, additions, rises, falls, then removals', () => {
    const comparableAnswers = {
      [categoryId]: answered('like'),
      [detailId]: answered('like'),
      [secondDetailId]: answered('like'),
      [thirdDetailId]: answered('like'),
      [fourthDetailId]: answered('like'),
    };
    const older = createFile('local_older_file', comparableAnswers, {
      spotlight: [categoryId, detailId, secondDetailId, thirdDetailId],
    });
    const newer = createFile('local_newer_file', comparableAnswers, {
      spotlight: [secondDetailId, thirdDetailId, fourthDetailId, categoryId],
    });

    const comparison = compareSecretFiles(older, newer, questionBank);

    expect(comparison.spotlight.map(({ question, olderRank, newerRank }) => ({
      newerRank,
      olderRank,
      questionId: question.questionId,
    }))).toEqual([
      { newerRank: 1, olderRank: 3, questionId: secondDetailId },
      { newerRank: 3, olderRank: null, questionId: fourthDetailId },
      { newerRank: 2, olderRank: 4, questionId: thirdDetailId },
      { newerRank: 4, olderRank: 1, questionId: categoryId },
      { newerRank: null, olderRank: 2, questionId: detailId },
    ]);
  });

  it('normalizes spotlight ranks after removing questions not answered in both files', () => {
    const older = createFile('local_older_file', {
      [categoryId]: answered('like'),
      [detailId]: answered('love'),
    }, {
      spotlight: [categoryId, detailId],
    });
    const newer = createFile('local_newer_file', {
      [categoryId]: { state: 'unanswered' },
      [detailId]: answered('love'),
    }, {
      spotlight: [detailId],
    });

    expect(compareSecretFiles(older, newer, questionBank).spotlight).toEqual([]);
  });
});
