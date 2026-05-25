import { homeSectionUsesMutedCardSurface } from "@/features/home/constants/homeSectionBands";
import type { HomeListingSectionTone } from "@/features/home/types/homeListing";

/**
 * Homepage card surfaces (see context/UI-Context.md brand grays).
 * Light gray cards on white bands; white cards on tinted bands for contrast.
 */
export const HOME_CARD_SURFACE_ON_WHITE_SECTION = "bg-card";

export const HOME_CARD_SURFACE_ON_MUTED_SECTION = "bg-background";

export const homeListingCardClassName = (
  tone: HomeListingSectionTone,
): string | undefined =>
  homeSectionUsesMutedCardSurface(tone)
    ? HOME_CARD_SURFACE_ON_MUTED_SECTION
    : HOME_CARD_SURFACE_ON_WHITE_SECTION;
