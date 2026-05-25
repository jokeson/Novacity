import type { ListingCurrency } from "@/types/property";

import { LISTING_PRICE_MONTHLY_SUFFIX } from "@/lib/rentalListingPrice";

const formatWithGrouping = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(amount);

export type FormatListingPriceOptions = {
  /** Append ` / monthly` for for-rent / rented listings. */
  monthly?: boolean;
};

/** Display price per product spec: `SSP 5,000,000` · `USD $45,000` (negotiable handled by caller). */
export const formatListingPriceDisplay = (
  amount: number,
  currency: ListingCurrency,
  options?: FormatListingPriceOptions,
): string => {
  let formatted: string;
  if (currency === "SSP") {
    formatted = `SSP ${formatWithGrouping(amount)}`;
  } else {
    try {
      const withSymbol = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
      }).format(amount);
      formatted = `USD ${withSymbol}`;
    } catch {
      formatted = `USD ${formatWithGrouping(amount)}`;
    }
  }
  return options?.monthly ? `${formatted}${LISTING_PRICE_MONTHLY_SUFFIX}` : formatted;
};
