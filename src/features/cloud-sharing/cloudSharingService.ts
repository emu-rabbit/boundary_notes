import type { FirebaseApp } from 'firebase/app';
import type { Functions, HttpsCallable } from 'firebase/functions';
import type { SecretFile } from '../secret-file';
import { parseSecretFile } from '../secret-file/validation/secretFileSchema';
import { isCloudShareId } from './cloudShareId';
import type { CloudUploadRetryWindow } from './cloudUploadGuard';

const cloudFunctionsRegion = 'asia-east1';
const firebaseAppName = 'boundary-notes-cloud-sharing';

export type CloudSharingErrorCode =
  | 'configuration'
  | 'invalid'
  | 'notFound'
  | 'rateLimited'
  | 'siteBusy'
  | 'unavailable';

export class CloudSharingError extends Error {
  constructor(
    public readonly code: CloudSharingErrorCode,
    message: string,
    public readonly retryAfterSeconds: number | null = null,
    public readonly retryWindow: CloudUploadRetryWindow | null = null,
  ) {
    super(message);
    this.name = 'CloudSharingError';
  }
}

export interface CreatedCloudShare {
  createdAt: string;
  shareId: string;
}

export interface CloudSecretFileSnapshot extends CreatedCloudShare {
  secretFile: SecretFile;
}

let firebaseAppPromise: Promise<FirebaseApp> | null = null;
let createShareCallablePromise: Promise<HttpsCallable<{ secretFile: SecretFile }, unknown>> | null = null;
let firestoreReadContextPromise: Promise<{
  getShareDocument: (shareId: string) => Promise<unknown | null>;
}> | null = null;

function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
    appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  };
}

function validateFirebaseConfig(): ReturnType<typeof getFirebaseConfig> {
  const config = getFirebaseConfig();
  const siteKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim();

  if (!config.apiKey || !config.appId || !config.projectId || !siteKey) {
    throw new CloudSharingError('configuration', 'Firebase cloud sharing is not configured.');
  }

  return config;
}

async function getFirebaseApp(): Promise<FirebaseApp> {
  if (firebaseAppPromise) return firebaseAppPromise;

  firebaseAppPromise = (async () => {
    const config = validateFirebaseConfig();
    const siteKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim();

    if (!siteKey) {
      throw new CloudSharingError('configuration', 'Firebase App Check is not configured.');
    }
    const [{ getApp, getApps, initializeApp }, appCheckModule] = await Promise.all([
      import('firebase/app'),
      import('firebase/app-check'),
    ]);
    const existingApp = getApps().find((app) => app.name === firebaseAppName);
    const app: FirebaseApp = existingApp ?? initializeApp(config, firebaseAppName);
    const debugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN?.trim();

    if (import.meta.env.DEV && debugToken) {
      (globalThis as typeof globalThis & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string })
        .FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken === 'true' ? true : debugToken;
    }

    appCheckModule.initializeAppCheck(getApp(firebaseAppName), {
      isTokenAutoRefreshEnabled: true,
      provider: new appCheckModule.ReCaptchaEnterpriseProvider(siteKey),
    });

    return app;
  })().catch((error) => {
    firebaseAppPromise = null;
    throw normalizeCloudSharingError(error);
  });

  return firebaseAppPromise;
}

async function getCreateShareCallable(): Promise<HttpsCallable<{ secretFile: SecretFile }, unknown>> {
  if (createShareCallablePromise) return createShareCallablePromise;

  createShareCallablePromise = (async () => {
    const [app, functionsModule] = await Promise.all([
      getFirebaseApp(),
      import('firebase/functions'),
    ]);
    const functions: Functions = functionsModule.getFunctions(app, cloudFunctionsRegion);

    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true') {
      functionsModule.connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    }

    return functionsModule.httpsCallable(functions, 'createSharedSecretFile', {
      limitedUseAppCheckTokens: true,
      timeout: 30_000,
    });
  })().catch((error) => {
    createShareCallablePromise = null;
    throw normalizeCloudSharingError(error);
  });

  return createShareCallablePromise;
}

