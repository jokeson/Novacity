import { cn } from "@/lib/utils";

/**
 * App-shell sidebar surfaces — aligned with `PublicFooter` (`bg-primary text-primary-foreground`).
 */
export const sidebarAsideClassName = cn(
  "border-border/40 bg-primary text-primary-foreground flex shrink-0 flex-col border-r",
);

/** Pin sidebar below the fixed navbar on md+; main column scrolls independently. */
export const sidebarAsideDesktopFixedClassName = cn(
  "md:sticky md:top-16 md:z-30 md:h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-4rem)]",
  "lg:top-[4.25rem] lg:h-[calc(100dvh-4.25rem)] lg:max-h-[calc(100dvh-4.25rem)]",
  "md:overflow-y-auto md:overscroll-contain",
);

export const sidebarTitleLinkClassName = cn(
  "text-primary-foreground hover:text-gold focus-visible:ring-ring font-heading cursor-pointer text-lg font-semibold tracking-tight transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none",
);

/** Standard mobile drawer width (iOS/Android-friendly). */
export const sidebarSheetWidthClassName = "w-[min(100vw-2rem,20rem)] sm:max-w-[20rem]";

export const sidebarSheetSurfaceClassName = cn(
  "border-border/40 bg-primary text-primary-foreground flex h-full max-h-[100dvh] flex-col gap-0 border-r p-0 shadow-2xl",
  "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-1 before:bg-gold/70",
  "[&>button]:top-4 [&>button]:right-4 [&>button]:z-20",
  "[&>button]:border-primary-foreground/25 [&>button]:bg-primary-foreground/8 [&>button]:text-primary-foreground",
  "[&>button]:hover:border-gold/45 [&>button]:hover:bg-primary-foreground/14 [&>button]:hover:text-gold",
);

export const sidebarSheetHeaderClassName = cn(
  "border-primary-foreground/15 shrink-0 border-b px-5 py-5 pr-14 text-left",
);

export const sidebarSheetTitleClassName = cn(
  "font-heading text-primary-foreground text-lg font-semibold tracking-tight",
);

export const sidebarSheetBodyClassName = cn(
  "flex min-h-0 flex-1 flex-col overflow-hidden",
);

export const sidebarSheetScrollClassName = cn(
  "flex-1 overflow-y-auto overscroll-contain px-3 py-3 [-webkit-overflow-scrolling:touch]",
);

export const sidebarSheetFooterClassName = cn(
  "border-primary-foreground/15 shrink-0 space-y-3 border-t px-4 py-4",
);

export const sidebarNavDividerClassName = cn(
  "border-primary-foreground/15 my-2 border-t",
);

export const sidebarNavLinkClassName = (isActive: boolean): string =>
  cn(
    "group/sidebar-link flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 outline-none",
    "focus-visible:ring-2 focus-visible:ring-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none active:scale-[0.99]",
    isActive
      ? "bg-primary-foreground/12 text-gold shadow-[inset_0_0_0_1px_rgba(212,160,23,0.35)]"
      : "text-primary-foreground hover:bg-primary-foreground/8 hover:text-gold",
  );

export const sidebarNavIconClassName = (isActive: boolean): string =>
  cn(
    "size-4 shrink-0 transition-colors duration-300",
    isActive
      ? "text-gold drop-shadow-[0_0_10px_rgba(212,160,23,0.45)]"
      : "text-gold/90 group-hover/sidebar-link:text-gold",
  );

/** Primary links inside the navy mobile drawer (public marketing nav). */
export const mobileSidebarNavLinkClassName = cn(
  "text-primary-foreground hover:bg-primary-foreground/8 hover:text-gold",
  "flex min-h-11 cursor-pointer items-center rounded-xl px-3 text-base font-medium transition-all duration-300",
  "focus-visible:ring-2 focus-visible:ring-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none active:scale-[0.99]",
);

export const mobileSidebarNavSubLinkClassName = cn(
  "text-primary-foreground/75 hover:bg-primary-foreground/8 hover:text-gold",
  "flex min-h-10 cursor-pointer items-center rounded-lg px-3 text-sm transition-colors duration-300",
  "focus-visible:ring-2 focus-visible:ring-gold/55 focus-visible:outline-none",
);

export const mobileSidebarNavStatesPanelClassName = cn(
  "border-primary-foreground/15 bg-primary-foreground/5 mt-1 max-h-52 space-y-0.5 overflow-y-auto rounded-xl border py-1",
);

export const mobileSidebarProfileClassName = cn(
  "border-primary-foreground/15 bg-primary-foreground/8 flex max-w-none items-center gap-3 self-stretch rounded-xl border px-3 py-2.5",
);
