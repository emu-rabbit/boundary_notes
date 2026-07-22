import { describe, expect, it } from 'vitest';
import {
  allCategoryQuestionDefinitions,
  allDetailQuestionDefinitions,
  allQuestionDefinitions,
  getDetailQuestionsForCategory,
  getCategoryQuestionsForScope,
  getQuestionBankCounts,
  questionBank,
  reconcileSecretFileWithQuestionBank,
} from './questionBank';
import { localizeQuestionBank } from './locales';
import { createSecretFile } from '../secret-file';

describe('first-phase question bank', () => {
  it('keeps the current runtime totals and places other last', () => {
    expect(questionBank.categories).toHaveLength(21);
    expect(questionBank.categories[questionBank.categories.length - 1]).toMatchObject({
      categoryId: 'other',
      includeInCategoryRound: false,
      itemCount: 20,
    });
    expect(getQuestionBankCounts('activeOnly')).toEqual({
      categoryCount: 20,
      detailQuestionCount: 299,
    });
    expect(getQuestionBankCounts('all')).toEqual({
      categoryCount: 40,
      detailQuestionCount: 598,
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
    expect(allDetailQuestionDefinitions).toHaveLength(598);
    expect(allQuestionDefinitions).toHaveLength(638);
  });

  it('uses unique stable ASCII detail IDs instead of source-language labels', () => {
    const detailIds = questionBank.categories.flatMap((category) =>
      category.detailItems.map((item) => item.detailId),
    );

    expect(detailIds).toHaveLength(299);
    expect(new Set(detailIds).size).toBe(299);
    expect(detailIds.every((detailId) => /^detail-[a-z_]+-[a-z0-9]+$/.test(detailId))).toBe(true);
  });

  it('uses compact, direction-correct titles without losing the shared source label', () => {
    const painStimulation = questionBank.categories.find(
      (category) => category.categoryId === 'pain_stimulation',
    );
    const lightBiting = painStimulation?.detailItems.find(
      (item) => item.detailId === 'detail-pain_stimulation-1jrzewy',
    );

    expect(lightBiting).toMatchObject({
      sourceLabel: '輕度咬人/被咬',
      roles: {
        active: { title: '輕度咬人' },
        passive: { title: '輕度被咬' },
      },
    });

    const flogging = questionBank.categories
      .find((category) => category.categoryId === 'whipping')
      ?.detailItems.find((item) => item.detailId === 'detail-whipping-9q3jnv');

    expect(flogging?.roles.active.title).toBe('用散鞭');
    expect(flogging?.roles.passive.title).toBe('用散鞭');
  });

  it('keeps the BDSM-space scenarios between private and public and uses role-aware copy', () => {
    const expectedOrder = {
      enslavement: [
        'detail-enslavement-wgiuuj',
        'detail-enslavement-bdsmspaceleash',
        'detail-enslavement-1654r6x',
      ],
      pet_play: [
        'detail-pet_play-ljh0h7',
        'detail-pet_play-bdsmspaceleash',
        'detail-pet_play-1efmrop',
      ],
      exposure: [
        'detail-exposure-cf5jn6',
        'detail-exposure-bdsmspace',
        'detail-exposure-jg19zi',
      ],
    } as const;

    Object.entries(expectedOrder).forEach(([categoryId, orderedIds]) => {
      const details = questionBank.categories
        .find((category) => category.categoryId === categoryId)
        ?.detailItems ?? [];
      const ids = details.map((item) => item.detailId);
      const positions = orderedIds.map((id) => ids.indexOf(id));

      expect(positions.every((position) => position >= 0)).toBe(true);
      expect(positions[1]).toBe(positions[0]! + 1);
      expect(positions[2]).toBe(positions[1]! + 1);
      expect(details[positions[1]!]!.warning).toBeNull();
    });

    const latex = questionBank.categories
      .find((category) => category.categoryId === 'other')
      ?.detailItems.find((item) => item.detailId === 'detail-other-latexclothing');
    const k9Hood = questionBank.categories
      .find((category) => category.categoryId === 'pet_play')
      ?.detailItems.find((item) => item.detailId === 'detail-pet_play-k9hood');

    expect(latex?.roles.active.description).toContain('自己或對方穿著膠衣');
    expect(latex?.roles.passive.description).toContain('自己或對方穿著膠衣');
    expect(k9Hood?.roles.active.description).toBe('要求對方穿戴 K9 犬奴頭套並與對方互動');
    expect(k9Hood?.roles.passive.description).toBe('穿戴 K9 犬奴頭套並與對方互動');
  });

  it('migrates older files with the new questions without changing prior timestamps', () => {
    const newDetailIds = new Set([
      'detail-enslavement-bdsmspaceleash',
      'detail-pet_play-bdsmspaceleash',
      'detail-pet_play-k9hood',
      'detail-exposure-bdsmspace',
      'detail-other-latexclothing',
    ]);
    const legacyQuestions = allQuestionDefinitions.filter((question) =>
      ![...newDetailIds].some((detailId) => question.id.includes(detailId)),
    );
    const legacy = createSecretFile({
      bankSchemaVersion: 1,
      bankVersion: '2026-07-11',
      createdAt: '2026-07-11T06:14:45.603Z',
      fileId: 'local_legacy-question-bank',
      profileName: '兔子',
      questions: legacyQuestions,
      scope: 'activeOnly',
    });
    const migrated = reconcileSecretFileWithQuestionBank(legacy);

    expect(migrated.updatedAt).toBe(legacy.updatedAt);
    expect(migrated.questionBank.bankVersion).toBe(questionBank.bankVersion);
    expect(migrated.answers['detail.other.detail-other-latexclothing.active']).toEqual({ state: 'unanswered' });
    expect(migrated.answers['detail.other.detail-other-latexclothing.passive']).toEqual({ state: 'filteredOut' });
    expect(Object.keys(migrated.answers)).toHaveLength(allQuestionDefinitions.length);
  });

  it('keeps ambiguous role descriptions neutral and the requested titles direction-free', () => {
    const sexualInteraction = questionBank.categories.find(
      (category) => category.categoryId === 'sexual_interaction',
    );
    const handInteraction = sexualInteraction?.detailItems.find(
      (item) => item.detailId === 'detail-sexual_interaction-1k4ddkr',
    );
    const fistInteraction = sexualInteraction?.detailItems.find(
      (item) => item.detailId === 'detail-sexual_interaction-1g5pujn',
    );
    const multiPartyInteraction = questionBank.categories.find(
      (category) => category.categoryId === 'multi_party_interaction',
    );
    const oneLeaderManyFollowers = multiPartyInteraction?.detailItems.find(
      (item) => item.detailId === 'detail-multi_party_interaction-jy04v5',
    );

    expect(handInteraction?.roles.active.description).toBe('在手交中擔任主導側');
    expect(handInteraction?.roles.passive.description).toBe('在手交中擔任配合側');
    expect(fistInteraction?.roles.active.description).toBe('在拳交中擔任主導側');
    expect(fistInteraction?.roles.passive.description).toBe('在拳交中擔任配合側');
    expect(oneLeaderManyFollowers?.roles.active.title).toBe('一主多奴/寵');
    expect(oneLeaderManyFollowers?.roles.passive.title).toBe('一主多奴/寵');
  });
});

describe('question-bank translations', () => {
  it.each(['zh-Hans', 'ja', 'en'] as const)('covers every effective source row in %s', (locale) => {
    const localized = localizeQuestionBank(questionBank, locale);

    expect(localized.categories).toHaveLength(questionBank.categories.length);
    expect(localized.categories.reduce((total, category) => total + category.detailItems.length, 0)).toBe(299);

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

  it.each([
    ['zh-Hans', '轻度咬人', '轻度被咬', '接受接送', '接送对方'],
    ['ja', '軽い噛みつき', '軽く噛まれる', '送迎を受ける', '相手を送迎する'],
    ['en', 'Light biting', 'Being lightly bitten', 'Receiving a ride', 'Giving a ride'],
  ] as const)('keeps directional short titles natural in %s', (locale, activeBiting, passiveBiting, activeRide, passiveRide) => {
    const localized = localizeQuestionBank(questionBank, locale);
    const biting = localized.categories
      .find((category) => category.categoryId === 'pain_stimulation')
      ?.detailItems.find((item) => item.detailId === 'detail-pain_stimulation-1jrzewy');
    const ride = localized.categories
      .find((category) => category.categoryId === 'service')
      ?.detailItems.find((item) => item.detailId === 'detail-service-1nx0nqc');

    expect(biting?.roles.active.title).toBe(activeBiting);
    expect(biting?.roles.passive.title).toBe(passiveBiting);
    expect(ride?.roles.active.title).toBe(activeRide);
    expect(ride?.roles.passive.title).toBe(passiveRide);
  });

  it.each([
    ['zh-Hant', '老師／學生情境'],
    ['zh-Hans', '老师／学生情境'],
    ['ja', '教師／生徒シナリオ'],
    ['en', 'Teacher–student scenario'],
  ] as const)('keeps the teacher-student role-play title neutral in %s', (locale, title) => {
    const localized = localizeQuestionBank(questionBank, locale);
    const teacherStudent = localized.categories
      .find((category) => category.categoryId === 'role_play')
      ?.detailItems.find((item) => item.detailId === 'detail-role_play-vepd7q');

    expect(teacherStudent?.roles.active.title).toBe(title);
    expect(teacherStudent?.roles.passive.title).toBe(title);
  });

  it.each([
    ['zh-Hant', '幫寵物洗澡／梳毛', '接受洗澡／梳毛'],
    ['zh-Hans', '帮宠物洗澡／梳毛', '接受洗澡／梳毛'],
    ['ja', 'ペットを入浴／ブラッシングする', '入浴／ブラッシングを受ける'],
    ['en', 'Bathe or groom the pet', 'Be bathed or groomed'],
  ] as const)('keeps pet bathing titles aligned with the displayed direction in %s', (locale, activeTitle, passiveTitle) => {
    const localized = localizeQuestionBank(questionBank, locale);
    const petBathing = localized.categories
      .find((category) => category.categoryId === 'pet_play')
      ?.detailItems.find((item) => item.detailId === 'detail-pet_play-1jsyyjh');

    expect(petBathing?.roles.active.title).toBe(activeTitle);
    expect(petBathing?.roles.passive.title).toBe(passiveTitle);
  });
});
