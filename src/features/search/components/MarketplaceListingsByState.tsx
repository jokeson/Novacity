import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { buttonVariants } from "@/components/ui/button";
import { propertyDetailPath, ROUTES } from "@/constants/routes";
import { PropertyCard } from "@/features/properties/components/PropertyCard";
import { publicPropertyListItemToCardProps } from "@/features/properties/utils/publicPropertyListItemToCardProps";
import type { StateListingGroup } from "@/features/search/utils/groupListingsByState";
import { stateSlugFromLabel } from "@/features/search/utils/stateSlug";
import { uiPropertyCardGrid } from "@/lib/responsiveLayout";
import { cn } from "@/lib/utils";

export type MarketplaceListingsByStateProps = {
  groups: StateListingGroup[];
  total: number;
};

export const MarketplaceListingsByState = ({
  groups,
  total,
}: MarketplaceListingsByStateProps) => {
  if (total === 0 || groups.length === 0) {
    return (
      <EmptyState
        title="No listings yet"
        description="When sellers publish properties, they will appear here grouped by state."
        action={
          <Link
            href={ROUTES.home}
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-lg")}
          >
            Back to home
          </Link>
        }
      />
    );
  }

  const regionCount = groups.filter((g) => g.stateLabel.trim()).length;
  const summarySuffix =
    regionCount > 0
      ? ` across ${regionCount} ${regionCount === 1 ? "state" : "states"}`
      : "";

  return (
    <div className="flex min-w-0 flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
      {groups.map((group) => {
        const headingId = `state-group-${stateSlugFromLabel(group.stateLabel || "other")}`;
        return (
          <section
            key={headingId}
            aria-labelledby={headingId}
            className="flex flex-col gap-6"
          >
            <SectionTitle
              title={group.heading}
              headingId={headingId}
              description={
                group.items.length === 1
                  ? "1 property in this region"
                  : `${group.items.length} properties in this region`
              }
            />
            <ul className={uiPropertyCardGrid}>
              {group.items.map((item, index) => {
                const cardProps = publicPropertyListItemToCardProps(item);
                return (
                  <li key={item.slug} className="min-w-0">
                    <Link
                      href={propertyDetailPath(item.slug)}
                      className="focus-visible:ring-ring block h-full w-full min-w-0 max-w-full rounded-2xl focus-visible:ring-[3px] focus-visible:outline-none"
                      aria-label={`View listing: ${cardProps.title}`}
                    >
                      <PropertyCard
                        {...cardProps}
                        priorityImage={index < 2}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <p
        className="text-muted-foreground border-border border-t pt-8 text-center text-sm"
        aria-live="polite"
      >
        <span className="text-foreground font-medium">{total}</span>{" "}
        {total === 1 ? "listing" : "listings"}
        {summarySuffix}
      </p>
    </div>
  );
};
