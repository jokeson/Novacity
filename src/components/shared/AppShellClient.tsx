"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  SidebarProfileProvider,
  type SidebarProfileData,
} from "@/components/shared/SidebarProfileContext";
import { AppMobileSidebarMenu } from "@/components/shared/navigation/AppMobileSidebarMenu";
import { CollapsibleAppSidebar } from "@/components/shared/navigation/CollapsibleAppSidebar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { PublicFooter } from "@/features/home/components/PublicFooter";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import {
  resolveAppShellVariant,
  resolveAppSidebarKind,
  shouldShowAppFooter,
  shouldShowAppNavbar,
  shouldShowHomeSkipLink,
} from "@/lib/app-shell-routes";
import { uiAppMain, uiDashboardMainColumn } from "@/lib/responsiveLayout";
import { uiPublicMainOffset } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type AppShellClientProps = {
  children: ReactNode;
  dashboardProfile: SidebarProfileData | null;
  adminProfile: SidebarProfileData | null;
  unreadNotificationCount: number;
};

const shellRowClassName = (sidebarKind: ReturnType<typeof resolveAppSidebarKind>): string =>
  cn(
    "flex min-h-0 min-w-0 w-full flex-1 flex-col",
    sidebarKind === "dashboard" && "bg-muted/20 md:flex-row md:items-stretch",
    sidebarKind === "admin" && "bg-muted/30 md:flex-row md:items-stretch",
  );

export const AppShellClient = ({
  children,
  dashboardProfile,
  adminProfile,
  unreadNotificationCount,
}: AppShellClientProps) => {
  const pathname = usePathname();
  const variant = resolveAppShellVariant(pathname);
  const sidebarKind = resolveAppSidebarKind(variant);
  const showNavbar = shouldShowAppNavbar(variant);
  const showFooter = shouldShowAppFooter(variant);
  const showSkipLink = shouldShowHomeSkipLink(pathname);

  const activeProfile =
    sidebarKind === "admin"
      ? adminProfile
      : sidebarKind === "dashboard"
        ? dashboardProfile
        : null;

  const shell = (
    <div className="flex min-h-full flex-1 flex-col">
      {showSkipLink ? (
        <Link
          href="#main-content"
          className="bg-primary text-primary-foreground focus:bg-gold focus:text-primary sr-only focus:not-sr-only fixed top-4 left-4 z-[60] rounded-2xl px-4 py-2 text-sm font-medium shadow-md focus:px-4 focus:py-2"
        >
          Skip to content
        </Link>
      ) : null}
      <div className={shellRowClassName(sidebarKind)}>
        {sidebarKind === "dashboard" ? (
          <CollapsibleAppSidebar defaultOpen openOnAppRoute>
            <DashboardSidebar unreadNotificationCount={unreadNotificationCount} />
          </CollapsibleAppSidebar>
        ) : null}
        {sidebarKind === "admin" ? (
          <CollapsibleAppSidebar defaultOpen openOnAppRoute>
            <AdminSidebar />
          </CollapsibleAppSidebar>
        ) : null}
        <main
          id="main-content"
          className={cn(
            uiAppMain,
            showNavbar && uiPublicMainOffset,
            sidebarKind !== "none" && uiDashboardMainColumn,
            variant === "auth" && "flex min-h-full flex-1 flex-col",
          )}
        >
          {sidebarKind !== "none" ? (
            <div className="border-border flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
              <AppMobileSidebarMenu sidebarKind={sidebarKind} />
              {sidebarKind === "dashboard" ? (
                <NotificationBell initialUnreadCount={unreadNotificationCount} />
              ) : null}
            </div>
          ) : null}
          {children}
        </main>
      </div>
      {showFooter ? <PublicFooter /> : null}
    </div>
  );

  if (activeProfile) {
    return <SidebarProfileProvider value={activeProfile}>{shell}</SidebarProfileProvider>;
  }

  return shell;
};
