import type { ListingCurrency, PricingType, PropertyStatus } from "@/types/property";

import { cn } from "@/lib/utils";
import { PriceText } from "@/components/shared/PriceText";

export type PropertyPriceProps = {
  amount: number;
  currency?: string;
  locale?: string;
  pricingType?: PricingType;
  listingCurrency?: ListingCurrency;
  propertyStatus?: PropertyStatus;
  variant?: "default" | "card";
  className?: string;
};

export const PropertyPrice = ({
  amount,
  currency,
  locale,
  pricingType,
  listingCurrency,
  propertyStatus,
  variant = "default",
  className,
}: PropertyPriceProps) => {
  return (
    <PriceText
      amount={amount}
      currency={currency}
      locale={locale}
      pricingType={pricingType}
      listingCurrency={listingCurrency}
      propertyStatus={propertyStatus}
      variant={variant}
      className={cn(className)}
    />
  );
};
