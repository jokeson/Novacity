import { cn } from "@/lib/utils";

/** Taller navbar CTAs on mobile & tablet; compact from `lg` up. */
export const navbarActionSizeClass = cn(
  "h-11 min-h-11 rounded-xl px-4 text-sm font-semibold",
  "max-lg:shadow-sm",
  "lg:h-8 lg:min-h-0 lg:rounded-2xl lg:px-2.5 lg:text-sm lg:font-medium lg:shadow-none",
);

/** Full-width drawer / stacked actions (mobile menu footer). */
export const navbarActionStackedSizeClass = cn(
  "h-12 min-h-12 w-full justify-center rounded-xl px-4 text-base font-semibold",
  "max-lg:shadow-sm",
);

export const navbarOutlineOnPrimaryClass = cn(
  "cursor-pointer justify-center border-primary-foreground/30 bg-transparent text-primary-foreground",
  "transition-all duration-300 hover:border-gold/45 hover:bg-primary-foreground/10 hover:text-gold",
  "max-lg:hover:shadow-md lg:shadow-none",
);

export const navbarOutlineDefaultClass = cn(
  "cursor-pointer justify-center border-border bg-background",
  "transition-all duration-300 hover:border-gold/40 hover:bg-muted/50 hover:text-foreground",
  "max-lg:shadow-sm max-lg:hover:shadow-md",
);

export const navbarGhostSignInClass = cn(
  "cursor-pointer justify-center text-gold",
  "transition-all duration-300 hover:bg-gold/10 hover:text-gold",
);

export const navbarGoldCtaClass = cn(
  "cursor-pointer justify-center font-semibold",
);

export const navbarSignOutOnPrimaryClass = cn(
  navbarOutlineOnPrimaryClass,
  navbarActionStackedSizeClass,
  "w-full bg-transparent font-semibold active:translate-y-px",
);

export const navbarSignOutDesktopClass = cn(
  "cursor-pointer justify-center rounded-xl border-gold/45 bg-transparent px-4 font-semibold",
  "transition-all duration-200 hover:border-gold hover:bg-gold/10",
  "max-lg:h-11 max-lg:min-h-11 max-lg:shadow-sm max-lg:hover:shadow-md",
  "active:translate-y-px active:shadow-inner lg:h-8 lg:min-h-0",
);
