import type { HomeListingRailProps } from "./HomeListingRail";
import { HomeListingRail } from "./HomeListingRail";

/** Homepage band 2 — Ownership / featured rail (see implementation doc 03). */
export const OwnershipHomeSection = (
  props: Omit<HomeListingRailProps, "rail">,
) => <HomeListingRail rail="featured" {...props} />;
