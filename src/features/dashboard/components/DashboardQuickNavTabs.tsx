"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type DashboardQuickNavTabsProps = {
  isAdmin: boolean;
  canCreateListings?: boolean;
};

type NavTab = {
  key: string;
  label: string;
  href: string;
  adminOnly?: boolean;
  isActive: (pathname: string) => boolean;
};

const navTabs: NavTab[] = [
  {
    key: "admin",
    label: "Admin console",
    href: ROUTES.admin,
    adminOnly: true,
    isActive: (pathname) => pathname.startsWith(ROUTES.admin),
  },
  {
    key: "new-listing",
    label: "New listing",
    href: ROUTES.dashboardListingsCreate,
    isActive: (pathname) => pathname.startsWith(ROUTES.dashboardListingsCreate),
  },
  {
    key: "listings",
    label: "Manage listings",
    href: ROUTES.dashboardListings,
    isActive: (pathname) =>
      pathname.startsWith(ROUTES.dashboardListings) &&
      !pathname.startsWith(ROUTES.dashboardListingsCreate),
  },
  {
    key: "favorites",
    label: "Favorites",
    href: ROUTES.dashboardFavorites,
    isActive: (pathname) => pathname.startsWith(ROUTES.dashboardFavorites),
  },
  {
    key: "passkeys",
    label: "Pass keys",
    href: ROUTES.dashboardPasskeys,
    isActive: (pathname) => pathname.startsWith(ROUTES.dashboardPasskeys),
  },
  {
    key: "marketplace",
    label: "Browse marketplace",
    href: ROUTES.properties,
    isActive: (pathname) =>
      pathname === ROUTES.properties || pathname.startsWith(`${ROUTES.properties}/`),
  },
];

const tabButtonClass =
  "focus-visible:ring-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-[3px] sm:px-4";

export const DashboardQuickNavTabs = ({
  isAdmin,
  canCreateListings = true,
}: DashboardQuickNavTabsProps) => {
  const pathname = usePathname() ?? "";

  const restricted = !canCreateListings && !isAdmin;

  const visible = navTabs.filter((tab) => {
    if (tab.adminOnly && !isAdmin) {
      return false;
    }
    if (restricted) {
      return tab.key === "new-listing" || tab.key === "marketplace";
    }
    return true;
  });

  const resolveHref = (tab: NavTab): string => {
    if (tab.key === "new-listing" && !canCreateListings) {
      return ROUTES.dashboardVerification;
    }
    return tab.href;
  };

  const resolveLabel = (tab: NavTab): string => {
    if (tab.key === "new-listing" && !canCreateListings) {
      return "Verify to list";
    }
    return tab.label;
  };

  return (
    <nav
      aria-label="Dashboard quick navigation"
      className="bg-muted/50 border-border rounded-2xl border p-1.5 shadow-sm sm:p-2"
    >
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0">
        {visible.map((tab) => {
          const active =
            tab.key === "new-listing" && !canCreateListings
              ? pathname.startsWith(ROUTES.dashboardVerification)
              : tab.isActive(pathname);
          const href = resolveHref(tab);
          const label = resolveLabel(tab);
          return (
            <Link
              key={tab.key}
              href={href}
              className={cn(
                tabButtonClass,
                "text-muted-foreground hover:text-foreground hover:border-border hover:bg-background/80",
                active &&
                  "text-foreground border-gold/35 bg-gold/10 shadow-sm ring-1 ring-gold/25 dark:bg-gold/15",
              )}
              aria-current={active ? "page" : undefined}
              title={
                tab.key === "new-listing" && !canCreateListings
                  ? "Complete owner verification to create listings"
                  : undefined
              }
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
