import type { LocaleMessages } from '../types';
import { enLegal } from '../legalDocuments';
import { secretKeeperNames } from '../terminology';

const secretKeeperName = secretKeeperNames.en;

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
    title: `May the ${secretKeeperName} record anonymous usage?`,
  },
  about: {
    body: 'This is a gentle, private place to reflect on BDSM boundaries, interests, desires, and the conditions that matter to you.',
    contentWarning: 'This website may include content about sexuality, bodies, power exchange, and higher-risk interactions. You can decide whether to use it based on how you feel, and you can stop at any time.',
    doesItems: ['Organize experience, interest, and boundaries', 'Notice how you change over time', 'Make a conversation easier to begin'],
    doesNotItems: ['Consent on anyone’s behalf', 'Match people or recommend activities', 'Assign you a fixed role'],
    doesNotTitle: `What the ${secretKeeperName} does not do`, doesTitle: `What the ${secretKeeperName} helps with`, emailSupport: `Email the ${secretKeeperName}`, githubSupport: 'Report an issue on GitHub', legalTitle: 'This website’s terms and the traces left along the way',
    missionBody: `The ${secretKeeperName} will stay with you as you sort through your experiences, interests, and boundaries, so the path to understanding yourself can feel a little less lonely. If you want, this can also be an invitation you send to someone to let them get to know you. Please remember that a secret file only supports boundary communication; informed consent still needs a present, voluntary check-in every time.`, missionTitle: 'Let your boundaries and likes show more clearly',
    principles: [{ title: 'You decide', body: 'There are no right answers and no fixed labels.' }, { title: 'Consent is in the moment', body: 'A file supports conversation; it never replaces a check-in.' }, { title: 'Share with care', body: 'A link may be sensitive. Give it only to someone you trust.' }],
    privacyPolicy: 'Privacy Policy', rabbitRoleBody: `The ${secretKeeperName} will not rush you or decide for anyone. Its job is to stay nearby and help turn feelings and boundaries into words another person can understand.`, rabbitRoleTitle: `The ${secretKeeperName}’s role`,
    replayStory: 'Replay intro',
    supportTitle: 'Need help? You can reach me here.', termsOfUse: 'Terms of Use',
    title: 'About This Bunny',
    versionHistory: 'Version history',
  },
  assets: {
    aboutRabbitAlt: `The white ${secretKeeperName} sits beside an open secret file, quietly helping someone organize their boundaries.`,
    homeRabbitAlt: 'A white bunny waving while holding a secret file notebook.',
    settingsRabbitAlt: 'A white bunny holding a settings board with gear symbols on the board.',
  },
  brand: {
    restartStoryAria: (title) => `${title}: restart the intro story`,
  },
  common: {
    backHome: 'Home',
    planned: 'Planned',
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
    title: `The ${secretKeeperName} Looked Everywhere`,
  },
  versionHistory: {
    backToAbout: 'Back to About This Bunny',
    entries: [{
      version: '1.0.0',
      items: ['Official release', 'Create notes', 'Manage existing files', 'Upload and share'],
    }],
    eyebrow: 'Boundary Notes',
    title: 'Version History',
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
      label: 'About',
      summary: 'See how this project helps gather boundaries and conversation starters.',
    },
    versionHistory: {
      label: 'Version History',
      summary: 'See what changed in each Boundary Notes release.',
    },
    settings: {
      label: 'Settings',
      summary: 'Adjust language, preferences, and local data options.',
    },
    terms: { label: 'Terms of Use', summary: 'Read the purpose, usage rules, and limits of responsibility.' },
    privacy: { label: 'Privacy Policy', summary: 'Learn what stays on your device, when data reaches the cloud, and your choices.' },
  },
  legal: enLegal,
  settings: {
    body: 'These settings stay on this device.',
    languageLabel: `Language for the ${secretKeeperName}`,
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
