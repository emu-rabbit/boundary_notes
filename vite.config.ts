import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  void command;
  const base = env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [vue()],
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});
