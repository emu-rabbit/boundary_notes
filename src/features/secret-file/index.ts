export { answerSecretFileQuestion, type AnswerQuestionInput } from './domain/answers';
export {
  createSecretFile,
  isRoleIncludedInScope,
  reconcileSecretFileQuestions,
  secretFileSchemaVersion,
  type CreateSecretFileInput,
} from './domain/secretFile';
export { getSecretFileProgress, type SecretFileProgress } from './domain/progress';
export type {
  AnsweredSecretFileAnswer,
  ExperienceAnswer,
  PreferenceAnswer,
  QuestionDefinition,
  QuestionLevel,
  QuestionRole,
  SecretFile,
  SecretFileAnswer,
  SecretFileScope,
} from './domain/types';
export {
  experienceAnswers,
  preferenceAnswers,
  questionLevels,
  questionRoles,
  secretFileScopes,
} from './domain/types';
export {
  parseSecretFile,
  parseSecretFileJson,
  InvalidSecretFileJsonError,
  secretFileNoteSchema,
  SecretFileValidationError,
  UnsupportedSecretFileSchemaError,
} from './validation/secretFileSchema';
export {
  LocalSecretFileLimitError,
  maxLocalSecretFiles,
} from './storage/browserSecretFileRepository';
