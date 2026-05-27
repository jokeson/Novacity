"use client";

import { PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { SidebarCollapseProvider } from "@/components/shared/navigation/SidebarCollapseContext";
import {
  sidebarAsideClassName,
  sidebarAsideDesktopFixedClassName,
  sidebarAsideReopenTriggerClassName,
  sidebarAsideTransitionClassName,
} from "@/components/shared/navigation/sidebarNavStyles";
import { isAppSidebarPath } from "@/lib/app-shell-routes";
import { cn } from "@/lib/utils";

export const APP_SIDEBAR_OPEN_STORAGE_KEY = "novacity-app-sidebar-open";

export type CollapsibleAppSidebarProps = {
  children: ReactNode;
  className?: string;
  /** Desktop sidebar starts open for signed-in app routes. */
  defaultOpen?: boolean;
  /** When navigating onto dashboard/admin, force the sidebar open (e.g. navbar Dashboard). */
  openOnAppRoute?: boolean;
};

const readStoredOpenState = (): boolean | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(APP_SIDEBAR_OPEN_STORAGE_KEY);
  if (stored === "true") {
    return true;
  }
  if (stored === "false") {
    return false;
  }
  return null;
};

export const setAppSidebarOpenPreference = (open: boolean): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(APP_SIDEBAR_OPEN_STORAGE_KEY, String(open));
};

export const CollapsibleAppSidebar = ({
  children,
  className,
  defaultOpen = true,
  openOnAppRoute = false,
}: CollapsibleAppSidebarProps) => {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredOpenState();
    const enteredAppRoute =
      openOnAppRoute &&
      isAppSidebarPath(pathname) &&
      !isAppSidebarPath(previousPathnameRef.current);

    if (enteredAppRoute) {
      setIsOpen(true);
      setAppSidebarOpenPreference(true);
    } else if (stored !== null) {
      setIsOpen(stored);
    }

    previousPathnameRef.current = pathname;
    setHasHydrated(true);
  }, [pathname, openOnAppRoute]);

  const handleToggle = useCallback(() => {
    setIsOpen((previous) => {
      const next = !previous;
      setAppSidebarOpenPreference(next);
      return next;
    });
  }, []);

  return (
    <>
      <div
        className={cn(
          "relative hidden shrink-0 md:flex md:flex-col md:self-stretch",
          sidebarAsideTransitionClassName,
          isOpen ? "w-64" : "w-0 min-w-0",
          className,
        )}
      >
        <aside
          className={cn(
            sidebarAsideClassName,
            sidebarAsideDesktopFixedClassName,
            sidebarAsideTransitionClassName,
            "flex w-64 min-w-64 flex-col will-change-transform",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!isOpen}
        >
          <SidebarCollapseProvider value={{ isOpen, toggle: handleToggle }}>
            {children}
          </SidebarCollapseProvider>
        </aside>
      </div>

      {hasHydrated && !isOpen ? (
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            sidebarAsideReopenTriggerClassName,
            "transition-opacity duration-300 ease-out",
          )}
          aria-label="Open sidebar"
          aria-expanded={false}
        >
          <PanelLeft className="size-4" aria-hidden />
        </button>
      ) : null}
    </>
  );
};