async function getFirestoreReadContext(): Promise<{
  getShareDocument: (shareId: string) => Promise<unknown | null>;
}> {
  if (firestoreReadContextPromise) return firestoreReadContextPromise;

  firestoreReadContextPromise = (async () => {
    const [app, firestoreShareReaderModule] = await Promise.all([
      getFirebaseApp(),
      import('./firestoreShareReader'),
    ]);

    return {
      getShareDocument: firestoreShareReaderModule.createFirestoreShareReader(
        app,
        import.meta.env.DEV && import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true',
      ),
    };
  })().catch((error) => {
    firestoreReadContextPromise = null;
    throw normalizeCloudSharingError(error);
  });

  return firestoreReadContextPromise;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseCreatedShare(value: unknown): CreatedCloudShare {
  if (
    !isRecord(value) ||
    typeof value.shareId !== 'string' ||
    !isCloudShareId(value.shareId) ||
    typeof value.createdAt !== 'string' ||
    Number.isNaN(Date.parse(value.createdAt))
  ) {
    throw new CloudSharingError('invalid', 'The cloud response is invalid.');
  }

  return { createdAt: value.createdAt, shareId: value.shareId };
}

function normalizeCloudSharingError(error: unknown): CloudSharingError {
  if (error instanceof CloudSharingError) return error;

  const code = isRecord(error) && typeof error.code === 'string' ? error.code : '';
  const details = isRecord(error) && isRecord(error.details) ? error.details : null;
  const retryAfterSeconds = details && typeof details.retryAfterSeconds === 'number'
    ? details.retryAfterSeconds
    : null;
  const reason = details && typeof details.reason === 'string' ? details.reason : '';
  const retryWindow = details && (details.retryWindow === 'day' || details.retryWindow === 'hour')
    ? details.retryWindow
    : null;

  if (code.endsWith('/resource-exhausted')) {
    if (reason === 'global-rate-limit') {
      return new CloudSharingError(
        'siteBusy',
        'Site upload limit reached.',
        retryAfterSeconds,
        retryWindow,
      );
    }

    return new CloudSharingError(
      'rateLimited',
      'Upload rate limit reached.',
      retryAfterSeconds,
      retryWindow,
    );
  }

  if (code.endsWith('/not-found')) {
    return new CloudSharingError('notFound', 'Cloud secret file not found.');
  }

  if (code.endsWith('/invalid-argument') || code.endsWith('/data-loss')) {
    return new CloudSharingError('invalid', 'Cloud secret file is invalid.');
  }

  return new CloudSharingError('unavailable', 'Cloud sharing is temporarily unavailable.');
}

export async function createCloudSecretFile(secretFile: SecretFile): Promise<CreatedCloudShare> {
  try {
    const createShare = await getCreateShareCallable();
    const result = await createShare({ secretFile: parseSecretFile(secretFile) });
    return parseCreatedShare(result.data);
  } catch (error) {
    throw normalizeCloudSharingError(error);
  }
}

export async function loadCloudSecretFile(shareId: string): Promise<CloudSecretFileSnapshot> {
  if (!isCloudShareId(shareId)) {
    throw new CloudSharingError('notFound', 'Cloud secret file not found.');
  }

  try {
    const context = await getFirestoreReadContext();
    const shareDocument = await context.getShareDocument(shareId);

    if (shareDocument === null) {
      throw new CloudSharingError('notFound', 'Cloud secret file not found.');
    }

    const createdShare = parseCreatedShare(shareDocument);

    if (!isRecord(shareDocument) || !('secretFile' in shareDocument)) {
      throw new CloudSharingError('invalid', 'The cloud response is invalid.');
    }

    return {
      ...createdShare,
      secretFile: parseSecretFile(shareDocument.secretFile),
    };
  } catch (error) {
    throw normalizeCloudSharingError(error);
  }
}
