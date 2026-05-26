export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  dashboardListings: "/dashboard/listings",
  dashboardListingsCreate: "/dashboard/listings/create",
  dashboardFavorites: "/dashboard/favorites",
  dashboardNotifications: "/dashboard/notifications",
  dashboardSettings: "/dashboard/settings",
  dashboardPasskeys: "/dashboard/passkeys",
  dashboardVerification: "/dashboard/verification",
  admin: "/admin",
  adminUsers: "/admin/users",
  adminListings: "/admin/listings",
  adminPasskeys: "/admin/passkeys",
  adminAnalytics: "/admin/analytics",
  adminRevenue: "/admin/revenue",
  adminHomeHero: "/admin/home-hero",
  adminOwnerVerifications: "/admin/owner-verifications",
  novacity: "/novacity",
  locations: "/locations",
  contact: "/contact",
  listings: "/properties",
  properties: "/properties",
  favorites: "/favorites",
  settings: "/settings",
} as const;

export const dashboardListingEditPath = (id: string): string =>
  `/dashboard/listings/${id}/edit`;

export const propertyDetailPath = (slug: string): string =>
  `/properties/${slug}`;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
