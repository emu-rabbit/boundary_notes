import { z } from 'zod';
import {
  experienceAnswers,
  preferenceAnswers,
  secretFileScopes,
  type SecretFile,
} from '../domain/types';

z.config({ jitless: true });

const forbiddenNotePattern =
  /(?:https?:\/\/|www\.|\[[^\]\r\n]+\]\([^\s)]+\)|(?:[a-z0-9-]+\.)+(?:com|net|org|io|co|tw|app|dev|edu|gov|info))/i;

const timestampSchema = z.string().datetime({ offset: true });

export const secretFileNoteSchema = z
  .string()
  .refine((note) => Array.from(note).length <= 80, '備註最多只能有 80 個字元。')
  .refine((note) => !/[\u0000-\u001F\u007F]/.test(note), '備註不能包含換行或控制字元。')
  .refine((note) => !forbiddenNotePattern.test(note), '備註不能包含連結。');

const unansweredAnswerSchema = z.object({ state: z.literal('unanswered') }).strict();
const filteredOutAnswerSchema = z.object({ state: z.literal('filteredOut') }).strict();
const answeredAnswerSchema = z
  .object({
    experience: z.enum(experienceAnswers),
    note: secretFileNoteSchema,
    preference: z.enum(preferenceAnswers),
    state: z.literal('answered'),
  })
  .strict();

export const secretFileAnswerSchema = z.discriminatedUnion('state', [
  unansweredAnswerSchema,
  filteredOutAnswerSchema,
  answeredAnswerSchema,
]);

const spotlightSelectionSchema = (role: 'active' | 'passive') => z
  .object({
    selectedQuestionIds: z.array(
      z.string().min(1).refine(
        (questionId) => questionId.endsWith(`.${role}`),
        `spotlight ${role} 只能保存同方向的項目。`,
      ),
    ).max(5),
  })
  .strict()
  .superRefine((spotlight, context) => {
    if (new Set(spotlight.selectedQuestionIds).size !== spotlight.selectedQuestionIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'spotlight 項目不得重複。',
        path: ['selectedQuestionIds'],
      });
    }
  });

const secretFileBaseSchema = z.object({
  answers: z
    .record(z.string().min(1), secretFileAnswerSchema)
    .refine((answers) => Object.keys(answers).length <= 700, '秘密檔案包含過多題目。'),
  createdAt: timestampSchema,
  fileId: z.string().max(160).regex(/^local_[A-Za-z0-9_-]{8,}$/, '檔案 ID 格式不正確。'),
  profileName: z
    .string()
    .trim()
    .min(1, '檔案必須保留填寫者名稱。')
    .refine((name) => Array.from(name).length <= 32, '填寫者名稱最多只能有 32 個字元。')
    .refine((name) => !/[\u0000-\u001F\u007F]/.test(name), '填寫者名稱不能包含控制字元。'),
  questionBank: z
    .object({
      bankVersion: z.string().min(1),
      schemaVersion: z.number().int().positive(),
    })
    .strict(),
  scope: z.enum(secretFileScopes),
  updatedAt: timestampSchema,
});

const legacySecretFileSchema = secretFileBaseSchema.extend({
  schemaVersion: z.literal(1),
  spotlight: z
    .object({
      selectedQuestionIds: z.array(
        z.string().min(1).refine(
          (questionId) => questionId.endsWith('.active') || questionId.endsWith('.passive'),
          '舊版 spotlight 項目缺少可辨識的互動方向。',
        ),
      ).max(5),
    })
    .strict()
    .superRefine((spotlight, context) => {
      if (new Set(spotlight.selectedQuestionIds).size !== spotlight.selectedQuestionIds.length) {
        context.addIssue({
          code: 'custom',
          message: 'spotlight 項目不得重複。',
          path: ['selectedQuestionIds'],
        });
      }
    }),
}).strict();

export const secretFileSchema = secretFileBaseSchema.extend({
  schemaVersion: z.literal(2),
  spotlight: z
    .object({
      active: spotlightSelectionSchema('active'),
      passive: spotlightSelectionSchema('passive'),
    })
    .strict(),
  })
  .strict();

export class SecretFileValidationError extends Error {
  constructor(public readonly issues: readonly string[]) {
    super(`秘密檔案格式無法使用：${issues.join('；')}`);
    this.name = 'SecretFileValidationError';
  }
}

export class UnsupportedSecretFileSchemaError extends Error {
  constructor(schemaVersion: unknown) {
    super(`這份秘密檔案的 schemaVersion (${String(schemaVersion)}) 目前尚未支援。`);
    this.name = 'UnsupportedSecretFileSchemaError';
  }
}

export class InvalidSecretFileJsonError extends Error {
  constructor() {
    super('貼上的內容不是有效的 JSON。');
    this.name = 'InvalidSecretFileJsonError';
  }
}

function getSchemaVersion(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || !('schemaVersion' in value)) {
    return undefined;
  }

  return value.schemaVersion;
}

export function parseSecretFile(input: unknown): SecretFile {
  const schemaVersion = getSchemaVersion(input);

  if (schemaVersion === 1) {
    const legacyFile = legacySecretFileSchema.safeParse(input);

    if (!legacyFile.success) {
      throw new SecretFileValidationError(legacyFile.error.issues.map((issue) => issue.message));
    }

    const migrated: SecretFile = {
      ...legacyFile.data,
      schemaVersion: 2,
      spotlight: {
        active: {
          selectedQuestionIds: legacyFile.data.spotlight.selectedQuestionIds.filter(
            (questionId) => questionId.endsWith('.active'),
          ),
        },
        passive: {
          selectedQuestionIds: legacyFile.data.spotlight.selectedQuestionIds.filter(
            (questionId) => questionId.endsWith('.passive'),
          ),
        },
      },
    };

    return secretFileSchema.parse(migrated);
  }

  if (schemaVersion !== 2) {
    throw new UnsupportedSecretFileSchemaError(schemaVersion);
  }

  const parsed = secretFileSchema.safeParse(input);

  if (!parsed.success) {
    throw new SecretFileValidationError(parsed.error.issues.map((issue) => issue.message));
  }

  return parsed.data;
}

export function parseSecretFileJson(input: string): SecretFile {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    throw new InvalidSecretFileJsonError();
  }

  return parseSecretFile(parsed);
}
