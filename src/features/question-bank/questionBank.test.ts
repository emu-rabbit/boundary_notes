import { describe, expect, it } from 'vitest';
import {
  allCategoryQuestionDefinitions,
  getCategoryQuestionsForScope,
  getQuestionBankCounts,
  questionBank,
} from './questionBank';

describe('first-phase question bank', () => {
  it('keeps the live spreadsheet totals and places other last', () => {
    expect(questionBank.categories).toHaveLength(21);
    expect(questionBank.categories[questionBank.categories.length - 1]).toMatchObject({
      categoryId: 'other',
      includeInCategoryRound: false,
      itemCount: 19,
    });
    expect(getQuestionBankCounts('activeOnly')).toEqual({
      categoryCount: 20,
      detailQuestionCount: 295,
    });
    expect(getQuestionBankCounts('all')).toEqual({
      categoryCount: 40,
      detailQuestionCount: 590,
    });
  });

  it('creates stable directional category questions without other', () => {
    expect(allCategoryQuestionDefinitions).toHaveLength(40);
    expect(getCategoryQuestionsForScope('activeOnly')).toHaveLength(20);
    expect(getCategoryQuestionsForScope('passiveOnly')).toHaveLength(20);
    expect(getCategoryQuestionsForScope('all')).toHaveLength(40);
    expect(getCategoryQuestionsForScope('all').slice(0, 20).every((question) => question.role === 'active')).toBe(true);
    expect(getCategoryQuestionsForScope('all').slice(20).every((question) => question.role === 'passive')).toBe(true);
    expect(allCategoryQuestionDefinitions.some((question) => question.id.includes('other'))).toBe(false);
  });
});
