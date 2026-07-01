import rabbitFolderUrl from '../../assets/story/rabbit-folder.webp';
import rabbitGreetingUrl from '../../assets/story/rabbit-greeting.webp';
import rabbitNamingUrl from '../../assets/story/rabbit-naming.webp';
import rabbitThinkingUrl from '../../assets/story/rabbit-thinking.webp';

export type RabbitPose = 'greeting' | 'thinking' | 'naming' | 'folder';

export const rabbitPoseUrls: Record<RabbitPose, string> = {
  greeting: rabbitGreetingUrl,
  thinking: rabbitThinkingUrl,
  naming: rabbitNamingUrl,
  folder: rabbitFolderUrl,
};

export const homeRabbitUrl = rabbitGreetingUrl;

export function warmStoryAssets(): void {
  Object.values(rabbitPoseUrls).forEach((src) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  });
}
