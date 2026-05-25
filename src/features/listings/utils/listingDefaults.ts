import type { ListingFormValues } from "@/features/listings/validators/listingSchema";
import type {
  ListingCurrency,
  ListingSource,
  PricingType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

import {
  defaultExpiresAtInputValue,
  toDateTimeLocalValue,
} from "@/features/listings/utils/expiration";

type ListingDocShape = {
  title: string;
  description?: string;
  price: number;
  currency?: ListingCurrency;
  propertyType: PropertyType;
  listingSource?: ListingSource;
  pricingType: PricingType;
  state?: string;
  location?: string;
  address?: string;
  phone?: string;
  images?: string[];
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  areaWidthM?: number | null;
  areaLengthM?: number | null;
  areaSqM?: number | null;
  expiresAt?: Date | null;
};

export const toListingFormDefaults = (doc: ListingDocShape): ListingFormValues => ({
  title: doc.title,
  description: doc.description ?? "",
  price: doc.price,
  currency: doc.currency ?? "USD",
  propertyType: doc.propertyType,
  pricingType: doc.pricingType,
  state: doc.state ?? "",
  location: doc.location ?? "",
  address: doc.address ?? "",
  phone: doc.phone ?? "",
  images: doc.images ?? [],
  status: doc.status,
  bedrooms: doc.bedrooms ?? 0,
  bathrooms: doc.bathrooms ?? 0,
  areaWidthM: doc.areaWidthM ?? undefined,
  areaLengthM: doc.areaLengthM ?? undefined,
  areaSqM: doc.areaSqM ?? undefined,
  expiresAt:
    doc.status === "draft"
      ? doc.expiresAt
        ? toDateTimeLocalValue(doc.expiresAt)
        : ""
      : doc.expiresAt
        ? toDateTimeLocalValue(doc.expiresAt)
        : defaultExpiresAtInputValue(),
});
