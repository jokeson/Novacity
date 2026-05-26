import { homeSectionUsesMutedCardSurface } from "@/features/home/constants/homeSectionBands";
import type { HomeListingSectionTone } from "@/features/home/types/homeListing";

/**
 * Homepage card surfaces (see context/UI-Context.md brand grays).
 * Light gray cards on white bands; white cards on tinted bands for contrast.
 */
export const HOME_CARD_SURFACE_ON_WHITE_SECTION = "bg-card";

export const HOME_CARD_SURFACE_ON_MUTED_SECTION = "bg-background";

/** Border-only card chrome on the homepage — no elevation shadows. */
export const HOME_CARD_BORDER =
  "border-border rounded-2xl border-2 shadow-none transition-all duration-300";

/** Overrides default PropertyCard shell shadows on the homepage. */
export const HOME_PROPERTY_CARD_NO_SHADOW = "shadow-none hover:shadow-none";

/** Enable `mobileCenterContent` on homepage `PropertyCard` instances. */
export const HOME_PROPERTY_CARD_MOBILE_LAYOUT = true;

/** Overrides EmptyState elevation shadows when used on the homepage. */
export const HOME_EMPTY_STATE_NO_SHADOW = "shadow-none [&>div]:shadow-none";

export const homeListingCardClassName = (
  tone: HomeListingSectionTone,
): string | undefined =>
  homeSectionUsesMutedCardSurface(tone)
    ? HOME_CARD_SURFACE_ON_MUTED_SECTION
    : HOME_CARD_SURFACE_ON_WHITE_SECTION;
