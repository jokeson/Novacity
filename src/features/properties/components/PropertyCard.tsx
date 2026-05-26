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
  /** Centers body text and loosens padding below `md` (homepage listing rails). */
  mobileCenterContent?: boolean;
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
  mobileCenterContent = false,
  className,
}: PropertyCardProps) => {
  const stateLabel = state?.trim() ?? "";
  const locationLabel = location?.trim() ?? "";
  const mobileBodyText = mobileCenterContent
    ? "max-md:h-auto max-md:min-h-[1.25rem] max-md:text-center max-md:line-clamp-2 max-md:whitespace-normal"
    : undefined;
  const mobileDetailText = mobileCenterContent
    ? "max-md:text-center max-md:line-clamp-2 max-md:whitespace-normal max-md:text-[0.8125rem]"
    : undefined;

  return (
    <article
      className={cn(uiPropertyCardShell, className)}
    >
      <div
        className={cn(
          "relative shrink-0 p-3 pb-0",
          mobileCenterContent && "max-md:p-4 max-md:pb-0 md:p-3",
        )}
      >
        <PropertyImage {...image} eagerLoad={priorityImage} />
        <div
          className={cn(
            "pointer-events-none absolute left-6 top-6 md:left-8 md:top-8",
            mobileCenterContent && "max-md:left-5 max-md:top-5",
          )}
        >
          <PropertyStatusBadge
            status={status}
            className="bg-background/90 pointer-events-auto shadow-none backdrop-blur-sm"
          />
        </div>
        {stateLabel ? (
          <div
            className={cn(
              "pointer-events-none absolute bottom-6 left-6 z-10 max-w-[calc(100%-3rem)] md:bottom-7 md:left-8",
              mobileCenterContent && "max-md:bottom-5 max-md:left-5",
            )}
          >
            <PropertyStateLabel stateLabel={stateLabel} />
          </div>
        ) : null}
      </div>
      <div
        className={cn(
          "flex w-full min-w-0 shrink-0 flex-col gap-1 overflow-hidden p-3 md:gap-1.5 md:p-4",
          mobileCenterContent &&
            "max-md:items-center max-md:gap-2 max-md:px-5 max-md:pt-3 max-md:pb-5 max-md:text-center",
        )}
      >
        <h3
          className={cn(
            uiPropertyCardTitle,
            mobileCenterContent &&
              "max-md:line-clamp-2 max-md:whitespace-normal max-md:text-center max-md:text-base max-md:leading-snug",
          )}
          title={title}
        >
          {title}
        </h3>
        {locationLabel ? (
          <p
            className={cn(
              "text-foreground min-w-0 truncate text-[clamp(0.75rem,3.5cqw,0.9rem)] leading-5",
              mobileDetailText,
            )}
            title={locationLabel}
          >
            {locationLabel}
          </p>
        ) : null}
        {postedLabel ? (
          <p
            className={cn(
              "text-foreground/80 min-w-0 truncate text-[clamp(0.72rem,3.3cqw,0.85rem)] leading-5",
              mobileDetailText,
            )}
            title={postedLabel}
          >
            {postedLabel}
          </p>
        ) : null}
        <PropertyMeta
          {...meta}
          variant="card"
          className={mobileBodyText}
        />
        <div
          className={cn(
            "flex h-[1.45rem] w-full min-w-0 shrink-0 items-center overflow-hidden",
            mobileCenterContent && "max-md:h-auto max-md:min-h-[1.45rem] max-md:justify-center",
          )}
        >
          <PropertyPrice
            amount={price}
            currency={currency}
            locale={locale}
            listingCurrency={listingCurrency}
            pricingType={pricingType}
            propertyStatus={status}
            variant="card"
            className={cn(
              "w-full max-w-full min-w-0",
              mobileCenterContent && "max-md:justify-center max-md:text-center",
            )}
          />
        </div>
      </div>
    </article>
  );
};
