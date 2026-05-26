import { homeSectionUsesMutedCardSurface } from "@/features/home/constants/homeSectionBands";
import type { HomeListingSectionTone } from "@/features/home/types/homeListing";

/**
 * Homepage card surfaces (see context/UI-Context.md brand grays).
 * Light gray cards on white bands; white cards on tinted bands for contrast.
 */
export const HOME_CARD_SURFACE_ON_WHITE_SECTION = "bg-card";

export const HOME_CARD_SURFACE_ON_MUTED_SECTION = "bg-background";

/** Featured, apartments, and commercial — warm gold gradient card shell. */
export const HOME_CARD_SURFACE_GOLD_GRADIENT =
  "border-gold/30 bg-[linear-gradient(152deg,color-mix(in_srgb,var(--gold)_24%,var(--background))_0%,var(--background)_38%,color-mix(in_srgb,var(--gold)_14%,var(--card))_100%)]";

const HOME_LISTING_GOLD_CARD_TONES: HomeListingSectionTone[] = [
  "gold",
  "navy",
  "stone",
];

export const homeListingCardUsesGoldGradient = (
  tone: HomeListingSectionTone,
): boolean => HOME_LISTING_GOLD_CARD_TONES.includes(tone);

export const homeListingCardClassName = (
  tone: HomeListingSectionTone,
): string | undefined => {
  if (homeListingCardUsesGoldGradient(tone)) {
    return HOME_CARD_SURFACE_GOLD_GRADIENT;
  }
  return homeSectionUsesMutedCardSurface(tone)
    ? HOME_CARD_SURFACE_ON_MUTED_SECTION
    : HOME_CARD_SURFACE_ON_WHITE_SECTION;
};
