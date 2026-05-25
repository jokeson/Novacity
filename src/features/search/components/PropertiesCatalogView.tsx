import { MarketplaceListingsByState } from "@/features/search/components/MarketplaceListingsByState";
import { SearchResults } from "@/features/search/components/SearchResults";
import type { StateListingGroup } from "@/features/search/utils/groupListingsByState";
import type { PropertySearchParams } from "@/features/search/validators/propertySearchParams";
import type { PublicPropertyListItem } from "@/server/queries/propertySearch.queries";

export type PropertiesCatalogViewProps = {
  parsed: PropertySearchParams;
  total: number;
  /** Flat paginated grid when filters or sort are active. */
  items?: PublicPropertyListItem[];
  /** State-grouped sections for navbar **Listings** browse-all. */
  groups?: StateListingGroup[];
};

export const PropertiesCatalogView = ({
  parsed,
  items,
  groups,
  total,
}: PropertiesCatalogViewProps) => {
  if (groups) {
    return <MarketplaceListingsByState groups={groups} total={total} />;
  }

  return (
    <SearchResults items={items ?? []} parsed={parsed} total={total} />
  );
};
