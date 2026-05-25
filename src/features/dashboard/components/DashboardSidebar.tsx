"use client";

import Link from "next/link";

import { DashboardNavLinks } from "@/features/dashboard/components/DashboardNavLinks";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import {
  sidebarAsideClassName,
  sidebarAsideDesktopFixedClassName,
  sidebarTitleLinkClassName,
} from "@/components/shared/navigation/sidebarNavStyles";
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
    <aside
      className={cn(
        sidebarAsideClassName,
        sidebarAsideDesktopFixedClassName,
        "hidden w-64 md:flex",
        className,
      )}
    >
      <div className="flex flex-col gap-5 p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={ROUTES.dashboard} className={sidebarTitleLinkClassName}>
            Dashboard
          </Link>
          <NotificationBell
            initialUnreadCount={unreadNotificationCount}
            tone="on-primary"
          />
        </div>
      </div>
      <DashboardNavLinks className="flex-1 px-2 pb-4" />
    </aside>
  );
};
