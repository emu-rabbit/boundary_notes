import type { AppLocale } from '../../../app/i18n';
import type { QuestionRole, SecretFileScope } from '../../secret-file';
import type { CategoryQuestion, QuestionBank, QuestionBankCategory } from '../types';
import { getDetailTitle } from '../detailTitles';
import { localizedCategoryCopy } from './categories';
import { getLocalizedDetails } from './details';
import type { TranslatedQuestionBankLocale } from './types';

function isTranslatedLocale(locale: AppLocale): locale is TranslatedQuestionBankLocale {
  return locale !== 'zh-Hant';
}

export function localizeQuestionBank(source: QuestionBank, locale: AppLocale): QuestionBank {
  if (!isTranslatedLocale(locale)) {
    return source;
  }

  const categories = localizedCategoryCopy[locale];
  const details = getLocalizedDetails(locale);

  return {
    ...source,
    categories: source.categories.map<QuestionBankCategory>((category) => {
      const translatedCategory = categories[category.categoryId];
      const translatedDetails = details[category.categoryId];

      if (!translatedCategory || !translatedDetails) {
        throw new Error(`Missing ${locale} translation data for category ${category.categoryId}.`);
      }

      return {
        ...category,
        ...translatedCategory,
        detailItems: category.detailItems.map((item) => {
          const translatedItem = translatedDetails[item.detailId];

          if (!translatedItem) {
            throw new Error(`Missing ${locale} translation for ${category.categoryId}: ${item.detailId}.`);
          }

          return {
            detailId: item.detailId,
            roles: {
              active: {
                description: translatedItem.roles.active.description,
                title: translatedItem.roles.active.title ?? getDetailTitle(
                  locale,
                  item.detailId,
                  'active',
                  translatedItem.label,
                ),
              },
              passive: {
                description: translatedItem.roles.passive.description,
                title: translatedItem.roles.passive.title ?? getDetailTitle(
                  locale,
                  item.detailId,
                  'passive',
                  translatedItem.label,
                ),
              },
            },
            sourceLabel: translatedItem.label,
            warning: translatedItem.warning,
          };
        }),
      };
    }),
  };
}

export function getLocalizedCategoryQuestionsForScope(
  source: QuestionBank,
  locale: AppLocale,
  scope: SecretFileScope,
): readonly CategoryQuestion[] {
  const bank = localizeQuestionBank(source, locale);
  const roles: readonly QuestionRole[] =
    scope === 'all' ? ['active', 'passive'] : [scope === 'activeOnly' ? 'active' : 'passive'];

  return roles.flatMap((role) =>
    bank.categories
      .filter((category) => category.includeInCategoryRound)
      .map((category) => ({
        category,
        id: `category.${category.categoryId}.${role}`,
        level: 'category' as const,
        role,
      })),
  );
}

export type { TranslatedQuestionBankLocale } from './types';
