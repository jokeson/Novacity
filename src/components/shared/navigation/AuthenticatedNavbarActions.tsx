"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import {
  navbarActionSizeClass,
  navbarActionStackedSizeClass,
  navbarGoldCtaClass,
  navbarOutlineDefaultClass,
  navbarOutlineOnPrimaryClass,
} from "@/components/shared/navigation/navbarActionStyles";
import { setAppSidebarOpenPreference } from "@/components/shared/navigation/CollapsibleAppSidebar";
import { ROUTES } from "@/constants/routes";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { cn } from "@/lib/utils";

export type AuthenticatedNavbarActionsProps = {
  className?: string;
  stacked?: boolean;
  /** When false, render only dashboard + list (sign out is placed after search on desktop). */
  showSignOut?: boolean;
  canCreateListings?: boolean;
  /** Navy mobile drawer — light-outline CTAs */
  tone?: "default" | "on-primary";
  /** Close the mobile drawer after navigation (e.g. list a property). */
  onNavigate?: () => void;
};

export const AuthenticatedNavbarActions = ({
  className,
  stacked = false,
  showSignOut = true,
  canCreateListings = true,
  tone = "default",
  onNavigate,
}: AuthenticatedNavbarActionsProps) => {
  const isOnPrimary = tone === "on-primary";
  const outlineBtnClass = isOnPrimary
    ? navbarOutlineOnPrimaryClass
    : navbarOutlineDefaultClass;
  const pathname = usePathname();
  const sizeCls = stacked ? "default" : "sm";
  const sizeClass = stacked ? navbarActionStackedSizeClass : navbarActionSizeClass;
  const hideDashboard = pathname.startsWith(ROUTES.dashboard);
  const listPropertyHref = canCreateListings
    ? ROUTES.dashboardListingsCreate
    : ROUTES.dashboardVerification;
  const listPropertyLabel = canCreateListings ? "List a property" : "Verify to list";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        stacked && "flex-col items-stretch",
        className,
      )}
    >
      {!stacked && !hideDashboard ? (
        <Link
          href={ROUTES.dashboard}
          onClick={() => {
            setAppSidebarOpenPreference(true);
            onNavigate?.();
          }}
          className={buttonVariants({
            variant: "outline",
            size: sizeCls,
            className: cn(outlineBtnClass, sizeClass, stacked && "w-full"),
          })}
        >
          Dashboard
        </Link>
      ) : null}
      <Link
        href={listPropertyHref}
        onClick={onNavigate}
        className={buttonVariants({
          variant: "gold",
          size: sizeCls,
          className: cn(navbarGoldCtaClass, sizeClass, stacked && "w-full"),
        })}
        aria-label={
          canCreateListings
            ? "Create a new property listing"
            : "Complete owner verification to list properties"
        }
      >
        {listPropertyLabel}
      </Link>
      {showSignOut ? (
        <SignOutButton
          variant="outline"
          size={sizeCls}
          formClassName={stacked ? "w-full" : undefined}
          className={cn(
            outlineBtnClass,
            sizeClass,
            stacked && "w-full justify-center",
          )}
        />
      ) : null}
    </div>
  );
};
