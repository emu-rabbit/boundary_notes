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
  about: {
    body: string;
    replayStory: string;
    title: string;
  };
  assets: {
    homeRabbitAlt: string;
    settingsRabbitAlt: string;
  };
  brand: {
    restartStoryAria: (title: string) => string;
  };
  common: {
    backHome: string;
    planned: string;
    ready: string;
  };
  home: {
    copy: string;
    kicker: string;
    navAria: string;
  };
  notFound: {
    action: string;
    body: string;
    kicker: string;
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
