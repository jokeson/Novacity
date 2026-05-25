"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type NavTab = {
  key: string;
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

const navTabs: NavTab[] = [
  {
    key: "console",
    label: "Admin console",
    href: ROUTES.admin,
    isActive: (pathname) => pathname === ROUTES.admin,
  },
  {
    key: "users",
    label: "Users",
    href: ROUTES.adminUsers,
    isActive: (pathname) => pathname.startsWith(ROUTES.adminUsers),
  },
  {
    key: "listings",
    label: "Listings",
    href: ROUTES.adminListings,
    isActive: (pathname) => pathname.startsWith(ROUTES.adminListings),
  },
  {
    key: "owner-verifications",
    label: "Owner verifications",
    href: ROUTES.adminOwnerVerifications,
    isActive: (pathname) => pathname.startsWith(ROUTES.adminOwnerVerifications),
  },
  {
    key: "passkeys",
    label: "Pass keys",
    href: ROUTES.adminPasskeys,
    isActive: (pathname) => pathname.startsWith(ROUTES.adminPasskeys),
  },
  {
    key: "home-hero",
    label: "Home hero",
    href: ROUTES.adminHomeHero,
    isActive: (pathname) => pathname.startsWith(ROUTES.adminHomeHero),
  },
  {
    key: "analytics",
    label: "Analytics",
    href: ROUTES.adminAnalytics,
    isActive: (pathname) => pathname.startsWith(ROUTES.adminAnalytics),
  },
  {
    key: "revenue",
    label: "Revenue",
    href: ROUTES.adminRevenue,
    isActive: (pathname) => pathname.startsWith(ROUTES.adminRevenue),
  },
  {
    key: "new-listing",
    label: "New listing",
    href: ROUTES.dashboardListingsCreate,
    isActive: (pathname) => pathname.startsWith(ROUTES.dashboardListingsCreate),
  },
  {
    key: "favorites",
    label: "Favorites",
    href: ROUTES.dashboardFavorites,
    isActive: (pathname) => pathname.startsWith(ROUTES.dashboardFavorites),
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

export const AdminQuickNavTabs = () => {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Admin quick navigation"
      className="bg-muted/50 border-border rounded-2xl border p-1.5 shadow-sm sm:p-2"
    >
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0">
        {navTabs.map((tab) => {
          const active = tab.isActive(pathname);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                tabButtonClass,
                "text-muted-foreground hover:text-foreground hover:border-border hover:bg-background/80",
                active &&
                  "text-foreground border-gold/35 bg-gold/10 shadow-sm ring-1 ring-gold/25 dark:bg-gold/15",
              )}
              aria-current={active ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
