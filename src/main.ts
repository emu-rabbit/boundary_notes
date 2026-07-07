import { createApp } from 'vue';
import App from './App.vue';
import './styles.css';
import './styles/foundation.css';
import './styles/route-shell.css';
import './styles/story-stage.css';
import './styles/story-dialogue.css';
import './styles/home-page.css';
import './styles/secondary-pages.css';
import './styles/responsive.css';

createApp(App).mount('#app');

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});
