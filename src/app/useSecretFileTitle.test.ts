import { computed, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { messagesByLocale } from './i18n';
import { formatDocumentTitle, useSecretFileTitle } from './useSecretFileTitle';

describe('useSecretFileTitle', () => {
  it('keeps the product title separate from the branded document title', () => {
    const profileName = ref('');
    const title = useSecretFileTitle(profileName, computed(() => messagesByLocale.en));

    expect(title.appTitle.value).toBe("Bunny's Secret File");
    expect(title.documentTitle.value).toBe("Bunny's Secret File | Boundary Notes");
    expect(title.titleParts.value.fullTitle).toBe("Bunny's Secret File");
  });

  it('keeps a user name dynamic while preserving the stable brand suffix', () => {
    const profileName = ref('Mira');
    const title = useSecretFileTitle(profileName, computed(() => messagesByLocale.en));

    expect(title.documentTitle.value).toBe("Mira's Secret File | Boundary Notes");
  });
});

describe('formatDocumentTitle', () => {
  it('appends the stable brand to a localized product title', () => {
    expect(formatDocumentTitle('兔子的祕密檔案')).toBe('兔子的祕密檔案 | Boundary Notes');
  });
});
