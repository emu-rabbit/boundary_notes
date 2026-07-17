<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAppShell } from '../app/useAppShell';
import SecretFileTitle from '../components/SecretFileTitle.vue';
import SponsorDialog from '../features/sponsor/SponsorDialog.vue';
import { getSponsorMessages } from '../features/sponsor/sponsorMessages';
import { homeRabbitUrl, warmRabbitAssets } from '../features/story/rabbitAssets';

const {
  localizedHomeEntrances: entrances,
  locale,
  messages,
  navigate,
  titleParts,
} = useAppShell();

const routeById = computed(() => new Map(entrances.value.map((entrance) => [entrance.id, entrance])));
const primaryEntrances = computed(() =>
  entrances.value.filter(
    (entrance) =>
      entrance.id === 'create' || entrance.id === 'files' || entrance.id === 'timeMachine',
  ),
);
const aboutEntrance = computed(() => routeById.value.get('about'));
const settingsEntrance = computed(() => routeById.value.get('settings'));
const sponsorDialog = ref<InstanceType<typeof SponsorDialog> | null>(null);
const sponsorMessages = computed(() => getSponsorMessages(locale.value));

onMounted(() => {
  warmRabbitAssets();
});
</script>

<template>
  <section class="home-route">
    <div class="home-ambient" aria-hidden="true" />

    <div class="home-stage">
      <img
        :src="homeRabbitUrl"
        :alt="messages.assets.homeRabbitAlt"
        class="home-rabbit"
        width="1024"
        height="1536"
        decoding="async"
      />
      <div class="home-copy">
        <p class="home-kicker">{{ messages.home.kicker }}</p>
        <SecretFileTitle :parts="titleParts" variant="home" />
        <p>
          {{ messages.home.copy }}
        </p>
      </div>
    </div>

    <nav class="home-entrances" :aria-label="messages.home.navAria">
      <button
        v-for="entrance in primaryEntrances"
        :key="entrance.id"
        class="entrance-card"
        :data-route="entrance.id"
        type="button"
        @click="navigate(entrance.id)"
      >
        <span class="entrance-state">
          {{ entrance.state === 'ready' ? messages.common.ready : messages.common.planned }}
        </span>
        <span class="entrance-title">{{ entrance.label }}</span>
        <span class="entrance-summary">{{ entrance.summary }}</span>
      </button>
    </nav>

    <div class="home-footer-actions">
      <button
        v-if="settingsEntrance"
        class="soft-link-action"
        type="button"
        @click="navigate(settingsEntrance.id)"
      >
        {{ settingsEntrance.label }}
      </button>
      <button
        v-if="aboutEntrance"
        class="soft-link-action"
        type="button"
        @click="navigate(aboutEntrance.id)"
      >
        {{ aboutEntrance.label }}
      </button>
      <button
        class="soft-link-action"
        type="button"
        @click="sponsorDialog?.open()"
      >
        {{ sponsorMessages.trigger }}
      </button>
    </div>

    <SponsorDialog ref="sponsorDialog" :locale="locale" />
  </section>
</template>
