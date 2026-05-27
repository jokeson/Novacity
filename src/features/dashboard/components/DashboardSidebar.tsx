"use client";

import Link from "next/link";

import { SidebarCollapseToggle } from "@/components/shared/navigation/SidebarCollapseToggle";
import { SidebarListPropertyCta } from "@/components/shared/navigation/SidebarListPropertyCta";
import { DashboardNavLinks } from "@/features/dashboard/components/DashboardNavLinks";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { sidebarTitleLinkClassName } from "@/components/shared/navigation/sidebarNavStyles";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type DashboardSidebarProps = {
  className?: string;
  unreadNotificationCount: number;
};

export const DashboardSidebar = ({
  className,
  unreadNotificationCount,
}: DashboardSidebarProps) => {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex flex-col gap-5 p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <Link href={ROUTES.dashboard} className={sidebarTitleLinkClassName}>
            Dashboard
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <NotificationBell
              initialUnreadCount={unreadNotificationCount}
              tone="on-primary"
            />
            <SidebarCollapseToggle />
          </div>
        </div>
      </div>
      <DashboardNavLinks className="flex-1 px-2 pb-2" />
      <div className="border-primary-foreground/15 mt-auto shrink-0 border-t p-4">
        <SidebarListPropertyCta />
      </div>
    </div>
  );
};
