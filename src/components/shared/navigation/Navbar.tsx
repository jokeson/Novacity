import Link from "next/link";

import type { SessionPayload } from "@/lib/auth/session-jwt";
import { ROUTES } from "@/constants/routes";
import { Container } from "@/components/shared/Container";
import { getSession } from "@/server/auth/session";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";
import { listDistinctListingStates } from "@/server/queries/propertySearch.queries";

import { DesktopNavLinks } from "./DesktopNavLinks";
import { MobileNavbar } from "./MobileNavbar";
import { NavbarClient } from "./NavbarClient";
import type { NavbarProfilePayload } from "./UserNavbarProfile";

const navbarProfileForSession = async (
  session: SessionPayload,
): Promise<NavbarProfilePayload> => {
  const doc = await getUserSidebarProfileById(session.sub);
  if (doc) {
    return { name: doc.name, image: doc.image };
  }
  const local = session.email.split("@")[0]?.trim();
  return {
    name: local && local.length > 0 ? local : "Account",
    image: null,
  };
};

export const Navbar = async () => {
  const session = await getSession();
  const profile = session ? await navbarProfileForSession(session) : null;
  let canCreateListings = true;
  if (session) {
    const sidebarProfile = await getUserSidebarProfileById(session.sub);
    canCreateListings =
      sidebarProfile?.canCreateListings ?? session.role !== "user";
  }
  let listingStates: string[] = [];
  try {
    listingStates = await listDistinctListingStates();
  } catch {
    listingStates = [];
  }

  return (
    <header className="border-border bg-background/90 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <Container>
        <div className="flex h-16 min-w-0 items-center justify-between gap-2 sm:gap-3 lg:h-[4.25rem] lg:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-6 lg:gap-8">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-8">
              <div className="md:hidden">
                <MobileNavbar
                  isAuthenticated={Boolean(session)}
                  profile={session ? profile : null}
                  listingStates={listingStates}
                  canCreateListings={canCreateListings}
                />
              </div>
              <Link
                href={ROUTES.home}
                className="focus-visible:ring-ring inline-flex shrink-0 cursor-pointer rounded-md focus-visible:ring-3 focus-visible:outline-none"
              >
                <span className="font-heading text-lg font-semibold tracking-tight md:text-xl">
                  <span className="text-gold drop-shadow-[0_0_10px_rgba(212,160,23,0.55)]">
                    Nova
                  </span>
                  <span className="text-foreground">city</span>
                </span>
              </Link>
            </div>
            <DesktopNavLinks listingStates={listingStates} className="hidden md:flex" />
          </div>
          <NavbarClient
            isAuthenticated={Boolean(session)}
            profile={session ? profile : null}
            listingStates={listingStates}
            canCreateListings={canCreateListings}
          />
        </div>
      </Container>
    </header>
  );
};
