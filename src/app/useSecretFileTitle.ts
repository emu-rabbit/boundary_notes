import { computed, type Ref } from 'vue';
import type { LocaleMessages } from './i18n';
import { measureProfileNameVisualWidth } from './useProfileNameStorage';

export const appBrandName = 'Boundary Notes';

export type SecretFileTitleDensity = 'default' | 'compact' | 'dense';

export type SecretFileTitleParts = {
  connector: string;
  density: SecretFileTitleDensity;
  fullTitle: string;
  objectLabel: string;
  ownerName: string;
  ownerScale: number;
};

function getTitleDensity(visualWidth: number): SecretFileTitleDensity {
  if (visualWidth > 13) {
    return 'dense';
  }

  if (visualWidth > 9) {
    return 'compact';
  }

  return 'default';
}

function getOwnerScale(visualWidth: number): number {
  if (visualWidth <= 9) {
    return 1;
  }

  if (visualWidth <= 13) {
    return 0.88;
  }

  if (visualWidth <= 18) {
    return 0.74;
  }

  if (visualWidth <= 24) {
    return 0.62;
  }

  return 0.52;
}

export function formatDocumentTitle(productTitle: string): string {
  return `${productTitle} | ${appBrandName}`;
}

export function useSecretFileTitle(
  profileName: Ref<string>,
  messages: { readonly value: LocaleMessages },
) {
  const displayName = computed(() => profileName.value.trim() || messages.value.title.defaultProfileName);
  const appTitle = computed(
    () =>
      `${displayName.value}${messages.value.title.connector}${messages.value.title.objectLabel}`,
  );
  const documentTitle = computed(() => formatDocumentTitle(appTitle.value));
  const titleParts = computed<SecretFileTitleParts>(() => {
    const visualWidth = measureProfileNameVisualWidth(displayName.value);

    return {
      connector: messages.value.title.connector,
      density: getTitleDensity(visualWidth),
      fullTitle: appTitle.value,
      objectLabel: messages.value.title.objectLabel,
      ownerName: displayName.value,
      ownerScale: getOwnerScale(visualWidth),
    };
  });

  return {
    appTitle,
    displayName,
    documentTitle,
    titleParts,
  };
}
