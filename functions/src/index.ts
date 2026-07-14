import { createHmac, randomBytes } from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { defineSecret, expr, projectID } from 'firebase-functions/params';
import { HttpsError, onCall, type CallableRequest } from 'firebase-functions/v2/https';
import {
  createShareRequestSchema,
  getGlobalRetryAfterSeconds,
  getGoogleLoadBalancerClientIp,
  getPayloadBytes,
  getRetryAfterSeconds,
  maxCloudPayloadBytes,
  normalizeClientIp,
  uploadDailyWindowMs,
} from './contract.js';

initializeApp();

const db = getFirestore();
const uploadSourceHashKey = defineSecret('UPLOAD_SOURCE_HASH_KEY');
const region = 'asia-east1';
const sharedSecretFilesCollection = 'sharedSecretFiles';
const sharedSecretFileMetadataCollection = 'sharedSecretFileMetadata';
const uploadRateLimitsCollection = 'uploadRateLimits';
const uploadGlobalRateLimitsCollection = 'uploadGlobalRateLimits';
const shareWriterServiceAccount = expr`boundary-notes-share-writer@${projectID}.iam.gserviceaccount.com`;
const maxCallableDataBytes = maxCloudPayloadBytes + 4 * 1024;
const allowedOrigins = [
  /^https:\/\/(?:www\.)?boundarynotes\.com$/,
  /^https:\/\/boundary-notes-(?:prod|staging)(?:--[a-z0-9-]+)?\.(?:firebaseapp\.com|web\.app)$/,
  /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/,
];

function getHeaderValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function getClientIp(request: CallableRequest<unknown>): string {
  const forwardedFor = getHeaderValue(request.rawRequest.headers['x-forwarded-for']);
  const normalized = getGoogleLoadBalancerClientIp(forwardedFor)
    || normalizeClientIp(request.rawRequest.socket.remoteAddress || '');

  if (!normalized || normalized.length > 120) {
    throw new HttpsError('failed-precondition', '無法確認匿名上傳來源。');
  }

  return normalized;
}

function hashPrivateValue(purpose: string, value: string): string {
  const key = uploadSourceHashKey.value();

  if (key.length < 32) {
    throw new HttpsError('internal', '上傳防護設定不完整。');
  }

  return createHmac('sha256', key).update(`${purpose}:${value}`).digest('base64url');
}

function createShareId(): string {
  return `sf_${randomBytes(18).toString('base64url')}`;
}

function parseAttemptTimes(input: unknown): number[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((entry): entry is Timestamp => entry instanceof Timestamp)
    .map((entry) => entry.toMillis());
}

export const createSharedSecretFile = onCall(
  {
    consumeAppCheckToken: true,
    cors: allowedOrigins,
    enforceAppCheck: true,
    maxInstances: 5,
    memory: '256MiB',
    region,
    secrets: [uploadSourceHashKey],
    serviceAccount: shareWriterServiceAccount,
    timeoutSeconds: 30,
  },
  async (request) => {
    const callableDataBytes = Buffer.byteLength(JSON.stringify(request.data ?? null), 'utf8');

    if (callableDataBytes > maxCallableDataBytes) {
      throw new HttpsError('invalid-argument', '秘密檔案內容超過雲端大小限制。');
    }

    const parsed = createShareRequestSchema.safeParse(request.data);

    if (!parsed.success) {
      throw new HttpsError('invalid-argument', '秘密檔案內容未通過安全檢查。');
    }

    const payloadBytes = getPayloadBytes(parsed.data.secretFile);

    if (payloadBytes > maxCloudPayloadBytes) {
      throw new HttpsError('invalid-argument', '秘密檔案內容超過雲端大小限制。');
    }

    const clientIp = getClientIp(request);
    const userAgent = getHeaderValue(request.rawRequest.headers['user-agent']).slice(0, 512);
    const sourceHash = hashPrivateValue('rate-source', clientIp);
    const sourceFingerprintHash = hashPrivateValue('source-fingerprint', `${clientIp}|${userAgent}`);
    const userAgentHash = hashPrivateValue('user-agent', userAgent || 'unknown');
    const shareId = createShareId();
    const now = Timestamp.now();
    const nowMs = now.toMillis();
    const expiresAt = Timestamp.fromMillis(nowMs + uploadDailyWindowMs * 2);
    const rateLimitRef = db.collection(uploadRateLimitsCollection).doc(sourceHash);
    const globalRateLimitRef = db.collection(uploadGlobalRateLimitsCollection).doc('project');
    const shareRef = db.collection(sharedSecretFilesCollection).doc(shareId);
    const metadataRef = db.collection(sharedSecretFileMetadataCollection).doc(shareId);

    await db.runTransaction(async (transaction) => {
      const rateLimitSnapshot = await transaction.get(rateLimitRef);
      const globalRateLimitSnapshot = await transaction.get(globalRateLimitRef);
      const previousAttempts = parseAttemptTimes(rateLimitSnapshot.get('attempts'));
      const previousGlobalAttempts = parseAttemptTimes(globalRateLimitSnapshot.get('attempts'));
      const globalRetryAfterSeconds = getGlobalRetryAfterSeconds(previousGlobalAttempts, nowMs);

      if (globalRetryAfterSeconds !== null) {
        throw new HttpsError(
          'resource-exhausted',
          '網站目前請求過多，請稍後再試。',
          { reason: 'global-rate-limit', retryAfterSeconds: globalRetryAfterSeconds },
        );
      }

      const retryAfterSeconds = getRetryAfterSeconds(previousAttempts, nowMs);

      if (retryAfterSeconds !== null) {
        throw new HttpsError(
          'resource-exhausted',
          '匿名上傳次數已達限制。',
          { reason: 'source-rate-limit', retryAfterSeconds },
        );
      }

      const recentAttempts = previousAttempts
        .filter((attempt) => attempt >= nowMs - uploadDailyWindowMs)
        .map((attempt) => Timestamp.fromMillis(attempt));
      const recentGlobalAttempts = previousGlobalAttempts
        .filter((attempt) => attempt >= nowMs - uploadDailyWindowMs)
        .map((attempt) => Timestamp.fromMillis(attempt));

      transaction.set(rateLimitRef, {
        attempts: [...recentAttempts, now],
        expiresAt,
        updatedAt: now,
      });
      transaction.set(globalRateLimitRef, {
        attempts: [...recentGlobalAttempts, now],
        expiresAt,
        updatedAt: now,
      });
      transaction.create(shareRef, {
        clientSummary: {
          answerCount: Object.keys(parsed.data.secretFile.answers).length,
          bankVersion: parsed.data.secretFile.questionBank.bankVersion,
          payloadBytes,
        },
        createdAt: now,
        schemaVersion: 1,
        secretFile: parsed.data.secretFile,
        shareId,
      });
      transaction.create(metadataRef, {
        appId: request.app?.appId ?? 'unknown',
        createdAt: now,
        payloadBytes,
        sourceFingerprintHash,
        sourceHash,
        userAgentHash,
      });
    });

    return {
      createdAt: now.toDate().toISOString(),
      shareId,
    };
  },
);
