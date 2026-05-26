/**
 * Responsive layout tokens — mobile-first; use on shells, main, and page sections.
 * Aligns with `context/UI-Context.md` (mobile, tablet, laptop, desktop).
 */

/** Root body / app column — prevents horizontal scroll from wide children. */
export const uiAppBody =
  "flex min-h-full min-w-0 flex-col overflow-x-clip bg-background text-foreground";

/** Scrollable main under fixed navbar (public, dashboard, admin). */
export const uiAppMain =
  "flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-clip";

/** Dashboard / admin content column beside sidebar. */
export const uiDashboardMainColumn =
  "flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-clip";

/** Standard vertical page padding inside `Container`. */
export const uiPageSectionY = "py-6 sm:py-8 md:py-10 lg:py-12";

/** Property listing grids — 1 → 2 → 3 columns. */
export const uiPropertyCardGrid =
  "grid min-w-0 list-none items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 xl:grid-cols-3";
