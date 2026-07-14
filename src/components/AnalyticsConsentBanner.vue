<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAppShell } from '../app/useAppShell';
import {
  declineAnalyticsConsentForRuntime,
  grantAnalyticsConsent,
} from '../features/analytics/analytics';

const { messages } = useAppShell();
const banner = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

function syncReservedSpace(): void {
  if (!banner.value) return;
  document.documentElement.style.setProperty(
    '--analytics-consent-height',
    `${Math.ceil(banner.value.getBoundingClientRect().height)}px`,
  );
}

onMounted(() => {
  document.body.classList.add('has-analytics-consent');
  syncReservedSpace();

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(syncReservedSpace);
    if (banner.value) resizeObserver.observe(banner.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  document.body.classList.remove('has-analytics-consent');
  document.documentElement.style.removeProperty('--analytics-consent-height');
});
</script>

<template>
  <aside ref="banner" class="analytics-consent-banner" aria-labelledby="analytics-consent-title">
    <div class="analytics-consent-banner__inner">
      <div class="analytics-consent-banner__copy">
        <h2 id="analytics-consent-title">{{ messages.analyticsConsent.title }}</h2>
        <p>{{ messages.analyticsConsent.body }}</p>
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ messages.analyticsConsent.googleDetails }}
        </a>
      </div>
      <div class="analytics-consent-banner__actions">
        <button type="button" class="analytics-consent-action analytics-consent-action--accept" @click="grantAnalyticsConsent">
          {{ messages.analyticsConsent.accept }}
        </button>
        <button type="button" class="analytics-consent-action" @click="declineAnalyticsConsentForRuntime">
          {{ messages.analyticsConsent.decline }}
        </button>
      </div>
    </div>
  </aside>
</template>
