/**
 * Novacity UI tokens — single source aligned with `context/UI-Context.md`.
 * Import these class strings in pages and shared components; avoid one-off colors.
 */

export const uiTransition = "transition-all duration-300";

export const uiBorder = "border border-border";

export const uiSurfaceCard =
  "border-border bg-card rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md";

export const uiSurfaceCardStatic =
  "border-border bg-card rounded-2xl border shadow-sm";

export const uiSurfaceMutedPanel = "border-border bg-muted/30 rounded-2xl border";

export const uiPageHeaderShell =
  "border-border border-b bg-muted/40 py-10 transition-colors duration-300 md:py-12";

export const uiStickySubheaderShell =
  "border-border sticky top-16 z-40 border-b bg-muted/90 py-8 backdrop-blur-md transition-colors duration-300 supports-[backdrop-filter]:bg-muted/75 md:py-10 lg:top-[4.25rem]";

export const uiTypography = {
  hero: "font-heading text-5xl font-semibold leading-tight tracking-tight text-balance md:text-6xl",
  sectionTitle: "font-heading text-foreground text-3xl font-semibold tracking-tight",
  pageTitle: "font-heading text-foreground text-3xl font-semibold tracking-tight",
  propertyTitle: "font-heading text-foreground text-xl font-semibold tracking-tight",
  propertyPrice: "font-heading text-foreground text-2xl font-semibold tracking-tight",
  cardTitle: "font-heading text-foreground text-lg font-semibold tracking-tight md:text-xl",
  body: "text-muted-foreground text-sm leading-relaxed",
  bodyEmphasis: "text-foreground text-sm leading-relaxed",
  eyebrow: "font-medium text-gold text-xs uppercase tracking-widest",
  label: "text-foreground text-sm font-medium",
} as const;

/** Property card shell — fixed footprint; image hover per UI-Context. */
export const uiPropertyCardShell =
  "@container/property-card group border-border bg-card flex h-full w-full max-w-full min-w-0 flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md";

export const uiPropertyCardTitle =
  "text-foreground line-clamp-1 shrink-0 overflow-hidden font-semibold leading-[1.175rem] tracking-tight text-[clamp(0.625rem,4.5cqw,1.25rem)]";

export const uiInteractiveLink =
  "text-primary hover:text-gold cursor-pointer font-medium underline-offset-4 transition-colors duration-300 hover:underline focus-visible:ring-ring rounded-md focus-visible:ring-3 focus-visible:outline-none";

/** Inline / secondary links — gold label */
export const uiGoldTextLink =
  "text-gold hover:text-gold/85 cursor-pointer font-medium underline-offset-4 transition-colors duration-300 hover:underline focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none";

/** Primary gold CTA — List a property, Send message, Learn more, etc. */
export const uiButtonGold =
  "border-gold bg-gold text-white shadow-sm hover:bg-gold/90 hover:text-white hover:shadow-md";

/** Primary success CTA — Contact on property details, etc. */
export const uiButtonSuccess =
  "border-success bg-success text-white shadow-sm hover:bg-success/90 hover:text-white hover:shadow-md";

/** Larger marketing / hero gold CTA sizing */
export const uiButtonGoldProminent =
  "h-11 rounded-2xl px-8 text-base font-medium shadow-md hover:shadow-lg sm:h-12";

/** Decorative and inline icons — Luxury Gold #D4A017 */
export const uiIconAccent = "text-gold";

/** Toolbar / nav icon buttons — muted default, gold on hover/focus */
export const uiIconInteractive =
  "text-muted-foreground transition-colors duration-300 hover:text-gold focus-visible:text-gold";

export const uiPublicMainOffset = "flex min-h-0 flex-1 flex-col pt-16 lg:pt-[4.25rem]";
