import { ROUTES } from "@/constants/routes";

export type AppShellVariant = "auth" | "public" | "dashboard" | "admin";

export type AppSidebarKind = "none" | "dashboard" | "admin";

const AUTH_PATH_PREFIXES = [
  ROUTES.signIn,
  ROUTES.signUp,
  ROUTES.forgotPassword,
] as const;

/** Routes that render the authenticated app sidebar on desktop. */
export const isAppSidebarPath = (pathname: string): boolean =>
  pathname === ROUTES.dashboard ||
  pathname.startsWith(`${ROUTES.dashboard}/`) ||
  pathname === ROUTES.admin ||
  pathname.startsWith(`${ROUTES.admin}/`);

export const resolveAppShellVariant = (pathname: string): AppShellVariant => {
  if (AUTH_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return "auth";
  }
  if (pathname === ROUTES.dashboard || pathname.startsWith(`${ROUTES.dashboard}/`)) {
    return "dashboard";
  }
  if (pathname === ROUTES.admin || pathname.startsWith(`${ROUTES.admin}/`)) {
    return "admin";
  }
  return "public";
};

export const resolveAppSidebarKind = (variant: AppShellVariant): AppSidebarKind => {
  if (variant === "dashboard") {
    return "dashboard";
  }
  if (variant === "admin") {
    return "admin";
  }
  return "none";
};

export const shouldShowAppNavbar = (variant: AppShellVariant): boolean =>
  variant !== "auth";

export const shouldShowAppFooter = (variant: AppShellVariant): boolean =>
  variant === "public";

export const shouldShowHomeSkipLink = (pathname: string): boolean =>
  pathname === ROUTES.home;
