import { describe, expect, it } from 'vitest';
import {
  allCategoryQuestionDefinitions,
  allDetailQuestionDefinitions,
  allQuestionDefinitions,
  getDetailQuestionsForCategory,
  getCategoryQuestionsForScope,
  getQuestionBankCounts,
  questionBank,
} from './questionBank';
import { localizeQuestionBank } from './locales';

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
      detailQuestionCount: 294,
    });
    expect(getQuestionBankCounts('all')).toEqual({
      categoryCount: 40,
      detailQuestionCount: 588,
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

  it('provides each category as one reusable question plus its directional details', () => {
    const category = questionBank.categories[0];

    expect(category).toBeDefined();
    expect(getDetailQuestionsForCategory(category!, 'active')).toHaveLength(category!.itemCount);
    expect(getDetailQuestionsForCategory(category!, 'active')[0]).toMatchObject({
      id: `detail.${category!.categoryId}.${category!.detailItems[0]!.detailId}.active`,
      level: 'detail',
    });
    expect(allDetailQuestionDefinitions).toHaveLength(588);
    expect(allQuestionDefinitions).toHaveLength(628);
  });

  it('uses unique stable ASCII detail IDs instead of source-language labels', () => {
    const detailIds = questionBank.categories.flatMap((category) =>
      category.detailItems.map((item) => item.detailId),
    );

    expect(detailIds).toHaveLength(294);
    expect(new Set(detailIds).size).toBe(294);
    expect(detailIds.every((detailId) => /^detail-[a-z_]+-[a-z0-9]+$/.test(detailId))).toBe(true);
  });

  it('keeps the shared spreadsheet label as metadata while exposing directional titles', () => {
    const painStimulation = questionBank.categories.find(
      (category) => category.categoryId === 'pain_stimulation',
    );
    const lightBiting = painStimulation?.detailItems.find(
      (item) => item.detailId === 'detail-pain_stimulation-1jrzewy',
    );

    expect(lightBiting).toMatchObject({
      sourceLabel: '輕度咬人/被咬',
      roles: {
        active: { title: '輕度咬對方造成疼痛刺激' },
        passive: { title: '被對方輕度咬造成疼痛刺激' },
      },
    });
  });
});

describe('question-bank translations', () => {
  it.each(['zh-Hans', 'ja', 'en'] as const)('covers every effective source row in %s', (locale) => {
    const localized = localizeQuestionBank(questionBank, locale);

    expect(localized.categories).toHaveLength(questionBank.categories.length);
    expect(localized.categories.reduce((total, category) => total + category.detailItems.length, 0)).toBe(294);

    localized.categories.forEach((category, categoryIndex) => {
      const sourceCategory = questionBank.categories[categoryIndex];
      expect(category.detailItems).toHaveLength(sourceCategory?.detailItems.length ?? -1);
      expect(category.name.trim()).not.toBe('');
      expect(category.roles.active.description.trim()).not.toBe('');
      expect(category.roles.passive.description.trim()).not.toBe('');

      category.detailItems.forEach((item) => {
        expect(item.sourceLabel.trim()).not.toBe('');
        expect(item.roles.active.title.trim()).not.toBe('');
        expect(item.roles.passive.title.trim()).not.toBe('');
        expect(item.roles.active.description.trim()).not.toBe('');
        expect(item.roles.passive.description.trim()).not.toBe('');
      });
    });
  });
});
