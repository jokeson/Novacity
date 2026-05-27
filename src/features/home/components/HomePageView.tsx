import { Suspense } from "react";
import dynamic from "next/dynamic";

import { HOMEPAGE_LISTING_RAILS } from "@/features/home/constants/homeListingSections";
import { ROUTES } from "@/constants/routes";
import { getSession } from "@/server/auth/session";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";
import { getPublicHomeHeroResolved } from "@/server/queries/homeHero.queries";
import { listDistinctListingStates } from "@/server/queries/propertySearch.queries";

import { HeroSection } from "./HeroSection";
import { HomeListingRail } from "./HomeListingRail";
import { HomeListingSectionFallback } from "./HomeListingSectionFallback";
import { StatesHomeRail } from "./StatesHomeRail";
import { StatesHomeSectionFallback } from "./StatesHomeSectionFallback";

const CompanyInfoSection = dynamic(
  () =>
    import("./CompanyInfoSection").then((m) => ({
      default: m.CompanyInfoSection,
    })),
  {
    loading: () => (
      <div className="px-4 py-8 md:px-6">
        <div className="border-border bg-card mx-auto h-40 w-full max-w-6xl animate-pulse rounded-2xl border" />
      </div>
    ),
  },
);

export const HomePageView = async () => {
  const [session, heroContent, listingStatesResult] = await Promise.all([
    getSession(),
    getPublicHomeHeroResolved(),
    listDistinctListingStates().catch(() => [] as string[]),
  ]);

  const listingStates = listingStatesResult;
  const showListPropertyCta = Boolean(session);
  let listPropertyHref: string = ROUTES.dashboardListingsCreate;
  let listPropertyLabel = "List a property";
  if (session) {
    const profile = await getUserSidebarProfileById(session.sub);
    const canCreateListings =
      profile?.canCreateListings ?? session.role !== "user";
    if (!canCreateListings) {
      listPropertyHref = ROUTES.dashboardVerification;
      listPropertyLabel = "Verify to list";
    }
  }

  return (
    <>
      <HeroSection
        content={heroContent}
        listingStates={listingStates}
        showListPropertyCta={showListPropertyCta}
        listPropertyHref={listPropertyHref}
        listPropertyLabel={listPropertyLabel}
      />
      {HOMEPAGE_LISTING_RAILS.map((rail) => (
        <Suspense
          key={rail}
          fallback={<HomeListingSectionFallback rail={rail} />}
        >
          <HomeListingRail
            rail={rail}
            showListPropertyCta={showListPropertyCta}
            listPropertyHref={listPropertyHref}
            listPropertyLabel={listPropertyLabel}
          />
        </Suspense>
      ))}
      <Suspense fallback={<StatesHomeSectionFallback />}>
        <StatesHomeRail />
      </Suspense>
      <CompanyInfoSection />
    </>
  );
};
