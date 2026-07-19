import {
  getCategoryQuestionId,
  getDetailQuestionId,
  type QuestionBank,
  type QuestionBankCategory,
} from '../question-bank';
import type {
  AnsweredSecretFileAnswer,
  QuestionLevel,
  QuestionRole,
  SecretFile,
  SecretFileAnswer,
} from '../secret-file';
import { isRoleIncludedInScope } from '../secret-file';

export type TimeMachineComparisonSectionId =
  | 'spotlight'
  | 'category'
  | 'hardNo'
  | 'detail';

export interface TimeMachineComparisonQuestion {
  categoryId: string;
  categoryName: string;
  description: string;
  known: boolean;
  level: QuestionLevel;
  questionId: string;
  role: QuestionRole;
  title: string;
}

export interface TimeMachineAnswerChange {
  kind: 'answer';
  newerAnswer: AnsweredSecretFileAnswer;
  olderAnswer: AnsweredSecretFileAnswer;
  question: TimeMachineComparisonQuestion;
}

export interface TimeMachineSpotlightChange {
  kind: 'spotlight';
  newerRank: number | null;
  olderRank: number | null;
  question: TimeMachineComparisonQuestion;
}

export type TimeMachineComparisonChange =
  | TimeMachineAnswerChange
  | TimeMachineSpotlightChange;

export interface TimeMachineComparisonResult {
  category: TimeMachineAnswerChange[];
  detail: TimeMachineAnswerChange[];
  hardNo: TimeMachineAnswerChange[];
  spotlight: TimeMachineSpotlightChange[];
}

interface IndexedQuestion extends TimeMachineComparisonQuestion {
  order: number;
}

const roles: readonly QuestionRole[] = ['active', 'passive'];

function getSpotlightChangeOrder(change: TimeMachineSpotlightChange): number {
  if (change.newerRank === 1) return 0;
  if (change.olderRank === null) return 1;
  if (change.newerRank === null) return 4;
  if (change.newerRank < change.olderRank) return 2;
  return 3;
}

function createQuestionIndex(questionBank: QuestionBank): Map<string, IndexedQuestion> {
  const questions = new Map<string, IndexedQuestion>();
  let order = 0;

  for (const role of roles) {
    for (const category of questionBank.categories) {
      if (category.includeInCategoryRound) {
        const questionId = getCategoryQuestionId(category.categoryId, role);
        questions.set(questionId, {
          categoryId: category.categoryId,
          categoryName: category.name,
          description: category.roles[role].description,
          known: true,
          level: 'category',
          order,
          questionId,
          role,
          title: category.name,
        });
        order += 1;
      }

      for (const detail of category.detailItems) {
        const questionId = getDetailQuestionId(category.categoryId, detail.detailId, role);
        questions.set(questionId, {
          categoryId: category.categoryId,
          categoryName: category.name,
          description: detail.roles[role].description,
          known: true,
          level: 'detail',
          order,
          questionId,
          role,
          title: detail.roles[role].title,
        });
        order += 1;
      }
    }
  }

  return questions;
}

function parseQuestionIdentity(questionId: string): {
  categoryId: string;
  level: QuestionLevel;
  role: QuestionRole;
} {
  const parts = questionId.split('.');
  const level: QuestionLevel = parts[0] === 'category' ? 'category' : 'detail';
  const role: QuestionRole = parts[parts.length - 1] === 'passive' ? 'passive' : 'active';

  return {
    categoryId: parts[1] ?? '',
    level,
    role,
  };
}

function createUnknownQuestion(
  questionId: string,
  categories: ReadonlyMap<string, QuestionBankCategory>,
): IndexedQuestion {
  const identity = parseQuestionIdentity(questionId);
  const category = categories.get(identity.categoryId);

  return {
    ...identity,
    categoryName: category?.name ?? '',
    description: '',
    known: false,
    order: Number.MAX_SAFE_INTEGER,
    questionId,
    title: '',
  };
}

function answersAreEqual(
  olderAnswer: AnsweredSecretFileAnswer,
  newerAnswer: AnsweredSecretFileAnswer,
): boolean {
  return olderAnswer.experience === newerAnswer.experience
    && olderAnswer.preference === newerAnswer.preference
    && olderAnswer.note === newerAnswer.note;
}

