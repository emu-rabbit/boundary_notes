import { createApp, createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createAppRouter } from './app/router';
import { loadStoredLocale } from './app/i18n';
import { loadStoredProfileName } from './app/useProfileNameStorage';
import { installAnalyticsRouterTracking } from './features/analytics/analytics';
import { useSecretFileStore } from './features/secret-file/application/useSecretFileStore';
import './styles.css';
import './styles/foundation.css';
import './styles/route-shell.css';
import './styles/story-stage.css';
import './styles/story-dialogue.css';
import './styles/home-page.css';
import './styles/secondary-pages.css';
import './styles/legal-pages.css';
import './styles/file-manager.css';
import './styles/questionnaire.css';
import './styles/secret-file-preview.css';
import './styles/sponsor-dialog.css';
import './styles/analytics-consent.css';
import './styles/responsive.css';

const initialProfileName = loadStoredProfileName();
const initialLocale = loadStoredLocale();
const router = createAppRouter(
  import.meta.env.BASE_URL,
  initialProfileName ? 'home' : 'story',
  initialLocale,
);
const shouldHydrate = document.querySelector('#app')?.hasAttribute('data-prerendered') ?? false;
const app = shouldHydrate
  ? createSSRApp(App, { initialProfileName })
  : createApp(App, { initialProfileName });
const pinia = createPinia();

app.use(pinia);
app.use(router);
useSecretFileStore(pinia).refresh();
void router.isReady().then(() => {
  installAnalyticsRouterTracking(router);
  app.mount('#app');
});

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});
