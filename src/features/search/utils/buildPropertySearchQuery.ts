import type { PropertySearchParams } from "@/features/search/validators/propertySearchParams";

const append = (
  params: URLSearchParams,
  key: string,
  value: string | number | undefined | null,
) => {
  if (value === undefined || value === null) {
    return;
  }
  if (value === "") {
    return;
  }
  if (
    value === "all" &&
    (key === "status" || key === "listingSource" || key === "pricingType")
  ) {
    return;
  }
  params.set(key, String(value));
};

export const buildPropertySearchQuery = (
  parsed: PropertySearchParams,
  overrides?: Partial<PropertySearchParams>,
): string => {
  const next = { ...parsed, ...overrides };
  const params = new URLSearchParams();

  append(params, "q", next.q);
  append(params, "state", next.state);
  append(params, "location", next.location);
  append(params, "type", next.type);
  if (next.featured) {
    append(params, "featured", "1");
  }
  append(params, "status", next.status === "all" ? undefined : next.status);
  append(
    params,
    "listingSource",
    next.listingSource === "all" ? undefined : next.listingSource,
  );
  append(
    params,
    "pricingType",
    next.pricingType === "all" ? undefined : next.pricingType,
  );
  append(params, "minPrice", next.minPrice);
  append(params, "maxPrice", next.maxPrice);
  append(params, "minBeds", next.minBeds);
  append(params, "minBaths", next.minBaths);
  append(params, "sort", next.sort === "recent" ? undefined : next.sort);
  append(params, "page", next.page > 1 ? next.page : undefined);
  append(params, "pageSize", next.pageSize !== 12 ? next.pageSize : undefined);

  const qs = params.toString();
  return qs.length > 0 ? `?${qs}` : "";
};
