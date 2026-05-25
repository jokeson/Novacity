"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { MobileSidebarSheet } from "@/components/shared/navigation/MobileSidebarSheet";
import { sidebarTitleLinkClassName } from "@/components/shared/navigation/sidebarNavStyles";
import { AuthenticatedNavbarActions } from "./AuthenticatedNavbarActions";
import { MobileNavLinks } from "./MobileNavLinks";
import { NavbarActions } from "./NavbarActions";
import { UserNavbarProfile } from "./UserNavbarProfile";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { ROUTES } from "@/constants/routes";
import { uiIconInteractive } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

import type { NavbarProfilePayload } from "./UserNavbarProfile";

export type MobileNavbarProps = {
  isAuthenticated: boolean;
  profile: NavbarProfilePayload | null;
  listingStates: string[];
  canCreateListings?: boolean;
};

export const MobileNavbar = ({
  isAuthenticated,
  profile,
  listingStates,
  canCreateListings = true,
}: MobileNavbarProps) => {
  const [open, setOpen] = useState(false);

  const handleNavigate = (): void => {
    setOpen(false);
  };

  const footer = isAuthenticated ? (
    <>
      {profile ? (
        <UserNavbarProfile
          name={profile.name}
          image={profile.image}
          tone="on-primary"
          className="max-w-none self-stretch"
        />
      ) : null}
      <AuthenticatedNavbarActions
        stacked
        showSignOut={false}
        canCreateListings={canCreateListings}
        tone="on-primary"
      />
      <SignOutButton
        variant="outline"
        size="default"
        formClassName="w-full"
        className="border-primary-foreground/30 text-primary-foreground hover:border-gold hover:bg-primary-foreground/10 w-full cursor-pointer rounded-xl bg-transparent font-semibold shadow-sm transition-all duration-300 hover:shadow-md active:translate-y-px"
      />
    </>
  ) : (
    <NavbarActions stacked onWillOpenAuth={handleNavigate} />
  );

  return (
    <MobileSidebarSheet
      open={open}
      onOpenChange={setOpen}
      triggerLabel="Open menu"
      trigger={<Menu className="size-5" aria-hidden />}
      triggerClassName={cn(uiIconInteractive, "size-9 shrink-0 cursor-pointer")}
      title={
        <Link
          href={ROUTES.home}
          onClick={handleNavigate}
          className={sidebarTitleLinkClassName}
        >
          Novacity
        </Link>
      }
      footer={footer}
    >
      <MobileNavLinks
        listingStates={listingStates}
        onNavigate={handleNavigate}
        variant="sidebar"
      />
    </MobileSidebarSheet>
  );
};
