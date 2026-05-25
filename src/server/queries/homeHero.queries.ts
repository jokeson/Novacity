import { HOME_HERO_DEFAULTS, HOME_HERO_CONFIG_KEY } from "@/features/home/utils/homeHeroDefaults";
import type { ResolvedHomeHeroContent } from "@/features/home/types/homeHero";
import { isAllowedHeroImageUrl } from "@/features/home/validators/homeHeroSchema";
import {
  findHomeHeroConfigByKey,
  type HomeHeroConfigFields,
} from "@/server/repositories/homeHero.repository";

const mergeWithDefaults = (partial: HomeHeroConfigFields | null): ResolvedHomeHeroContent => {
  const defaults = HOME_HERO_DEFAULTS;
  if (!partial) {
    return { ...defaults };
  }

  const imageCandidate = partial.imageUrl?.trim() ?? "";
  const imageUrl =
    imageCandidate && isAllowedHeroImageUrl(imageCandidate)
      ? imageCandidate
      : defaults.imageUrl;

  return {
    eyebrow: partial.eyebrow?.trim() || defaults.eyebrow,
    heading: partial.heading?.trim() || defaults.heading,
    body: partial.body?.trim() || defaults.body,
    imageUrl,
    imageAlt: partial.imageAlt?.trim() || defaults.imageAlt,
  };
};

/** Public home: never throws; falls back to static defaults if Mongo is unavailable or data is missing. */
export const getPublicHomeHeroResolved = async (): Promise<ResolvedHomeHeroContent> => {
  try {
    const doc = await findHomeHeroConfigByKey(HOME_HERO_CONFIG_KEY);
    return mergeWithDefaults(doc);
  } catch {
    return { ...HOME_HERO_DEFAULTS };
  }
};
