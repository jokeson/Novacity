import type { HomeListingSectionTone } from "@/features/home/types/homeListing";

const sectionPadding = "py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24";

function cnBand(background: string): string {
  return `relative overflow-hidden border-border border-t ${background} ${sectionPadding}`;
}

/**
 * Homepage section bands — rich gradients on-brand (navy, gold, white, muted).
 */
export const HOME_SECTION_BAND_CLASS: Record<HomeListingSectionTone, string> = {
  /** Featured — warm gold spotlight */
  gold: cnBand(
    "border-gold/35 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--gold)_26%,var(--background))_0%,var(--background)_38%,color-mix(in_srgb,var(--muted)_70%,var(--background))_100%)]",
  ),
  /** Houses for sale — clean airy white */
  white: cnBand(
    "border-border/70 bg-[linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--muted)_40%,var(--background))_55%,color-mix(in_srgb,var(--gold)_6%,var(--background))_100%)]",
  ),
  /** Rentals — soft linen warmth */
  linen: cnBand(
    "bg-[linear-gradient(125deg,color-mix(in_srgb,var(--secondary)_95%,transparent)_0%,var(--background)_48%,color-mix(in_srgb,var(--gold)_10%,var(--background))_100%)]",
  ),
  /** Apartments — navy atmosphere */
  navy: cnBand(
    "border-primary/20 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--primary)_16%,var(--background))_0%,color-mix(in_srgb,var(--muted)_55%,var(--background))_52%,var(--background)_100%)]",
  ),
  /** Commercial — stone plateau */
  stone: cnBand(
    "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--card)_90%,transparent)_0%,color-mix(in_srgb,var(--muted)_75%,var(--background))_45%,color-mix(in_srgb,var(--primary)_5%,var(--background))_100%)]",
  ),
  /** Latest — elevated shelf */
  elevated: cnBand(
    "border-gold/25 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_85%,var(--background))_0%,var(--background)_50%,color-mix(in_srgb,var(--gold)_12%,var(--background))_100%)] shadow-[inset_0_1px_0_0] shadow-gold/30",
  ),
  /** States — compass geography */
  compass: cnBand(
    "border-primary/15 bg-[linear-gradient(165deg,var(--background)_0%,color-mix(in_srgb,var(--muted)_60%,var(--background))_50%,color-mix(in_srgb,var(--primary)_9%,var(--background))_100%)]",
  ),
  /** Company — heritage trust */
  heritage: cnBand(
    "border-primary/20 bg-[linear-gradient(140deg,color-mix(in_srgb,var(--primary)_11%,var(--background))_0%,var(--background)_45%,color-mix(in_srgb,var(--gold)_14%,var(--background))_100%)]",
  ),
};

/** Non-interactive atmosphere layered behind section content */
export const HOME_SECTION_BAND_DECOR: Record<HomeListingSectionTone, string> = {
  gold: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_-8%,color-mix(in_srgb,var(--gold)_32%,transparent),transparent_60%)] bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,color-mix(in_srgb,var(--primary)_5%,transparent),transparent_55%)]",
  white:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_110%,color-mix(in_srgb,var(--gold)_10%,transparent),transparent_58%)]",
  linen:
    "pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,color-mix(in_srgb,var(--gold)_9%,transparent)_50%,transparent_95%)]",
  navy: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_75%_at_50%_115%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_68%)]",
  stone:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_40%,color-mix(in_srgb,var(--gold)_14%,transparent),transparent_72%)]",
  elevated:
    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent",
  compass:
    "pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[length:24px_24px]",
  heritage:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_100%_100%,color-mix(in_srgb,var(--gold)_20%,transparent),transparent_58%)] bg-[radial-gradient(ellipse_45%_35%_at_0%_0%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_50%)]",
};

/** Gold accent line under section headers (homepage). */
export const HOME_SECTION_TITLE_ACCENT_CLASS =
  "mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-gold via-gold/70 to-transparent";

/** Card surface per band — white cards on tinted bands; light gray cards on white/elevated bands. */
export const homeSectionUsesMutedCardSurface = (
  tone: HomeListingSectionTone,
): boolean => tone !== "white" && tone !== "elevated";
