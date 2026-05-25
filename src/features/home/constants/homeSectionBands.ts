import type { HomeListingSectionTone } from "@/features/home/types/homeListing";

const sectionPadding = "py-14 md:py-16 lg:py-20";

function cnBand(background: string): string {
  return `relative overflow-hidden border-border border-t ${background} ${sectionPadding}`;
}

/**
 * Homepage section bands — each tone is visually distinct while staying on-brand
 * (navy, gold, white, muted grays via design tokens only).
 */
export const HOME_SECTION_BAND_CLASS: Record<HomeListingSectionTone, string> = {
  /** Featured — warm ownership spotlight */
  gold: cnBand(
    "border-gold/25 bg-gradient-to-br from-gold/[0.18] via-background to-muted/50",
  ),
  /** Houses for sale — crisp gallery on white */
  white: cnBand(
    "border-border/80 bg-gradient-to-b from-background via-background to-muted/35",
  ),
  /** Rentals — soft linen wash */
  linen: cnBand(
    "bg-gradient-to-tr from-muted/80 via-secondary to-background",
  ),
  /** Apartments — depth with navy atmosphere */
  navy: cnBand(
    "border-primary/12 bg-gradient-to-b from-primary/[0.1] via-muted/40 to-background",
  ),
  /** Commercial — structured stone plateau */
  stone: cnBand(
    "bg-gradient-to-bl from-card via-muted/55 to-secondary/90",
  ),
  /** Latest — elevated shelf with gold accent */
  elevated: cnBand(
    "border-gold/20 bg-gradient-to-b from-card via-background to-muted/40 shadow-[inset_0_1px_0_0] shadow-gold/25",
  ),
  /** States — compass / geography band */
  compass: cnBand(
    "border-primary/10 bg-gradient-to-b from-background via-muted/50 to-primary/[0.07]",
  ),
  /** Company — heritage trust band */
  heritage: cnBand(
    "border-primary/15 bg-gradient-to-br from-primary/[0.09] via-background to-gold/[0.1]",
  ),
};

/** Non-interactive atmosphere layered behind section content */
export const HOME_SECTION_BAND_DECOR: Record<HomeListingSectionTone, string> = {
  gold: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_100%_-5%,color-mix(in_srgb,var(--gold)_28%,transparent),transparent_62%)]",
  white:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_0%_105%,color-mix(in_srgb,var(--primary)_6%,transparent),transparent_58%)]",
  linen:
    "pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_0%,color-mix(in_srgb,var(--gold)_6%,transparent)_48%,transparent_92%)]",
  navy: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_110%,color-mix(in_srgb,var(--primary)_11%,transparent),transparent_65%)]",
  stone:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_50%,color-mix(in_srgb,var(--gold)_12%,transparent),transparent_70%)]",
  elevated:
    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent",
  compass:
    "pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--primary)_7%,transparent)_1px,transparent_1px)] bg-[length:28px_28px]",
  heritage:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,color-mix(in_srgb,var(--gold)_16%,transparent),transparent_55%)]",
};

/** Card surface per band — white cards on tinted bands; light gray cards on white/elevated bands. */
export const homeSectionUsesMutedCardSurface = (
  tone: HomeListingSectionTone,
): boolean => tone !== "white" && tone !== "elevated";
