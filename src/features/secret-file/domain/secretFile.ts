import type {
  QuestionDefinition,
  QuestionRole,
  SecretFile,
  SecretFileAnswer,
  SecretFileScope,
} from './types';

export const secretFileSchemaVersion = 2 as const;

export interface CreateSecretFileInput {
  bankSchemaVersion: number;
  bankVersion: string;
  createdAt?: string;
  fileId: string;
  profileName: string;
  questions: readonly QuestionDefinition[];
  scope: SecretFileScope;
}

export function isRoleIncludedInScope(role: QuestionRole, scope: SecretFileScope): boolean {
  return scope === 'all' || scope === `${role}Only`;
}

function assertUniqueQuestionIds(questions: readonly QuestionDefinition[]): void {
  const ids = new Set<string>();

  for (const question of questions) {
    if (!question.id) {
      throw new Error('Question definitions must use a non-empty stable id.');
    }

    if (ids.has(question.id)) {
      throw new Error(`Question definitions contain a duplicate id: ${question.id}`);
    }

    ids.add(question.id);
  }
}

function initialAnswerForQuestion(
  question: QuestionDefinition,
  scope: SecretFileScope,
): SecretFileAnswer {
  return isRoleIncludedInScope(question.role, scope)
    ? { state: 'unanswered' }
    : { state: 'filteredOut' };
}

export function createSecretFile(input: CreateSecretFileInput): SecretFile {
  const profileName = input.profileName.trim();

  if (!input.fileId) {
    throw new Error('A secret file requires a stable local file id.');
  }

  if (!profileName) {
    throw new Error('A secret file requires a profile name.');
  }

  if (!input.bankVersion || !Number.isInteger(input.bankSchemaVersion) || input.bankSchemaVersion < 1) {
    throw new Error('A secret file requires a valid question bank version.');
  }

  assertUniqueQuestionIds(input.questions);
  const timestamp = input.createdAt ?? new Date().toISOString();
  const answers = Object.fromEntries(
    input.questions.map((question) => [question.id, initialAnswerForQuestion(question, input.scope)]),
  );

  return {
    answers,
    createdAt: timestamp,
    fileId: input.fileId,
    profileName,
    questionBank: {
      bankVersion: input.bankVersion,
      schemaVersion: input.bankSchemaVersion,
    },
    schemaVersion: secretFileSchemaVersion,
    scope: input.scope,
    spotlight: {
      active: { selectedQuestionIds: [] },
      passive: { selectedQuestionIds: [] },
    },
    updatedAt: timestamp,
  };
}

export function reconcileSecretFileQuestions(
  secretFile: SecretFile,
  questions: readonly QuestionDefinition[],
  updatedAt = new Date().toISOString(),
): SecretFile {
  assertUniqueQuestionIds(questions);
  const answers = { ...secretFile.answers };

  for (const question of questions) {
    if (answers[question.id] === undefined) {
      answers[question.id] = initialAnswerForQuestion(question, secretFile.scope);
    }
  }

  return {
    ...secretFile,
    answers,
    updatedAt,
  };
}
