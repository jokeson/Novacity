import type {
  ListingCurrency,
  PricingType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

export type PropertyMapPin = {
  slug: string;
  title: string;
  price: number;
  currency: ListingCurrency;
  pricingType: PricingType;
  status: PropertyStatus;
  propertyType: PropertyType;
  location: string;
  address: string;
  /** Resolved public image URL (listing photo or homepage card fallback). */
  image: string;
  lat: number;
  lng: number;
};

export type PropertyMapViewport = {
  center: { lat: number; lng: number };
  bounds: {
    south: number;
    north: number;
    west: number;
    east: number;
  };
  defaultZoom: number;
  spread: { latDelta: number; lngDelta: number };
  ariaLabel: string;
  mapHint: string;
};
