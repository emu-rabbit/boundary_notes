import { computed, type Ref } from 'vue';
import { defaultProfileName, measureProfileNameVisualWidth } from './useProfileNameStorage';

const secretFileObjectLabel = '祕密檔案';
const secretFilePossessiveLabel = '的';

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

export function useSecretFileTitle(profileName: Ref<string>) {
  const displayName = computed(() => profileName.value.trim() || defaultProfileName);
  const appTitle = computed(
    () => `${displayName.value}${secretFilePossessiveLabel}${secretFileObjectLabel}`,
  );
  const titleParts = computed<SecretFileTitleParts>(() => {
    const visualWidth = measureProfileNameVisualWidth(displayName.value);

    return {
      connector: secretFilePossessiveLabel,
      density: getTitleDensity(visualWidth),
      fullTitle: appTitle.value,
      objectLabel: secretFileObjectLabel,
      ownerName: displayName.value,
      ownerScale: getOwnerScale(visualWidth),
    };
  });

  return {
    appTitle,
    displayName,
    titleParts,
  };
}
