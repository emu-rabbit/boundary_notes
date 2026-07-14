/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_APPCHECK_DEBUG_TOKEN?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY?: string;
  readonly VITE_FIREBASE_USE_EMULATORS?: string;
  readonly VITE_SHOW_ANALYTICS_CONSENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