function isAnswered(
  answer: SecretFileAnswer | undefined,
): answer is AnsweredSecretFileAnswer {
  return answer?.state === 'answered';
}

function isHardNo(answer: AnsweredSecretFileAnswer): boolean {
  return answer.preference === 'hardNo';
}

function sortByQuestionOrder<T extends { question: TimeMachineComparisonQuestion }>(
  changes: T[],
  indexedQuestions: ReadonlyMap<string, IndexedQuestion>,
): T[] {
  return changes.sort((left, right) => {
    const leftOrder = indexedQuestions.get(left.question.questionId)?.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = indexedQuestions.get(right.question.questionId)?.order ?? Number.MAX_SAFE_INTEGER;

    return leftOrder - rightOrder || left.question.questionId.localeCompare(right.question.questionId);
  });
}

export function compareSecretFiles(
  older: SecretFile,
  newer: SecretFile,
  questionBank: QuestionBank,
): TimeMachineComparisonResult {
  const indexedQuestions = createQuestionIndex(questionBank);
  const categories = new Map(questionBank.categories.map((category) => [category.categoryId, category]));
  const resolveQuestion = (questionId: string): IndexedQuestion =>
    indexedQuestions.get(questionId) ?? createUnknownQuestion(questionId, categories);
  const result: TimeMachineComparisonResult = {
    category: [],
    detail: [],
    hardNo: [],
    spotlight: [],
  };

  for (const role of roles) {
    const roleIsComparable = isRoleIncludedInScope(role, older.scope)
      && isRoleIncludedInScope(role, newer.scope);

    if (!roleIsComparable) continue;

    const answeredInBoth = (questionId: string) => isAnswered(older.answers[questionId])
      && isAnswered(newer.answers[questionId]);
    const olderIds = older.spotlight[role].selectedQuestionIds.filter(answeredInBoth);
    const newerIds = newer.spotlight[role].selectedQuestionIds.filter(answeredInBoth);
    const allIds = new Set([...olderIds, ...newerIds]);

    for (const questionId of allIds) {
      const olderIndex = olderIds.indexOf(questionId);
      const newerIndex = newerIds.indexOf(questionId);
      const olderRank = olderIndex < 0 ? null : olderIndex + 1;
      const newerRank = newerIndex < 0 ? null : newerIndex + 1;

      if (olderRank === newerRank) continue;

      result.spotlight.push({
        kind: 'spotlight',
        newerRank,
        olderRank,
        question: resolveQuestion(questionId),
      });
    }
  }

  result.spotlight.sort((left, right) => {
    const roleOrder = roles.indexOf(left.question.role) - roles.indexOf(right.question.role);
    const changeOrder = getSpotlightChangeOrder(left) - getSpotlightChangeOrder(right);
    const leftRank = left.newerRank ?? left.olderRank ?? Number.MAX_SAFE_INTEGER;
    const rightRank = right.newerRank ?? right.olderRank ?? Number.MAX_SAFE_INTEGER;

    return roleOrder
      || changeOrder
      || leftRank - rightRank
      || left.question.questionId.localeCompare(right.question.questionId);
  });

  const answerQuestionIds = new Set([
    ...Object.keys(older.answers),
    ...Object.keys(newer.answers),
  ]);

  for (const questionId of answerQuestionIds) {
    const olderAnswer = older.answers[questionId];
    const newerAnswer = newer.answers[questionId];
    const question = resolveQuestion(questionId);

    if (!isRoleIncludedInScope(question.role, older.scope)) continue;
    if (!isRoleIncludedInScope(question.role, newer.scope)) continue;
    if (!isAnswered(olderAnswer) || !isAnswered(newerAnswer)) continue;
    if (answersAreEqual(olderAnswer, newerAnswer)) continue;

    const change: TimeMachineAnswerChange = {
      kind: 'answer',
      newerAnswer,
      olderAnswer,
      question,
    };

    if (isHardNo(olderAnswer) !== isHardNo(newerAnswer)) {
      result.hardNo.push(change);
    } else if (change.question.level === 'category') {
      result.category.push(change);
    } else {
      result.detail.push(change);
    }
  }

  sortByQuestionOrder(result.category, indexedQuestions);
  sortByQuestionOrder(result.hardNo, indexedQuestions);
  sortByQuestionOrder(result.detail, indexedQuestions);

  return result;
}
