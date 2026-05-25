import { HOME_LISTING_SECTIONS } from "@/features/home/constants/homeListingSections";
import { listHomepageRailProperties } from "@/server/queries/propertySearch.queries";
import type { HomepageListingRail } from "@/server/queries/propertySearch.queries";

import { HomeListingSection } from "./HomeListingSection";

export type HomeListingRailProps = {
  rail: HomepageListingRail;
  showListPropertyCta?: boolean;
  listPropertyHref?: string;
  listPropertyLabel?: string;
};

export const HomeListingRail = async ({
  rail,
  showListPropertyCta = false,
  listPropertyHref,
  listPropertyLabel,
}: HomeListingRailProps) => {
  const config = HOME_LISTING_SECTIONS[rail];
  const { items, error } = await listHomepageRailProperties(rail);

  return (
    <HomeListingSection
      {...config}
      items={items}
      fetchFailed={Boolean(error)}
      fetchErrorMessage={error}
      showListPropertyCta={showListPropertyCta}
      listPropertyHref={listPropertyHref}
      listPropertyLabel={listPropertyLabel}
    />
  );
};
