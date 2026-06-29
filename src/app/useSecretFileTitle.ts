import { computed, type Ref } from 'vue';

export function useSecretFileTitle(profileName: Ref<string>) {
  const displayName = computed(() => profileName.value.trim() || '兔子');
  const appTitle = computed(() => `${displayName.value}的祕密檔案`);

  return {
    appTitle,
    displayName,
  };
}
