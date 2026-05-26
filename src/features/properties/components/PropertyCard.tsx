import type {
  ListingCurrency,
  PricingType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

import { uiPropertyCardShell, uiPropertyCardTitle } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

import { PropertyImage } from "./PropertyImage";
import { PropertyMeta } from "./PropertyMeta";
import { PropertyPrice } from "./PropertyPrice";
import { PropertyStateLabel } from "./PropertyStateLabel";
import { PropertyStatusBadge } from "./PropertyStatusBadge";

export type PropertyCardProps = {
  title: string;
  image: { src: string; alt: string };
  price: number;
  currency?: string;
  locale?: string;
  listingCurrency?: ListingCurrency;
  pricingType?: PricingType;
  status: PropertyStatus;
  /** State/region shown bottom-left on the card image when set. */
  state?: string;
  /** City, neighborhood, or address line under the title. */
  location?: string;
  /** Formatted post date, e.g. `posted : 5-12-2026`. */
  postedLabel?: string;
  meta: {
    beds?: number | null;
    baths?: number | null;
    sqft?: number | null;
    propertyType?: PropertyType | null;
  };
  priorityImage?: boolean;
  className?: string;
};

export const PropertyCard = ({
  title,
  image,
  price,
  currency,
  locale,
  listingCurrency,
  pricingType = "fixed",
  status,
  state,
  location,
  postedLabel,
  meta,
  priorityImage,
  className,
}: PropertyCardProps) => {
  const stateLabel = state?.trim() ?? "";
  const locationLabel = location?.trim() ?? "";
  return (
    <article
      className={cn(uiPropertyCardShell, className)}
    >
      <div className="relative shrink-0 p-3 pb-0">
        <PropertyImage
          {...image}
          eagerLoad={priorityImage}
          className="rounded-2xl ring-1 ring-black/5"
        />
        <div className="pointer-events-none absolute left-6 top-6 md:left-8 md:top-8">
          <PropertyStatusBadge
            status={status}
            className="bg-background/90 pointer-events-auto shadow-sm backdrop-blur-sm"
          />
        </div>
        {stateLabel ? (
          <div className="pointer-events-none absolute bottom-6 left-6 z-10 max-w-[calc(100%-3rem)] md:bottom-7 md:left-8">
            <PropertyStateLabel stateLabel={stateLabel} />
          </div>
        ) : null}
      </div>
      <div className="flex w-full min-w-0 shrink-0 flex-col gap-1 overflow-hidden p-3 md:gap-1.5 md:p-4">
        <h3 className={uiPropertyCardTitle} title={title}>
          {title}
        </h3>
        {locationLabel ? (
          <p
            className="text-foreground min-w-0 truncate text-[clamp(0.75rem,3.5cqw,0.9rem)] leading-5"
            title={locationLabel}
          >
            {locationLabel}
          </p>
        ) : null}
        {postedLabel ? (
          <p
            className="text-foreground/80 min-w-0 truncate text-[clamp(0.72rem,3.3cqw,0.85rem)] leading-5"
            title={postedLabel}
          >
            {postedLabel}
          </p>
        ) : null}
        <PropertyMeta {...meta} variant="card" />
        <div className="flex h-[1.45rem] w-full min-w-0 shrink-0 items-center overflow-hidden">
          <PropertyPrice
            amount={price}
            currency={currency}
            locale={locale}
            listingCurrency={listingCurrency}
            pricingType={pricingType}
            propertyStatus={status}
            variant="card"
            className="w-full max-w-full min-w-0"
          />
        </div>
      </div>
    </article>
  );
};
