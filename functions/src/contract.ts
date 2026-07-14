import { isIP } from 'node:net';
import { z } from 'zod';

export const maxCloudPayloadBytes = 512 * 1024;
export const maxCloudAnswers = 700;
export const uploadHourlyLimit = 5;
export const uploadDailyLimit = 10;
export const uploadGlobalHourlyLimit = 300;
export const uploadGlobalDailyLimit = 2000;
export const uploadHourlyWindowMs = 60 * 60 * 1000;
export const uploadDailyWindowMs = 24 * 60 * 60 * 1000;

const questionIdPattern = /^(?:category\.[A-Za-z][A-Za-z0-9_-]{0,79}|detail\.[A-Za-z][A-Za-z0-9_-]{0,79}\.[A-Za-z][A-Za-z0-9_-]{0,79})\.(?:active|passive)$/;
const forbiddenNotePattern =
  /(?:https?:\/\/|www\.|\[[^\]\r\n]+\]\([^\s)]+\)|(?:[a-z0-9-]+\.)+(?:com|net|org|io|co|tw|app|dev|edu|gov|info))/i;
const timestampSchema = z.string().datetime({ offset: true });
const experienceAnswers = [
  'none',
  'little',
  'some',
  'extensive',
  'veryExtensive',
  'unsure',
  'seeDetails',
] as const;
const preferenceAnswers = [
  'hardNo',
  'reluctant',
  'neutral',
  'like',
  'love',
  'unsure',
  'seeDetails',
] as const;

const noteSchema = z
  .string()
  .refine((note) => Array.from(note).length <= 80, 'note-too-long')
  .refine((note) => !/[\u0000-\u001F\u007F]/.test(note), 'note-control-character')
  .refine((note) => !forbiddenNotePattern.test(note), 'note-link');

const unansweredAnswerSchema = z.object({ state: z.literal('unanswered') }).strict();
const filteredOutAnswerSchema = z.object({ state: z.literal('filteredOut') }).strict();
const answeredAnswerSchema = z
  .object({
    experience: z.enum(experienceAnswers),
    note: noteSchema,
    preference: z.enum(preferenceAnswers),
    state: z.literal('answered'),
  })
  .strict();

const answerSchema = z.discriminatedUnion('state', [
  unansweredAnswerSchema,
  filteredOutAnswerSchema,
  answeredAnswerSchema,
]);

const spotlightSchema = (role: 'active' | 'passive') =>
  z
    .object({
      selectedQuestionIds: z
        .array(z.string().regex(questionIdPattern).endsWith(`.${role}`))
        .max(5),
    })
    .strict()
    .refine(
      (value) => new Set(value.selectedQuestionIds).size === value.selectedQuestionIds.length,
      'spotlight-duplicate',
    );

export const cloudSecretFileSchema = z
  .object({
    answers: z.record(z.string().regex(questionIdPattern), answerSchema),
    createdAt: timestampSchema,
    fileId: z.string().regex(/^local_[A-Za-z0-9_-]{8,}$/).max(160),
    profileName: z
      .string()
      .trim()
      .min(1)
      .refine((name) => Array.from(name).length <= 32, 'profile-name-too-long')
      .refine((name) => !/[\u0000-\u001F\u007F]/.test(name), 'profile-name-control-character'),
    questionBank: z
      .object({
        bankVersion: z.string().min(1).max(80),
        schemaVersion: z.number().int().positive().max(100),
      })
      .strict(),
    schemaVersion: z.literal(2),
    scope: z.enum(['activeOnly', 'passiveOnly', 'all']),
    spotlight: z
      .object({
        active: spotlightSchema('active'),
        passive: spotlightSchema('passive'),
      })
      .strict(),
    updatedAt: timestampSchema,
  })
  .strict()
  .superRefine((secretFile, context) => {
    const answerEntries = Object.entries(secretFile.answers);

    if (answerEntries.length > maxCloudAnswers) {
      context.addIssue({ code: 'custom', message: 'too-many-answers', path: ['answers'] });
    }

    if (Date.parse(secretFile.updatedAt) < Date.parse(secretFile.createdAt)) {
      context.addIssue({ code: 'custom', message: 'invalid-timestamp-order', path: ['updatedAt'] });
    }

    for (const [questionId, answer] of answerEntries) {
      const role = questionId.endsWith('.active') ? 'active' : 'passive';
      const mustBeFilteredOut =
        (secretFile.scope === 'activeOnly' && role === 'passive') ||
        (secretFile.scope === 'passiveOnly' && role === 'active');

      if (mustBeFilteredOut !== (answer.state === 'filteredOut')) {
        context.addIssue({ code: 'custom', message: 'scope-answer-mismatch', path: ['answers', questionId] });
      }

      if (
        questionId.startsWith('detail.') &&
        answer.state === 'answered' &&
        (answer.experience === 'seeDetails' || answer.preference === 'seeDetails')
      ) {
        context.addIssue({ code: 'custom', message: 'detail-see-details', path: ['answers', questionId] });
      }
    }

    for (const role of ['active', 'passive'] as const) {
      for (const questionId of secretFile.spotlight[role].selectedQuestionIds) {
        const answer = secretFile.answers[questionId];

        if (
          answer?.state !== 'answered' ||
          (answer.preference !== 'like' && answer.preference !== 'love')
        ) {
          context.addIssue({
            code: 'custom',
            message: 'invalid-spotlight-answer',
            path: ['spotlight', role, 'selectedQuestionIds'],
          });
        }
      }
    }
  });

