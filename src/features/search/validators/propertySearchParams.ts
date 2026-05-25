import { z } from "zod";

import type { PricingType, PropertyType } from "@/types/property";

const PROPERTY_TYPES = [
  "house",
  "apartment",
  "land",
  "commercial",
  "rental",
] as const;

const statusFilterValues = [
  "all",
  "for-sale",
  "for-rent",
  "featured",
  "new-listing",
] as const;

const sortValues = ["recent", "price-asc", "price-desc"] as const;

const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().max(200).optional(),
);

const optionalPropertyType = z.preprocess((v) => {
  if (v === undefined || v === null || v === "") {
    return undefined;
  }
  const s = String(v);
  return (PROPERTY_TYPES as readonly string[]).includes(s) ? s : undefined;
}, z.custom<PropertyType>().optional());

const optionalListingSourceFilter = z.preprocess((v) => {
  if (v === undefined || v === null || v === "" || v === "all") {
    return "all";
  }
  const s = String(v);
  if (s === "owner") {
    return "owner";
  }
  if (s === "novacity" || s === "company" || s === "rentaler") {
    return "novacity";
  }
  return "all";
}, z.enum(["all", "owner", "novacity"]));

const optionalPricingFilter = z.preprocess((v) => {
  if (v === undefined || v === null || v === "" || v === "all") {
    return "all";
  }
  const s = String(v);
  if (s === "fixed" || s === "negotiable") {
    return s as PricingType;
  }
  return "all";
}, z.enum(["all", "fixed", "negotiable"]));

const emptyToUndefined = (value: unknown): unknown => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  return value;
};

const optionalFeaturedFlag = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return false;
  }
  if (value === true || value === "true" || value === "1" || value === 1) {
    return true;
  }
  return false;
}, z.boolean().default(false));

export const propertySearchParamsSchema = z.object({
  q: optionalString,
  /** Exact state/region label (matches `Property.state`, case-insensitive). */
  state: optionalString,
  location: optionalString,
  type: optionalPropertyType,
  /** Admin-curated homepage featured listings (`isFeatured` + public statuses). */
  featured: optionalFeaturedFlag,
  status: z.enum(statusFilterValues).default("all"),
  listingSource: optionalListingSourceFilter,
  pricingType: optionalPricingFilter,
  minPrice: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(500_000_000).optional()),
  maxPrice: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(500_000_000).optional()),
  minBeds: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(100).optional()),
  minBaths: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(100).optional()),
  sort: z.enum(sortValues).default("recent"),
  page: z.preprocess(
    (v) => (v === undefined || v === "" || v === null ? 1 : v),
    z.coerce.number().int().min(1).max(10_000),
  ),
  pageSize: z.preprocess(
    (v) => (v === undefined || v === "" || v === null ? 12 : v),
    z.coerce.number().int().min(6).max(48),
  ),
});

export type PropertySearchParams = z.output<typeof propertySearchParamsSchema>;

const firstString = (
  value: string | string[] | undefined,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw : undefined;
};

export const flattenSearchParamsRecord = (
  raw: Record<string, string | string[] | undefined>,
): Record<string, unknown> => {
  const flat: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const s = firstString(value);
    if (s !== undefined && s !== "") {
      flat[key] = s;
    }
  }
  const min = firstString(raw.min);
  const max = firstString(raw.max);
  if (min && flat.minPrice === undefined) {
    flat.minPrice = min;
  }
  if (max && flat.maxPrice === undefined) {
    flat.maxPrice = max;
  }
  if (flat.listingSource === undefined && flat.listingType !== undefined) {
    flat.listingSource = flat.listingType;
    delete flat.listingType;
  }
  return flat;
};

export const parsePropertySearchParams = (
  raw: Record<string, unknown>,
) => {
  const flat = flattenSearchParamsRecord(
    raw as Record<string, string | string[] | undefined>,
  );
  return propertySearchParamsSchema.safeParse(flat);
};
