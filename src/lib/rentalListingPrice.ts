import type { PropertyStatus } from "@/types/property";

const MONTHLY_RENTAL_STATUSES = new Set<PropertyStatus>(["for-rent", "rented"]);

/** True when price should show a `/ monthly` suffix (rental listings). */
export const isMonthlyRentalListingStatus = (
  status: PropertyStatus | string | null | undefined,
): boolean => {
  if (!status || typeof status !== "string") {
    return false;
  }
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "-");
  if (normalized === "rent" || normalized === "for-rent" || normalized === "rented") {
    return true;
  }
  return MONTHLY_RENTAL_STATUSES.has(status as PropertyStatus);
};

export const LISTING_PRICE_MONTHLY_SUFFIX = " / monthly";
