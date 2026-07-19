import impactSpankingUrl from '../../assets/categories/01-impact-spanking.webp';
import whippingUrl from '../../assets/categories/02-whipping.webp';
import bondageUrl from '../../assets/categories/03-bondage.webp';
import ticklingUrl from '../../assets/categories/04-tickling.webp';
import painStimulationUrl from '../../assets/categories/05-pain-stimulation.webp';
import humiliationUrl from '../../assets/categories/06-humiliation.webp';
import serviceUrl from '../../assets/categories/07-service.webp';
import disciplineUrl from '../../assets/categories/08-discipline.webp';
import sexualInteractionUrl from '../../assets/categories/09-sexual-interaction.webp';
import analInteractionUrl from '../../assets/categories/10-anal.webp';
import multiPartyInteractionUrl from '../../assets/categories/11-multi-party.webp';
import enslavementUrl from '../../assets/categories/12-enslavement-role.webp';
import petPlayUrl from '../../assets/categories/13-pet-play.webp';
import rolePlayUrl from '../../assets/categories/14-role-play.webp';
import objectificationUrl from '../../assets/categories/15-objectification.webp';
import exposureUrl from '../../assets/categories/16-exposure.webp';
import imageRecordingUrl from '../../assets/categories/17-image-media.webp';
import piercingCuttingUrl from '../../assets/categories/18-piercing-cutting.webp';
import excretionUrl from '../../assets/categories/19-excretion.webp';
import behaviorRestrictionUrl from '../../assets/categories/20-behavior-restriction.webp';
import otherUrl from '../../assets/categories/21-other.webp';

const categoryVisualUrls: Record<string, string> = {
  impact_spanking: impactSpankingUrl,
  whipping: whippingUrl,
  bondage: bondageUrl,
  tickling: ticklingUrl,
  pain_stimulation: painStimulationUrl,
  humiliation: humiliationUrl,
  service: serviceUrl,
  discipline: disciplineUrl,
  sexual_interaction: sexualInteractionUrl,
  anal_interaction: analInteractionUrl,
  multi_party_interaction: multiPartyInteractionUrl,
  enslavement: enslavementUrl,
  pet_play: petPlayUrl,
  role_play: rolePlayUrl,
  objectification: objectificationUrl,
  exposure: exposureUrl,
  image_recording: imageRecordingUrl,
  piercing_cutting: piercingCuttingUrl,
  excretion: excretionUrl,
  behavior_restriction: behaviorRestrictionUrl,
  other: otherUrl,
};

const categoryVisualWarmups = new Map<string, Promise<boolean>>();

export function findCategoryVisualUrl(categoryId: string): string | null {
  return categoryVisualUrls[categoryId] ?? null;
}

export function getCategoryVisualUrl(categoryId: string): string {
  const visualUrl = findCategoryVisualUrl(categoryId);

  if (!visualUrl) {
    throw new Error(`Missing category visual for ${categoryId}.`);
  }

  return visualUrl;
}

export function warmCategoryVisual(categoryId: string): Promise<boolean> {
  if (typeof Image === 'undefined') return Promise.resolve(false);

  const existingWarmup = categoryVisualWarmups.get(categoryId);
  if (existingWarmup) return existingWarmup;

  const warmup = new Promise<boolean>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = getCategoryVisualUrl(categoryId);
  });
  categoryVisualWarmups.set(categoryId, warmup);
  return warmup;
}

export async function warmAllCategoryVisuals(): Promise<boolean> {
  const results = await Promise.all(Object.keys(categoryVisualUrls).map(warmCategoryVisual));
  return results.every(Boolean);
}
