import { ROUTES } from "@/constants/routes";

export type AdminNavItem = {
  label: string;
  href: string;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Overview", href: ROUTES.admin },
  { label: "Users", href: ROUTES.adminUsers },
  { label: "Listings", href: ROUTES.adminListings },
  { label: "Owner verifications", href: ROUTES.adminOwnerVerifications },
  { label: "Pass keys", href: ROUTES.adminPasskeys },
  { label: "Home hero", href: ROUTES.adminHomeHero },
  { label: "Analytics", href: ROUTES.adminAnalytics },
  { label: "Revenue", href: ROUTES.adminRevenue },
];
