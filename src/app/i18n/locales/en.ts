import type { LocaleMessages } from '../types';

export const enMessages: LocaleMessages = {
  analyticsConsent: {
    accept: 'Allow Anonymous Analytics',
    body: 'With your consent, we’ll use Google Analytics to improve Boundary Notes. We won’t send your personal content, and you can turn off tracking at any time in Settings.',
    decline: 'Not Now',
    googleDetails: 'How Google handles this data',
    settingsActionDisable: 'Stop Anonymous Analytics',
    settingsActionEnable: 'Allow Anonymous Analytics',
    settingsBody: 'Anonymous analytics records page and feature usage only. It never includes your name, answers, notes, file IDs, or share links. You can change this choice at any time.',
    settingsDisabled: 'Anonymous analytics is not allowed',
    settingsEnabled: 'Anonymous analytics is allowed',
    settingsTitle: 'Anonymous Usage Analytics',
    title: 'May the Secret-Keeping Bunny record anonymous usage?',
  },
  about: {
    body: 'This bunny helps you gather what you feel now, where your boundaries are, and what you want to say clearly. It is only a starting point for conversation, not a decision made for anyone.',
    replayStory: 'Replay intro',
    title: 'About This Bunny',
  },
  assets: {
    homeRabbitAlt: 'A white bunny waving while holding a secret file notebook.',
    settingsRabbitAlt: 'A white bunny holding a settings board with gear symbols on the board.',
  },
  brand: {
    restartStoryAria: (title) => `${title}: restart the intro story`,
  },
  common: {
    backHome: 'Home',
    planned: 'Planned',
    ready: 'Ready',
  },
  home: {
    copy: 'Take your time today. You can create a new file, continue from an old one, look at what has changed, or share this part of you with someone.',
    kicker: 'Welcome back',
    navAria: 'Main entrances for the secret file',
  },
  notFound: {
    action: 'Back to Home',
    body: 'There is no file at this location. The address may have changed or picked up an extra path.',
    kicker: '404 | Page Not Found',
    title: 'The Secret-Keeping Bunny Looked Everywhere',
  },
  routes: {
    story: {
      label: 'Intro',
      summary: 'Let the bunny guide you into the first secret-file scene.',
    },
    home: {
      label: 'Home',
      summary: 'A starting point for the main flows still to come.',
    },
    create: {
      label: 'New File',
      summary: 'Start a new test and sort experience, interest, and notes.',
    },
    preview: {
      label: 'View File',
      summary: 'Read and understand a secret file without editing it.',
    },
    files: {
      label: 'Old Files',
      summary: 'Review local files, edit them, or open a cloud file by link.',
    },
    timeMachine: {
      label: 'Time Machine',
      summary: 'Compare files and see how boundaries and feelings move.',
    },
    about: {
      label: 'About This Bunny',
      summary: 'See how this project helps gather boundaries and conversation starters.',
    },
    settings: {
      label: 'Settings',
      summary: 'Adjust language, preferences, and local data options.',
    },
  },
  settings: {
    body: 'These settings stay on this device.',
    languageLabel: 'Language for the Bunny',
    profileFieldLabel: 'Name',
    profileLabel: 'What should I call you?',
    profilePlaceholder: 'Bunny',
    profileSaved: 'Saved',
    saveProfile: 'Save Name',
    title: 'Settings',
  },
  story: {
    languageQuestion: '......?',
    nameFieldLabel: 'Name',
    speakerName: 'A bunny from somewhere',
    steps: {
      'self-question': {
        lines: ['Hi! I wonder what wind carried you here.', 'But... do you know yourself?'],
        choices: [
          { label: 'I do', next: 'self-yes' },
          { label: "I don't", next: 'self-no' },
          { label: "I'm not sure", next: 'self-unsure' },
        ],
      },
      'self-yes': {
        message: 'Great. Then I think the next part will feel easy in your hands.',
        action: '(Proud)',
      },
      'self-no': {
        message: 'Then I think I can help you find yourself a little more clearly.',
        action: 'Really?',
      },
      'self-unsure': {
        message: 'That is wonderful news. The unknown can be the most charming place to explore.',
        action: 'I think so too',
      },
      'other-question': {
        lines: ['But... does that person know you?'],
        choices: [
          { label: 'They do', next: 'other-yes' },
          { label: "They don't", next: 'other-no' },
          { label: 'Who is that?', next: 'other-who' },
        ],
      },
      'other-yes': {
        message: 'Then this is a chance to play a little game. Let us see how many points they get.',
        action: 'That sounds cool!',
      },
      'other-no': {
        message: 'It is okay. There is a chance here to take the first step.',
        action: 'What should I do?',
      },
      'other-who': {
        message: 'That person? Maybe your next date, maybe your partner, or anyone you want to let closer to this part of you.',
        action: 'Got it',
      },
      name: {
        lines: ['What should I call you?'],
        action: 'Write it down',
      },
      file: {
        body: [
          'Here, we will carefully record your likes and comfort with different BDSM items. There are no right answers here. You are still you, and desire is still desire.',
          'You can save it, share it with someone in your heart, or use it to talk with someone. If you come back later, I would like to hear what has changed.',
        ],
        action: 'OK',
      },
    },
  },
  title: {
    connector: "'s ",
    defaultProfileName: 'Bunny',
    objectLabel: 'Secret File',
  },
};
