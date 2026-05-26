"use client";

import Link from "next/link";

import { propertyDetailPath } from "@/constants/routes";
import { PropertyPrice } from "@/features/properties/components/PropertyPrice";
import type { PropertyMapPin } from "@/features/locations/types/locationMap";
import type { MapHoverCardPosition } from "@/features/locations/utils/computeMapHoverCardPosition";
import { cn } from "@/lib/utils";
import type { PropertyType } from "@/types/property";

const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  land: "Land",
  commercial: "Commercial",
  rental: "Rental",
};

export type PropertyMapHoverCardProps = {
  pin: PropertyMapPin;
  position: MapHoverCardPosition;
  className?: string;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

export const PropertyMapHoverCard = ({
  pin,
  position,
  className,
  onPointerEnter,
  onPointerLeave,
}: PropertyMapHoverCardProps) => {
  const locationLine = [pin.location, pin.address]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className={cn("novacity-map-hover-card", className)}
      style={{ left: position.left, top: position.top }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      aria-label={`${pin.title} — ${PROPERTY_TYPE_LABEL[pin.propertyType]}`}
    >
      <div className="novacity-map-hover-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pin.image} alt={pin.title} loading="eager" decoding="async" />
      </div>
      <div className="novacity-map-hover-card__body">
        <p className="novacity-map-hover-card__type">
          {PROPERTY_TYPE_LABEL[pin.propertyType]}
        </p>
        <h3 className="novacity-map-hover-card__title">{pin.title}</h3>
        {locationLine ? (
          <p className="novacity-map-hover-card__location">{locationLine}</p>
        ) : null}
        <PropertyPrice
          amount={pin.price}
          listingCurrency={pin.currency}
          pricingType={pin.pricingType}
          propertyStatus={pin.status}
          variant="card"
          className="novacity-map-hover-card__price"
        />
        <Link
          href={propertyDetailPath(pin.slug)}
          className="novacity-map-hover-card__link"
        >
          View listing
        </Link>
      </div>
    </article>
  );
};
