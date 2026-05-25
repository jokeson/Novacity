import { z } from "zod";

import { PROPERTY_DEFAULTS } from "@/constants/property";
import { listingRequiresAreaDimensions } from "@/features/listings/utils/listingArea";
import type { ListingCurrency, PricingType, PropertyStatus, PropertyType } from "@/types/property";

export const LISTING_CREATE_IMAGE_COUNT = PROPERTY_DEFAULTS.createImageCount;

const propertyTypeEnum = z.enum([
  "house",
  "apartment",
  "land",
  "commercial",
  "rental",
] satisfies [PropertyType, ...PropertyType[]]);

const pricingTypeEnum = z.enum(["fixed", "negotiable"] satisfies [
  PricingType,
  ...PricingType[],
]);

const listingCurrencyEnum = z.enum(["SSP", "USD"] satisfies [
  ListingCurrency,
  ...ListingCurrency[],
]);

const propertyStatusEnum = z.enum([
  "draft",
  "for-sale",
  "for-rent",
  "sold",
  "rented",
  "featured",
  "new-listing",
] satisfies [PropertyStatus, ...PropertyStatus[]]);

const emptyToUndefined = (value: unknown): unknown => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  return value;
};

const optionalAreaMeters = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0, "Cannot be negative.").max(1_000_000).optional(),
);

const imageRefSchema = z
  .string()
  .trim()
  .min(1, "Image link cannot be empty.")
  .refine(
    (value) =>
      /^https?:\/\//i.test(value) || value.startsWith("/uploads/listings/"),
    "Use an http(s) URL or an uploaded path under /uploads/listings/.",
  );

const listingFormFields = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(200, "Title is too long."),
  description: z
    .string()
    .trim()
    .max(20_000, "Description is too long.")
    .default(""),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  currency: listingCurrencyEnum.default("USD"),
  propertyType: propertyTypeEnum,
  pricingType: pricingTypeEnum,
  state: z.string().trim().max(120, "State or region is too long.").default(""),
  location: z.string().trim().max(500, "Location is too long.").default(""),
  address: z.string().trim().max(500, "Address is too long.").default(""),
  phone: z.string().trim().max(40, "Phone number is too long.").default(""),
  images: z.array(imageRefSchema).max(24, "At most 24 images.").default([]),
  status: propertyStatusEnum,
  bedrooms: z.coerce.number().int().min(0).max(100).default(0),
  bathrooms: z.coerce.number().min(0).max(100).default(0),
  areaWidthM: optionalAreaMeters,
  areaLengthM: optionalAreaMeters,
  areaSqM: optionalAreaMeters,
  expiresAt: z.string().trim().optional().default(""),
});

const applyListingPublishRules = (
  data: z.infer<typeof listingFormFields>,
  ctx: z.RefinementCtx,
): void => {
  if (data.status === "draft") {
    return;
  }
  if (data.price <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Set a price greater than zero before publishing.",
    });
  }
  if (!data.state.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["state"],
      message: "Choose a state or region before publishing.",
    });
  }
  const phone = data.phone.trim();
  if (phone.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["phone"],
      message: "Add a contact phone number (at least 6 characters) before publishing.",
    });
  }
  if (!data.expiresAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expiresAt"],
      message: "Published listings need an expiration date.",
    });
    return;
  }
  const expires = new Date(data.expiresAt);
  if (Number.isNaN(+expires)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expiresAt"],
      message: "Enter a valid expiration date.",
    });
    return;
  }
  if (expires <= new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expiresAt"],
      message: "Expiration must be in the future.",
    });
  }

  if (listingRequiresAreaDimensions(data.status)) {
    const width = data.areaWidthM;
    const length = data.areaLengthM;
    const sqM = data.areaSqM;

    if (width === undefined || width <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["areaWidthM"],
        message: "Enter the property width in meters before publishing for sale.",
      });
    }
    if (length === undefined || length <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["areaLengthM"],
        message: "Enter the property length in meters before publishing for sale.",
      });
    }
    if (sqM === undefined || sqM <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["areaSqM"],
        message: "Enter the total area in square meters (m²) before publishing for sale.",
      });
    }

    if (
      width != null &&
      width > 0 &&
      length != null &&
      length > 0 &&
      sqM != null &&
      sqM > 0
    ) {
      const expected = Math.round(width * length * 100) / 100;
      if (Math.abs(sqM - expected) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["areaSqM"],
          message: `Total area should be close to width × length (${expected} m²).`,
        });
      }
    }
  }
};

export const listingFormSchema = listingFormFields.superRefine(applyListingPublishRules);

const normalizeListingImages = (value: unknown): unknown => {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.filter((item) => typeof item === "string" && item.trim().length > 0);
};

const createListingFormFields = listingFormFields.extend({
  images: z.preprocess(
    normalizeListingImages,
    z
      .array(imageRefSchema)
      .length(
        LISTING_CREATE_IMAGE_COUNT,
        `Upload exactly ${LISTING_CREATE_IMAGE_COUNT} property photos.`,
      ),
  ),
});

export const createListingFormSchema =
  createListingFormFields.superRefine(applyListingPublishRules);

export type ListingFormValues = z.infer<typeof listingFormSchema>;
export type CreateListingFormValues = z.infer<typeof createListingFormSchema>;
