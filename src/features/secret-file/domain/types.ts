export const secretFileScopes = ['activeOnly', 'passiveOnly', 'all'] as const;
export type SecretFileScope = (typeof secretFileScopes)[number];

export const questionRoles = ['active', 'passive'] as const;
export type QuestionRole = (typeof questionRoles)[number];

export const questionLevels = ['category', 'detail'] as const;
export type QuestionLevel = (typeof questionLevels)[number];

export const experienceAnswers = [
  'none',
  'little',
  'some',
  'extensive',
  'veryExtensive',
  'unsure',
  'seeDetails',
] as const;
export type ExperienceAnswer = (typeof experienceAnswers)[number];

export const preferenceAnswers = [
  'hardNo',
  'reluctant',
  'neutral',
  'like',
  'love',
  'unsure',
  'seeDetails',
] as const;
export type PreferenceAnswer = (typeof preferenceAnswers)[number];

export interface QuestionDefinition {
  id: string;
  level: QuestionLevel;
  role: QuestionRole;
}

export interface UnansweredSecretFileAnswer {
  state: 'unanswered';
}

export interface FilteredOutSecretFileAnswer {
  state: 'filteredOut';
}

export interface AnsweredSecretFileAnswer {
  experience: ExperienceAnswer;
  note: string;
  preference: PreferenceAnswer;
  state: 'answered';
}

export type SecretFileAnswer =
  | AnsweredSecretFileAnswer
  | FilteredOutSecretFileAnswer
  | UnansweredSecretFileAnswer;

export interface SecretFile {
  answers: Record<string, SecretFileAnswer>;
  createdAt: string;
  fileId: string;
  profileName: string;
  questionBank: {
    bankVersion: string;
    schemaVersion: number;
  };
  schemaVersion: 2;
  scope: SecretFileScope;
  spotlight: Record<QuestionRole, {
    selectedQuestionIds: string[];
  }>;
  updatedAt: string;
}
