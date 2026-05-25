import type { ReactNode } from "react";
import { MapPin } from "lucide-react";

import { PropertyContactPhone } from "@/features/properties/components/PropertyContactPhone";
import { PropertyStatusBadge } from "@/features/properties/components/PropertyStatusBadge";
import { formatPropertyAreaLabel } from "@/features/listings/utils/listingArea";
import { formatPublicListingLocation } from "@/features/properties/utils/formatPublicListingLocation";
import { uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";
import type { PropertyStatus, PropertyType } from "@/types/property";

const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  land: "Land",
  commercial: "Commercial",
  rental: "Rental",
};

export type PropertyListingDetailsSectionProps = {
  propertyType: PropertyType;
  status: PropertyStatus;
  state: string;
  location: string;
  address: string;
  phone: string;
  bedrooms: number;
  bathrooms: number;
  areaWidthM?: number | null;
  areaLengthM?: number | null;
  areaSqM?: number | null;
  className?: string;
};

type DetailRowProps = {
  label: string;
  children: ReactNode;
};

const DetailRow = ({ label, children }: DetailRowProps) => (
  <div className="flex flex-col gap-1">
    <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
      {label}
    </dt>
    <dd className={cn(uiTypography.body, "text-foreground")}>{children}</dd>
  </div>
);

type MobileStatTileProps = {
  label: string;
  value: string;
};

const MobileStatTile = ({ label, value }: MobileStatTileProps) => (
  <div className="border-border bg-muted/40 flex flex-col gap-1 rounded-2xl border px-4 py-3">
    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
      {label}
    </span>
    <span className="text-foreground text-sm font-semibold leading-snug">{value}</span>
  </div>
);

type MobileDetailRowProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

const MobileDetailRow = ({ label, children, className }: MobileDetailRowProps) => (
  <div
    className={cn(
      "border-border flex items-center justify-between gap-4 border-b px-4 py-3.5 last:border-b-0",
      className,
    )}
  >
    <span className="text-muted-foreground shrink-0 text-xs font-medium uppercase tracking-wide">
      {label}
    </span>
    <div className="text-foreground min-w-0 text-right text-sm font-medium leading-snug">
      {children}
    </div>
  </div>
);

export const PropertyListingDetailsSection = ({
  propertyType,
  status,
  state,
  location,
  address,
  phone,
  bedrooms,
  bathrooms,
  areaWidthM,
  areaLengthM,
  areaSqM,
  className,
}: PropertyListingDetailsSectionProps) => {
  const typeLabel = PROPERTY_TYPE_LABEL[propertyType] ?? propertyType;
  const locationLine = formatPublicListingLocation({ location, address, state });
  const bedLabel =
    bedrooms === 1 ? "1 bedroom" : `${bedrooms} bedrooms`;
  const bathLabel =
    bathrooms === 1 ? "1 bathroom" : `${bathrooms} bathrooms`;
  const areaLabel = formatPropertyAreaLabel(areaWidthM, areaLengthM, areaSqM);
  const showStateRow = Boolean(
    state.trim() && (location.trim() || address.trim()),
  );

  return (
    <section
      aria-labelledby="listing-details-heading"
      className={cn("space-y-4", className)}
    >
      <h2 id="listing-details-heading" className={uiTypography.cardTitle}>
        Listing details
      </h2>

      {locationLine ? (
        <>
          <div className="border-border bg-muted/30 flex items-start gap-3 rounded-2xl border p-4 sm:hidden">
            <MapPin
              className="text-gold mt-0.5 size-4 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
            <p className="text-foreground min-w-0 text-sm leading-relaxed">
              {locationLine}
            </p>
          </div>
          <p className="text-muted-foreground hidden items-start gap-2 text-sm leading-relaxed sm:flex">
            <MapPin
              className="text-gold mt-0.5 size-4 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
            <span>{locationLine}</span>
          </p>
        </>
      ) : null}

      {/* Mobile: stat tiles + compact row list */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          <MobileStatTile label="Bedrooms" value={bedLabel} />
          <MobileStatTile label="Bathrooms" value={bathLabel} />
        </div>

        <div className="border-border overflow-hidden rounded-2xl border">
          <MobileDetailRow label="Property type">{typeLabel}</MobileDetailRow>
          <MobileDetailRow label="Status">
            <span className="inline-flex justify-end">
              <PropertyStatusBadge status={status} />
            </span>
          </MobileDetailRow>
          {showStateRow ? (
            <MobileDetailRow label="State / region">{state.trim()}</MobileDetailRow>
          ) : null}
          {areaLabel ? (
            <MobileDetailRow label="Property area">{areaLabel}</MobileDetailRow>
          ) : null}
          {phone.trim() ? (
            <MobileDetailRow label="Contact phone">
              <PropertyContactPhone phone={phone} />
            </MobileDetailRow>
          ) : null}
        </div>
      </div>

      {/* Desktop / tablet: two-column definition grid */}
      <dl className="hidden gap-4 sm:grid sm:grid-cols-2">
        <DetailRow label="Property type">{typeLabel}</DetailRow>
        <DetailRow label="Status">
          <PropertyStatusBadge status={status} />
        </DetailRow>
        {showStateRow ? (
          <DetailRow label="State / region">{state.trim()}</DetailRow>
        ) : null}
        <DetailRow label="Bedrooms">{bedLabel}</DetailRow>
        <DetailRow label="Bathrooms">{bathLabel}</DetailRow>
        {areaLabel ? <DetailRow label="Property area">{areaLabel}</DetailRow> : null}
        {phone.trim() ? (
          <DetailRow label="Contact phone">
            <PropertyContactPhone phone={phone} />
          </DetailRow>
        ) : null}
      </dl>
    </section>
  );
};
