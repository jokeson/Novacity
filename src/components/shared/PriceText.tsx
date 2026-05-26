import { uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";
import { formatListingPriceDisplay } from "@/lib/formatListingCurrency";
import {
  isMonthlyRentalListingStatus,
  LISTING_PRICE_MONTHLY_SUFFIX,
} from "@/lib/rentalListingPrice";
import type { ListingCurrency, PricingType, PropertyStatus } from "@/types/property";

export type PriceTextProps = {
  amount: number;
  /** Used when `listingCurrency` is not set (legacy / non-listing contexts). */
  currency?: string;
  locale?: string;
  pricingType?: PricingType;
  /** When set, formats as marketplace listing (SSP / USD per product spec). */
  listingCurrency?: ListingCurrency;
  /** When `for-rent` or `rented`, appends ` / monthly` to fixed listing prices. */
  propertyStatus?: PropertyStatus | string;
  /** Card layout: single-line price with fluid type (smaller when `/ monthly` is shown). */
  variant?: "default" | "card";
  className?: string;
};

const defaultPriceClassName = uiTypography.propertyPrice;

const cardPriceSingleClassName =
  "font-heading text-foreground block min-w-0 max-w-full truncate font-semibold tracking-tight text-[clamp(0.82rem,5.8cqw,1.1rem)] leading-tight";

const cardPriceRowClassName =
  "flex h-full w-full max-w-full min-w-0 items-center overflow-hidden";

const formatAmount = (
  amount: number,
  currency: string,
  locale: string,
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PriceText = ({
  amount,
  currency = "USD",
  locale = "en-US",
  pricingType = "fixed",
  listingCurrency,
  propertyStatus,
  variant = "default",
  className,
}: PriceTextProps) => {
  const showMonthly = isMonthlyRentalListingStatus(propertyStatus);
  const isCard = variant === "card";

  if (pricingType === "negotiable") {
    return (
      <span
        className={cn(
          isCard
            ? "text-foreground block min-w-0 max-w-full truncate font-semibold text-[clamp(0.5rem,5cqw,0.75rem)] leading-none"
            : defaultPriceClassName,
          isCard ? cardPriceRowClassName : undefined,
          className,
        )}
        title={isCard ? "Contact for price" : undefined}
      >
        Contact for price
      </span>
    );
  }

  const formatted = listingCurrency
    ? formatListingPriceDisplay(amount, listingCurrency, { monthly: showMonthly })
    : showMonthly
      ? `${formatAmount(amount, currency, locale)}${LISTING_PRICE_MONTHLY_SUFFIX}`
      : formatAmount(amount, currency, locale);

  if (isCard) {
    const cardDisplay =
      showMonthly && formatted.endsWith(LISTING_PRICE_MONTHLY_SUFFIX)
        ? `${formatted.slice(0, -LISTING_PRICE_MONTHLY_SUFFIX.length).trimEnd()} Monthly`
        : formatted;

    return (
      <span className={cn(cardPriceRowClassName, className)} title={cardDisplay}>
        <span className={cardPriceSingleClassName}>{cardDisplay}</span>
      </span>
    );
  }

  return (
    <span className={cn(defaultPriceClassName, className)}>{formatted}</span>
  );
};
