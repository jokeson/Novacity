import type { PropertySearchParams } from "@/features/search/validators/propertySearchParams";

/** True when navbar **Listings** opens the full catalog with no active filters. */
export const isMarketplaceBrowseAllView = (
  params: PropertySearchParams,
): boolean => {
  if (params.featured) {
    return false;
  }
  if (params.q?.trim()) {
    return false;
  }
  if (params.state?.trim()) {
    return false;
  }
  if (params.location?.trim()) {
    return false;
  }
  if (params.type) {
    return false;
  }
  if (params.status !== "all") {
    return false;
  }
  if (params.listingSource !== "all") {
    return false;
  }
  if (params.pricingType !== "all") {
    return false;
  }
  if (params.minPrice !== undefined) {
    return false;
  }
  if (params.maxPrice !== undefined) {
    return false;
  }
  if (params.minBeds !== undefined) {
    return false;
  }
  if (params.minBaths !== undefined) {
    return false;
  }
  if (params.sort !== "recent") {
    return false;
  }
  if (params.page !== 1) {
    return false;
  }
  return true;
};
