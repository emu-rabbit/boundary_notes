<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useAppShell } from '../app/useAppShell';
import { profileNameMaxLength } from '../app/useProfileNameStorage';
import {
  analyticsConsentState,
  grantAnalyticsConsent,
  isAnalyticsConsentUiEnabled,
  revokeAnalyticsConsent,
} from '../features/analytics/analytics';
import { settingsRabbitUrl } from '../features/story/rabbitAssets';

const {
  appTitle,
  locale: activeLocale,
  localeOptions,
  messages,
  navigate,
  profileName,
  setLocale,
  updateProfileName,
} = useAppShell();

const profileNameDraft = ref(profileName.value);
const profileSaveFeedbackVisible = ref(false);
const profileSaveFeedbackKey = ref(0);
let profileSaveFeedbackTimeout: ReturnType<typeof window.setTimeout> | null = null;

const isProfileNameSaved = computed(() => profileNameDraft.value === profileName.value);
const analyticsEnabled = computed(() => analyticsConsentState.value === 'granted');

function toggleAnalyticsConsent(): void {
  if (analyticsEnabled.value) {
    revokeAnalyticsConsent();
  } else {
    grantAnalyticsConsent();
  }
}

function saveProfileName(): void {
  if (isProfileNameSaved.value) {
    return;
  }

  updateProfileName(profileNameDraft.value);
  profileSaveFeedbackVisible.value = true;
  profileSaveFeedbackKey.value += 1;

  if (profileSaveFeedbackTimeout) {
    window.clearTimeout(profileSaveFeedbackTimeout);
  }

  profileSaveFeedbackTimeout = window.setTimeout(() => {
    profileSaveFeedbackVisible.value = false;
    profileSaveFeedbackTimeout = null;
  }, 3000);
}

watch(profileName, (name) => {
  profileNameDraft.value = name;
});

watch(profileNameDraft, (draft) => {
  if (draft !== profileName.value) {
    profileSaveFeedbackVisible.value = false;
    profileSaveFeedbackKey.value += 1;
  }
});

onBeforeUnmount(() => {
  if (profileSaveFeedbackTimeout) {
    window.clearTimeout(profileSaveFeedbackTimeout);
  }
});
</script>

<template>
  <section class="settings-route">
    <div class="home-ambient" aria-hidden="true" />
    <div class="settings-stage">
      <div class="settings-character">
        <img
          :src="settingsRabbitUrl"
          :alt="messages.assets.settingsRabbitAlt"
          class="settings-rabbit"
          width="1024"
          height="1536"
          decoding="async"
        />
      </div>
      <div class="settings-copy">
        <div class="settings-heading">
          <p class="home-kicker">{{ appTitle }}</p>
          <h1>{{ messages.settings.title }}</h1>
        </div>
        <p class="settings-device-note">{{ messages.settings.body }}</p>

        <form class="settings-panel" :aria-label="messages.settings.profileLabel" @submit.prevent="saveProfileName">
          <div class="settings-panel__heading">
            <span>{{ messages.settings.profileLabel }}</span>
          </div>
          <label class="settings-name-field">
            <input
              v-model="profileNameDraft"
              :aria-label="messages.settings.profileFieldLabel"
              :placeholder="messages.settings.profilePlaceholder"
              autocomplete="nickname"
              :maxlength="profileNameMaxLength"
              type="text"
              @blur="saveProfileName"
            />
            <span
              v-if="profileSaveFeedbackVisible"
              :key="profileSaveFeedbackKey"
              class="settings-name-field__saved"
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true">✓</span>
              {{ messages.settings.profileSaved }}
            </span>
          </label>
        </form>

        <section class="settings-panel" :aria-label="messages.settings.languageLabel">
          <div class="settings-panel__heading">
            <span>{{ messages.settings.languageLabel }}</span>
          </div>
          <div class="settings-language-grid" role="list">
            <button
              v-for="option in localeOptions"
              :key="option.id"
              class="language-choice"
              :class="{ 'language-choice--active': option.id === activeLocale }"
              :aria-pressed="option.id === activeLocale"
              type="button"
              @click="setLocale(option.id)"
            >
              <span>{{ option.label }}</span>
            </button>
          </div>
        </section>

        <section
          v-if="isAnalyticsConsentUiEnabled"
          class="settings-panel"
          :aria-label="messages.analyticsConsent.settingsTitle"
        >
          <div class="settings-panel__heading">
            <span>{{ messages.analyticsConsent.settingsTitle }}</span>
            <small class="settings-analytics-state">
              {{ analyticsEnabled
                ? messages.analyticsConsent.settingsEnabled
                : messages.analyticsConsent.settingsDisabled }}
            </small>
          </div>
          <p class="settings-analytics-copy">{{ messages.analyticsConsent.settingsBody }}</p>
          <button class="settings-analytics-action" type="button" @click="toggleAnalyticsConsent">
            {{ analyticsEnabled
              ? messages.analyticsConsent.settingsActionDisable
              : messages.analyticsConsent.settingsActionEnable }}
          </button>
        </section>

        <button class="quiet-action" type="button" @click="navigate('home')">
          {{ messages.common.backHome }}
        </button>
      </div>
    </div>
  </section>
</template>
