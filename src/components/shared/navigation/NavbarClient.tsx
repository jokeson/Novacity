"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdvancedSearchModal } from "@/features/home/components/AdvancedSearchModal";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { cn } from "@/lib/utils";

import { navbarSignOutDesktopClass } from "@/components/shared/navigation/navbarActionStyles";

import { AuthenticatedNavbarActions } from "./AuthenticatedNavbarActions";
import { NavbarActions } from "./NavbarActions";
import { UserNavbarProfile, type NavbarProfilePayload } from "./UserNavbarProfile";

export type NavbarClientProps = {
  isAuthenticated: boolean;
  profile: NavbarProfilePayload | null;
  listingStates: string[];
  canCreateListings?: boolean;
};

export const NavbarClient = ({
  isAuthenticated,
  profile,
  listingStates,
  canCreateListings = true,
}: NavbarClientProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOpenSearch = (): void => {
    setSearchOpen(true);
  };

  const searchButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "text-gold hover:text-gold hover:bg-gold/12 focus-visible:text-gold focus-visible:ring-gold/35",
        "size-9 shrink-0 cursor-pointer transition-all duration-300",
      )}
      aria-label="Open property search"
      onClick={handleOpenSearch}
    >
      <Search
        className="size-5 drop-shadow-[0_0_8px_rgba(212,160,23,0.45)]"
        aria-hidden
      />
    </Button>
  );

  return (
    <>
      <AdvancedSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        listingStates={listingStates}
      />
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <AuthenticatedNavbarActions
                showSignOut={false}
                canCreateListings={canCreateListings}
              />
              {searchButton}
              {profile ? (
                <UserNavbarProfile name={profile.name} image={profile.image} />
              ) : null}
              <SignOutButton
                variant="outline"
                size="sm"
                className={navbarSignOutDesktopClass}
              />
            </>
          ) : (
            <>
              <NavbarActions />
              {searchButton}
            </>
          )}
        </div>
        <div className="flex items-center gap-1 md:hidden">
          {searchButton}
        </div>
      </div>
    </>
  );
};
