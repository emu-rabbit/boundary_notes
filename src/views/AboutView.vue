<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppShell } from '../app/useAppShell';
import { getLocalizedRouteLocation } from '../app/routes';
import { aboutRabbitUrl } from '../features/story/rabbitAssets';

const { appTitle, locale, messages, navigate } = useAppShell();
const router = useRouter();

const termsHref = computed(() => router.resolve(getLocalizedRouteLocation('terms', locale.value)).href);
const privacyHref = computed(() => router.resolve(getLocalizedRouteLocation('privacy', locale.value)).href);
const versionHistoryHref = computed(() => router.resolve(getLocalizedRouteLocation('versionHistory', locale.value)).href);
</script>

<template>
  <main class="about-route">
    <div class="home-ambient" aria-hidden="true" />
    <div class="about-stage">
      <button class="about-back-action" type="button" @click="navigate('home')">
        <span aria-hidden="true">←</span>{{ messages.common.backHome }}
      </button>

      <header class="about-hero">
        <div class="about-hero__copy">
          <p class="home-kicker" data-allow-mismatch="text">{{ appTitle }}</p>
          <h1>{{ messages.about.title }}</h1>
          <p class="about-intro">{{ messages.about.body }}</p>

          <section class="about-mission">
            <span aria-hidden="true">✦</span>
            <div>
              <h2>{{ messages.about.missionTitle }}</h2>
              <p>{{ messages.about.missionBody }}</p>
            </div>
          </section>

          <aside class="about-content-warning">
            <span aria-hidden="true">!</span>
            <p>{{ messages.about.contentWarning }}</p>
          </aside>
        </div>
        <div class="about-character">
          <div class="about-character__glow" aria-hidden="true" />
          <img
            :src="aboutRabbitUrl"
            :alt="messages.assets.aboutRabbitAlt"
            class="about-rabbit"
            width="1024"
            height="1024"
            decoding="async"
          />
          <button class="about-replay-action" type="button" @click="navigate('story')">
            <span aria-hidden="true">↻</span>{{ messages.about.replayStory }}
          </button>
        </div>
      </header>

      <div class="about-utility-grid">
        <section class="about-utility-card">
          <h2>{{ messages.about.legalTitle }}</h2>
          <div class="about-link-stack">
            <a :href="termsHref" target="_blank" rel="noopener noreferrer">
              <span>{{ messages.about.termsOfUse }}</span><span aria-hidden="true">↗</span>
            </a>
            <a :href="privacyHref" target="_blank" rel="noopener noreferrer">
              <span>{{ messages.about.privacyPolicy }}</span><span aria-hidden="true">↗</span>
            </a>
            <a :href="versionHistoryHref">
              <span>{{ messages.about.versionHistory }}</span><span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section class="about-utility-card about-support-card">
          <h2>{{ messages.about.supportTitle }}</h2>
          <div class="about-support-actions">
            <a href="https://github.com/emu-rabbit/boundary_notes/issues/new" target="_blank" rel="noopener noreferrer">
              {{ messages.about.githubSupport }} <span aria-hidden="true">↗</span>
            </a>
            <a href="mailto:mausu2526@gmail.com">{{ messages.about.emailSupport }}</a>
          </div>
        </section>
      </div>

    </div>
  </main>
</template>
