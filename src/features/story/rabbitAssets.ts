import rabbitAboutUrl from '../../assets/story/rabbit-about.webp';
import rabbitFolderUrl from '../../assets/story/rabbit-folder.webp';
import rabbitGreetingUrl from '../../assets/story/rabbit-greeting.webp';
import rabbitNamingUrl from '../../assets/story/rabbit-naming.webp';
import rabbitQuestioningUrl from '../../assets/story/rabbit-questioning.webp';
import rabbitSettingsUrl from '../../assets/story/rabbit-settings.webp';
import rabbitStartledUrl from '../../assets/story/rabbit-startled.webp';
import rabbitStoryGreetingUrl from '../../assets/story/rabbit-story-greeting.webp';
import rabbitThinkingUrl from '../../assets/story/rabbit-thinking.webp';
import rabbitTimeMachineDepartUrl from '../../assets/story/rabbit-time-machine-depart.webp';
import rabbitTimeMachineFilesUrl from '../../assets/story/rabbit-time-machine-files.webp';
import rabbitTimeMachineGiggleUrl from '../../assets/story/rabbit-time-machine-giggle.webp';
import rabbitTimeMachineHugUrl from '../../assets/story/rabbit-time-machine-hug.webp';
import rabbitTimeMachineOverwhelmedUrl from '../../assets/story/rabbit-time-machine-overwhelmed.webp';
import rabbitTimeMachinePoliceUrl from '../../assets/story/rabbit-time-machine-police.webp';
import rabbitTimeMachineProudUrl from '../../assets/story/rabbit-time-machine-proud.webp';
import rabbitTimeMachineStoryUrl from '../../assets/story/rabbit-time-machine-story.webp';

export type RabbitPose =
  | 'greeting'
  | 'questioning'
  | 'storyGreeting'
  | 'thinking'
  | 'startled'
  | 'naming'
  | 'folder'
  | 'timeMachineDepart'
  | 'timeMachineFiles'
  | 'timeMachineGiggle'
  | 'timeMachineHug'
  | 'timeMachineOverwhelmed'
  | 'timeMachinePolice'
  | 'timeMachineProud'
  | 'timeMachineStory';

export const rabbitPoseUrls: Record<RabbitPose, string> = {
  greeting: rabbitGreetingUrl,
  questioning: rabbitQuestioningUrl,
  storyGreeting: rabbitStoryGreetingUrl,
  thinking: rabbitThinkingUrl,
  startled: rabbitStartledUrl,
  naming: rabbitNamingUrl,
  folder: rabbitFolderUrl,
  timeMachineDepart: rabbitTimeMachineDepartUrl,
  timeMachineFiles: rabbitTimeMachineFilesUrl,
  timeMachineGiggle: rabbitTimeMachineGiggleUrl,
  timeMachineHug: rabbitTimeMachineHugUrl,
  timeMachineOverwhelmed: rabbitTimeMachineOverwhelmedUrl,
  timeMachinePolice: rabbitTimeMachinePoliceUrl,
  timeMachineProud: rabbitTimeMachineProudUrl,
  timeMachineStory: rabbitTimeMachineStoryUrl,
};

export const timeMachineRabbitPoseUrls = {
  greeting: rabbitGreetingUrl,
  questioning: rabbitQuestioningUrl,
  storyGreeting: rabbitStoryGreetingUrl,
  thinking: rabbitThinkingUrl,
  naming: rabbitNamingUrl,
  folder: rabbitFolderUrl,
  timeMachineDepart: rabbitTimeMachineDepartUrl,
  timeMachineFiles: rabbitTimeMachineFilesUrl,
  timeMachineGiggle: rabbitTimeMachineGiggleUrl,
  timeMachineHug: rabbitTimeMachineHugUrl,
  timeMachineOverwhelmed: rabbitTimeMachineOverwhelmedUrl,
  timeMachinePolice: rabbitTimeMachinePoliceUrl,
  timeMachineProud: rabbitTimeMachineProudUrl,
  timeMachineStory: rabbitTimeMachineStoryUrl,
} as const satisfies Partial<Record<RabbitPose, string>>;

export const homeRabbitUrl = rabbitGreetingUrl;
export const aboutRabbitUrl = rabbitAboutUrl;
export const settingsRabbitUrl = rabbitSettingsUrl;
export const filesRabbitUrl = rabbitFolderUrl;

const rabbitAssetUrls = [...new Set([
  ...Object.values(rabbitPoseUrls),
  aboutRabbitUrl,
  settingsRabbitUrl,
])];
const warmedRabbitUrls = new Set<string>();

function warmRabbitAsset(src: string): void {
  if (typeof Image === 'undefined' || warmedRabbitUrls.has(src)) return;

  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  warmedRabbitUrls.add(src);
}

export function warmRabbitAssets(): void {
  rabbitAssetUrls.forEach(warmRabbitAsset);
}

export function warmTimeMachineRabbitAssets(): void {
  Object.values(timeMachineRabbitPoseUrls).forEach(warmRabbitAsset);
}

export function warmStoryIntroFirstRabbitAsset(): void {
  warmRabbitAsset(rabbitPoseUrls.questioning);
}
