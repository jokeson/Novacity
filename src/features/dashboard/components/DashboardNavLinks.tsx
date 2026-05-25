"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Heart,
  KeyRound,
  LayoutDashboard,
  List,
  Settings,
  Shield,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import { useSidebarProfile } from "@/components/shared/SidebarProfileContext";
import {
  sidebarNavDividerClassName,
  sidebarNavIconClassName,
  sidebarNavLinkClassName,
} from "@/components/shared/navigation/sidebarNavStyles";
import { ROUTES } from "@/constants/routes";
import { getDashboardNavItemsForProfile } from "@/features/dashboard/constants/nav";
import { cn } from "@/lib/utils";

const navIconByHref: Record<string, LucideIcon> = {
  [ROUTES.dashboard]: LayoutDashboard,
  [ROUTES.dashboardVerification]: UserCheck,
  [ROUTES.dashboardListings]: List,
  [ROUTES.dashboardFavorites]: Heart,
  [ROUTES.dashboardNotifications]: Bell,
  [ROUTES.dashboardSettings]: Settings,
  [ROUTES.dashboardPasskeys]: KeyRound,
  [ROUTES.admin]: Shield,
};

export type DashboardNavLinksProps = {
  className?: string;
  onNavigate?: () => void;
};

export const DashboardNavLinks = ({
  className,
  onNavigate,
}: DashboardNavLinksProps) => {
  const pathname = usePathname();
  const profile = useSidebarProfile();

  const items = profile
    ? getDashboardNavItemsForProfile({
        role: profile.role,
        canCreateListings: profile.canCreateListings,
      })
    : [];

  const resolveIsActive = (href: string): boolean => {
    if (href === ROUTES.dashboard) {
      return pathname === ROUTES.dashboard;
    }
    if (href === ROUTES.admin) {
      return pathname === ROUTES.admin || pathname.startsWith(`${ROUTES.admin}/`);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      aria-label="Dashboard"
      className={cn("flex flex-col gap-2 px-2 py-2 md:px-3", className)}
    >
      {items.map((item) => {
        const Icon = navIconByHref[item.href] ?? LayoutDashboard;
        const isActive = resolveIsActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={sidebarNavLinkClassName(isActive)}
          >
            <Icon
              className={sidebarNavIconClassName(isActive)}
              aria-hidden
            />
            {item.label}
          </Link>
        );
      })}
      {profile?.role === "admin" ? (
        <>
          <div className={sidebarNavDividerClassName} role="separator" aria-hidden />
          <Link
            href={ROUTES.admin}
            onClick={onNavigate}
            className={sidebarNavLinkClassName(resolveIsActive(ROUTES.admin))}
          >
            <Shield
              className={sidebarNavIconClassName(resolveIsActive(ROUTES.admin))}
              aria-hidden
            />
            Admin console
          </Link>
        </>
      ) : null}
    </nav>
  );
};
