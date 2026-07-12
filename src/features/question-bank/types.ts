import type {
  QuestionDefinition,
  QuestionRole,
  SecretFileScope,
} from '../secret-file';

export interface QuestionBankCategoryRoleCopy {
  description: string;
}

export interface QuestionBankDetailItem {
  detailId: string;
  label: string;
  roles: Record<QuestionRole, { description: string }>;
  warning: string | null;
}

export interface QuestionBankCategory {
  categoryId: string;
  detailItems: readonly QuestionBankDetailItem[];
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

export interface DetailQuestion extends QuestionDefinition {
  category: QuestionBankCategory;
  detail: QuestionBankDetailItem;
  level: 'detail';
}

export interface QuestionBankCounts {
  categoryCount: number;
  detailQuestionCount: number;
}

export type CategoryQuestionsByScope = Record<SecretFileScope, readonly CategoryQuestion[]>;
