import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { HomeSectionBandShell } from "@/features/home/components/HomeSectionBandShell";
import { HOME_LISTING_SECTIONS } from "@/features/home/constants/homeListingSections";
import type { HomepageListingRail } from "@/server/queries/propertySearch.queries";

export type HomeListingSectionFallbackProps = {
  rail: HomepageListingRail;
};

export const HomeListingSectionFallback = ({
  rail,
}: HomeListingSectionFallbackProps) => {
  const { headingId, tone } = HOME_LISTING_SECTIONS[rail];

  return (
    <HomeSectionBandShell
      tone={tone}
      aria-labelledby={headingId}
      aria-busy
    >
      <div className="px-4 md:px-6">
        <LoadingSkeleton className="border-border bg-card mx-auto h-48 w-full max-w-6xl rounded-2xl border shadow-sm md:h-56" />
      </div>
    </HomeSectionBandShell>
  );
};
