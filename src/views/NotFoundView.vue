<script setup lang="ts">
import { useAppShell } from '../app/useAppShell';
import { homeRabbitUrl } from '../features/story/rabbitAssets';

const { messages, navigate } = useAppShell();
</script>

<template>
  <section class="planned-route">
    <div class="home-ambient" aria-hidden="true" />
    <div class="planned-stage">
      <img
        :src="homeRabbitUrl"
        :alt="messages.assets.homeRabbitAlt"
        class="planned-rabbit"
        width="1024"
        height="1536"
        decoding="async"
      />
      <div class="planned-copy">
        <p class="home-kicker">{{ messages.notFound.kicker }}</p>
        <h1>{{ messages.notFound.title }}</h1>
        <p>{{ messages.notFound.body }}</p>
        <button class="quiet-action" type="button" @click="navigate('home')">
          {{ messages.notFound.action }}
        </button>
      </div>
    </div>
  </section>
</template>
