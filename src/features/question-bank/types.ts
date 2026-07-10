import type {
  QuestionDefinition,
  QuestionRole,
  SecretFileScope,
} from '../secret-file';

export interface QuestionBankCategoryRoleCopy {
  description: string;
}

export interface QuestionBankCategory {
  categoryId: string;
  includeInCategoryRound: boolean;
  itemCount: number;
  name: string;
  roles: Record<QuestionRole, QuestionBankCategoryRoleCopy>;
  sourceSheetName: string;
}

export interface QuestionBankSource {
  fileId: string;
  kind: 'google-sheet';
  modifiedTime: string;
  title: string;
}

export interface QuestionBank {
  bankVersion: string;
  categories: readonly QuestionBankCategory[];
  schemaVersion: 1;
  source: QuestionBankSource;
}

export interface CategoryQuestion extends QuestionDefinition {
  category: QuestionBankCategory;
  level: 'category';
}

export interface QuestionBankCounts {
  categoryCount: number;
  detailQuestionCount: number;
}

export type CategoryQuestionsByScope = Record<SecretFileScope, readonly CategoryQuestion[]>;