export const createShareRequestSchema = z.object({ secretFile: cloudSecretFileSchema }).strict();

export type CloudSecretFile = z.infer<typeof cloudSecretFileSchema>;

export function getPayloadBytes(secretFile: CloudSecretFile): number {
  return Buffer.byteLength(JSON.stringify(secretFile), 'utf8');
}

function getRetryAfterSecondsForLimits(
  attemptTimes: readonly number[],
  now: number,
  hourlyLimit: number,
  dailyLimit: number,
): number | null {
  const dailyAttempts = attemptTimes
    .filter((attempt) => attempt >= now - uploadDailyWindowMs)
    .sort((left, right) => left - right);
  const hourlyAttempts = dailyAttempts.filter((attempt) => attempt >= now - uploadHourlyWindowMs);
  const retryTimes: number[] = [];

  if (hourlyAttempts.length >= hourlyLimit) {
    retryTimes.push(hourlyAttempts[0] + uploadHourlyWindowMs);
  }

  if (dailyAttempts.length >= dailyLimit) {
    retryTimes.push(dailyAttempts[0] + uploadDailyWindowMs);
  }

  if (retryTimes.length === 0) {
    return null;
  }

  return Math.max(1, Math.ceil((Math.max(...retryTimes) - now) / 1000));
}

export function getRetryAfterSeconds(attemptTimes: readonly number[], now: number): number | null {
  return getRetryAfterSecondsForLimits(
    attemptTimes,
    now,
    uploadHourlyLimit,
    uploadDailyLimit,
  );
}

export function getGlobalRetryAfterSeconds(
  attemptTimes: readonly number[],
  now: number,
): number | null {
  return getRetryAfterSecondsForLimits(
    attemptTimes,
    now,
    uploadGlobalHourlyLimit,
    uploadGlobalDailyLimit,
  );
}

function getIpv6RateLimitPrefix(address: string): string {
  let expandableAddress = address.toLowerCase();
  const embeddedIpv4 = expandableAddress.match(/(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1];

  if (embeddedIpv4 && isIP(embeddedIpv4) === 4) {
    const bytes = embeddedIpv4.split('.').map(Number);
    const high = ((bytes[0] ?? 0) << 8) | (bytes[1] ?? 0);
    const low = ((bytes[2] ?? 0) << 8) | (bytes[3] ?? 0);
    expandableAddress = `${expandableAddress.slice(0, -embeddedIpv4.length)}${high.toString(16)}:${low.toString(16)}`;
  }

  const [leftPart, rightPart] = expandableAddress.split('::');
  const left = leftPart ? leftPart.split(':') : [];
  const right = rightPart ? rightPart.split(':') : [];
  const omittedGroups = expandableAddress.includes('::') ? 8 - left.length - right.length : 0;
  const groups = [
    ...left,
    ...Array.from({ length: omittedGroups }, () => '0'),
    ...right,
  ];

  return `${groups.slice(0, 4).map((group) => Number.parseInt(group, 16).toString(16)).join(':')}::/64`;
}

export function normalizeClientIp(value: string): string {
  const candidate = value.trim();

  if (!candidate || candidate.includes(',')) return '';

  const bracketedAddress = candidate.match(/^\[([^\]]+)\](?::\d+)?$/)?.[1];
  const withoutBrackets = bracketedAddress ?? candidate;
  const withoutZone = withoutBrackets.split('%')[0] ?? '';

  if (withoutZone.toLowerCase().startsWith('::ffff:')) {
    const mappedIpv4 = withoutZone.slice('::ffff:'.length);
    return isIP(mappedIpv4) === 4 ? mappedIpv4 : '';
  }

  const ipv4WithPort = withoutZone.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/)?.[1];
  const address = ipv4WithPort ?? withoutZone;
  const version = isIP(address);

  if (version === 4) return address;
  if (version === 6) return getIpv6RateLimitPrefix(address);
  return '';
}

export function getGoogleLoadBalancerClientIp(forwardedFor: string): string {
  const addresses = forwardedFor.split(',').map((address) => address.trim());

  if (addresses.length < 2) return '';

  return normalizeClientIp(addresses[addresses.length - 2] ?? '');
}
