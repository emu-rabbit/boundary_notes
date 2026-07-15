import { describe, expect, it } from 'vitest';
import { getQuestionnaireMessages } from '../../features/questionnaire/messages';
import { getFileManagerMessages } from '../../features/secret-file/fileManagerMessages';
import { messagesByLocale } from './index';
import { secretKeeperNames } from './terminology';

describe('secret keeper terminology', () => {
  it.each(Object.entries(secretKeeperNames))(
    'uses the canonical name in %s character-name copy',
    (locale, name) => {
      const appLocale = locale as keyof typeof secretKeeperNames;
      const messages = messagesByLocale[appLocale];
      const namedCharacterCopy = [
        messages.analyticsConsent.title,
        messages.about.doesNotTitle,
        messages.about.doesTitle,
        messages.about.emailSupport,
        messages.about.missionBody,
        messages.about.rabbitRoleBody,
        messages.about.rabbitRoleTitle,
        messages.assets.aboutRabbitAlt,
        messages.notFound.title,
        messages.settings.languageLabel,
        messages.legal.terms.intro,
        messages.legal.privacy.intro,
        getFileManagerMessages(appLocale).rabbitAlt,
      ];

      expect(namedCharacterCopy.every((copy) => copy.includes(name))).toBe(true);
      expect(getQuestionnaireMessages(appLocale).intro.speakerName).toBe(name);
    },
  );
});
