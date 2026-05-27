"use client";

import Link from "next/link";

import { useSidebarProfile } from "@/components/shared/SidebarProfileContext";
import { buttonVariants } from "@/components/ui/button";
import {
  navbarActionStackedSizeClass,
  navbarGoldCtaClass,
} from "@/components/shared/navigation/navbarActionStyles";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type SidebarListPropertyCtaProps = {
  className?: string;
  onNavigate?: () => void;
};

export const SidebarListPropertyCta = ({
  className,
  onNavigate,
}: SidebarListPropertyCtaProps) => {
  const profile = useSidebarProfile();
  const canCreateListings = profile?.canCreateListings ?? true;
  const href = canCreateListings
    ? ROUTES.dashboardListingsCreate
    : ROUTES.dashboardVerification;
  const label = canCreateListings ? "List a property" : "Verify to list";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={buttonVariants({
        variant: "gold",
        size: "default",
        className: cn(navbarGoldCtaClass, navbarActionStackedSizeClass, "w-full", className),
      })}
      aria-label={
        canCreateListings
          ? "Create a new property listing"
          : "Complete owner verification to list properties"
      }
    >
      {label}
    </Link>
  );
};
