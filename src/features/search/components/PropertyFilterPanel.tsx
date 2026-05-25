import { inputClasses } from "@/features/search/utils/inputClasses";
import type { PropertySearchParams } from "@/features/search/validators/propertySearchParams";

import { LocationFilter } from "./LocationFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { PropertySearchBar } from "./PropertySearchBar";
import { PropertyTypeFilter } from "./PropertyTypeFilter";

export type PropertyFilterPanelProps = {
  defaults: PropertySearchParams;
  availableStates: string[];
};

export const PropertyFilterPanel = ({
  defaults,
  availableStates,
}: PropertyFilterPanelProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {defaults.featured ? (
        <input type="hidden" name="featured" value="1" />
      ) : null}
      <div className="md:col-span-2 lg:col-span-3">
        <PropertySearchBar defaultValue={defaults.q ?? ""} />
      </div>
      <LocationFilter defaultValue={defaults.location ?? ""} />
      {availableStates.length ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="catalog-state" className="text-sm font-medium">
            State / region
          </label>
          <select
            id="catalog-state"
            name="state"
            defaultValue={defaults.state ?? ""}
            className={inputClasses}
          >
            <option value="">All states</option>
            {availableStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <PropertyTypeFilter defaultValue={defaults.type ?? ""} />
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-status" className="text-sm font-medium">
          Availability
        </label>
        <select
          id="catalog-status"
          name="status"
          defaultValue={defaults.status}
          className={inputClasses}
        >
          <option value="all">All public statuses</option>
          <option value="for-sale">For sale</option>
          <option value="for-rent">For rent</option>
          <option value="featured">Featured</option>
          <option value="new-listing">New listing</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-listing-source" className="text-sm font-medium">
          Listed by
        </label>
        <select
          id="catalog-listing-source"
          name="listingSource"
          defaultValue={defaults.listingSource}
          className={inputClasses}
        >
          <option value="all">All listings</option>
          <option value="owner">Owner</option>
          <option value="novacity">Novacity</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-pricing" className="text-sm font-medium">
          Pricing
        </label>
        <select
          id="catalog-pricing"
          name="pricingType"
          defaultValue={defaults.pricingType}
          className={inputClasses}
        >
          <option value="all">Any pricing</option>
          <option value="fixed">Fixed price</option>
          <option value="negotiable">Negotiable</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-sort" className="text-sm font-medium">
          Sort
        </label>
        <select
          id="catalog-sort"
          name="sort"
          defaultValue={defaults.sort}
          className={inputClasses}
        >
          <option value="recent">Recently added</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-min-beds" className="text-sm font-medium">
          Min bedrooms
        </label>
        <input
          id="catalog-min-beds"
          name="minBeds"
          type="number"
          min={0}
          step={1}
          defaultValue={defaults.minBeds ?? ""}
          className={inputClasses}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-min-baths" className="text-sm font-medium">
          Min bathrooms
        </label>
        <input
          id="catalog-min-baths"
          name="minBaths"
          type="number"
          min={0}
          step={1}
          defaultValue={defaults.minBaths ?? ""}
          className={inputClasses}
        />
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <PriceRangeFilter
          defaultMin={
            defaults.minPrice !== undefined ? String(defaults.minPrice) : ""
          }
          defaultMax={
            defaults.maxPrice !== undefined ? String(defaults.maxPrice) : ""
          }
        />
      </div>
    </div>
  );
};
