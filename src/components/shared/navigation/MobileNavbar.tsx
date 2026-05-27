"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { MobileSidebarSheet } from "@/components/shared/navigation/MobileSidebarSheet";
import { sidebarTitleLinkClassName } from "@/components/shared/navigation/sidebarNavStyles";
import { AuthModal, type AuthModalView } from "@/features/auth/components/AuthModal";
import { AuthenticatedNavbarActions } from "./AuthenticatedNavbarActions";
import { MobileNavLinks } from "./MobileNavLinks";
import { NavbarActions } from "./NavbarActions";
import { UserNavbarProfile } from "./UserNavbarProfile";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { ROUTES } from "@/constants/routes";
import { navbarSignOutOnPrimaryClass } from "@/components/shared/navigation/navbarActionStyles";
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
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState<AuthModalView>("sign-in");

  const handleNavigate = (): void => {
    setOpen(false);
  };

  const handleRequestAuth = (view: AuthModalView): void => {
    setOpen(false);
    setAuthInitialView(view);
    setAuthOpen(true);
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
        onNavigate={handleNavigate}
      />
      <SignOutButton
        variant="outline"
        size="default"
        formClassName="w-full"
        className={navbarSignOutOnPrimaryClass}
      />
    </>
  ) : (
    <NavbarActions stacked onRequestAuth={handleRequestAuth} />
  );

  return (
    <>
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
            <span className="inline-flex flex-col gap-0.5">
              <span className="font-heading text-lg font-semibold tracking-tight">
                <span className="text-gold drop-shadow-[0_0_12px_rgba(212,160,23,0.65)]">
                  Nova
                </span>
                <span className="text-white">city</span>
              </span>
              <span className="text-primary-foreground/85 text-[0.7rem] font-medium tracking-wide">
                Building the future of Africa cities
              </span>
            </span>
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
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        initialView={authInitialView}
        onAuthSuccess={() => setAuthOpen(false)}
      />
    </>
  );
};
