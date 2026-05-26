import { ROUTES } from "./routes";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

/** Home + catalog — rendered before the States menu. */
export const mainNavCoreItems: NavItem[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Listings", href: ROUTES.listings },
  { label: "Locations", href: ROUTES.locations },
];

/** Static links after States — about + contact. */
export const mainNavTailItems: NavItem[] = [
  { label: "Novacity", href: ROUTES.novacity },
  { label: "Contact", href: ROUTES.contact },
];

/** @deprecated Use mainNavCoreItems + States + mainNavTailItems in navigation UIs. */
export const mainNavItems: NavItem[] = [...mainNavCoreItems, ...mainNavTailItems];

export const footerNavItems: NavItem[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Sign in", href: ROUTES.signIn },
  { label: "Sign up", href: ROUTES.signUp },
];
