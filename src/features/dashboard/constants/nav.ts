import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/user";

export type DashboardNavItem = {
  label: string;
  href: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "Overview", href: ROUTES.dashboard },
  { label: "Verification", href: ROUTES.dashboardVerification },
  { label: "Listings", href: ROUTES.dashboardListings },
  { label: "Favorites", href: ROUTES.dashboardFavorites },
  { label: "Notifications", href: ROUTES.dashboardNotifications },
  { label: "Settings", href: ROUTES.dashboardSettings },
  { label: "Pass keys", href: ROUTES.dashboardPasskeys },
];

export type DashboardNavProfile = {
  role: UserRole;
  canCreateListings?: boolean;
};

/** Unapproved owners only see Verification until admin approves (spec 08). */
export const getDashboardNavItemsForProfile = (
  profile: DashboardNavProfile,
): DashboardNavItem[] => {
  const restricted =
    profile.role === "user" && profile.canCreateListings === false;

  return dashboardNavItems.filter((item) => {
    if (restricted) {
      return item.href === ROUTES.dashboardVerification;
    }
    if (item.href === ROUTES.dashboardVerification) {
      return profile.role === "user" && profile.canCreateListings === false;
    }
    return true;
  });
};
