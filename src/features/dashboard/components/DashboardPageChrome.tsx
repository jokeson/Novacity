import type { ReactNode } from "react";

export type DashboardPageChromeProps = {
  children: ReactNode;
  topSlot?: ReactNode;
};

/** Dashboard-only banners below the mobile notification strip (shell sidebar lives in `AppShell`). */
export const DashboardPageChrome = ({ children, topSlot }: DashboardPageChromeProps) => {
  return (
    <>
      {topSlot ? <div className="min-h-0 shrink-0">{topSlot}</div> : null}
      {children}
    </>
  );
};
