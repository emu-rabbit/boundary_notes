import type { AppRouteId } from '../routes';
import type { StepId } from '../../features/story/storyTypes';

export type AppLocale = 'zh-Hant' | 'zh-Hans' | 'ja' | 'en';

export type LocaleOption = {
  id: AppLocale;
  label: string;
};

export type RouteMessage = {
  label: string;
  summary: string;
};

export type AboutPrincipleMessage = {
  body: string;
  title: string;
};

export type LegalSectionMessage = {
  items?: string[];
  paragraphs: string[];
  title: string;
};

export type LegalDocumentMessage = {
  controllingLanguage: string;
  eyebrow: string;
  intro: string;
  lastUpdated: string;
  lastUpdatedLabel: string;
  sections: LegalSectionMessage[];
  title: string;
};

export type StoryChoiceMessage = {
  label: string;
  next: StepId;
};

type ChoiceStoryStepMessage = {
  choices: StoryChoiceMessage[];
  lines: string[];
};

type MessageStoryStepMessage = {
  action: string;
  message: string;
};

export type StoryStepMessages = {
  'self-question': ChoiceStoryStepMessage;
  'self-yes': MessageStoryStepMessage;
  'self-no': MessageStoryStepMessage;
  'self-unsure': MessageStoryStepMessage;
  'other-question': ChoiceStoryStepMessage;
  'other-yes': MessageStoryStepMessage;
  'other-no': MessageStoryStepMessage;
  'other-who': MessageStoryStepMessage;
  name: {
    action: string;
    lines: string[];
  };
  file: {
    action: string;
    body: string[];
  };
};

export type LocaleMessages = {
  analyticsConsent: {
    accept: string;
    body: string;
    decline: string;
    googleDetails: string;
    settingsActionDisable: string;
    settingsActionEnable: string;
    settingsBody: string;
    settingsDisabled: string;
    settingsEnabled: string;
    settingsTitle: string;
    title: string;
  };
  about: {
    body: string;
    contentWarning: string;
    doesItems: string[];
    doesNotItems: string[];
    doesNotTitle: string;
    doesTitle: string;
    emailSupport: string;
    githubSupport: string;
    legalTitle: string;
    missionBody: string;
    missionTitle: string;
    principles: AboutPrincipleMessage[];
    privacyPolicy: string;
    rabbitRoleBody: string;
    rabbitRoleTitle: string;
    replayStory: string;
    supportTitle: string;
    termsOfUse: string;
    title: string;
    versionHistory: string;
  };
  assets: {
    aboutRabbitAlt: string;
    homeRabbitAlt: string;
    settingsRabbitAlt: string;
  };
  brand: {
    restartStoryAria: (title: string) => string;
  };
  common: {
    backHome: string;
    planned: string;
    skipStory: string;
  };
  home: {
    copy: string;
    kicker: string;
    navAria: string;
  };
  legal: {
    contactLabel: string;
    documentsLabel: string;
    languageLabel: string;
    operatorLabel: string;
    operatorName: string;
    privacy: LegalDocumentMessage;
    privacyLink: string;
    terms: LegalDocumentMessage;
    termsLink: string;
  };
  notFound: {
    action: string;
    body: string;
    kicker: string;
    title: string;
  };
  versionHistory: {
    backToAbout: string;
    entries: Array<{
      items: string[];
      version: string;
    }>;
    eyebrow: string;
    title: string;
  };
  routes: Record<AppRouteId, RouteMessage>;
  settings: {
    body: string;
    languageLabel: string;
    profileFieldLabel: string;
    profileLabel: string;
    profilePlaceholder: string;
    profileSaved: string;
    saveProfile: string;
    title: string;
  };
  story: {
    languageQuestion: string;
    nameFieldLabel: string;
    speakerName: string;
    steps: StoryStepMessages;
  };
  title: {
    connector: string;
    defaultProfileName: string;
    objectLabel: string;
  };
};
