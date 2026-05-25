import mongoose, { type InferSchemaType, type Model } from "mongoose";

import type {
  ListingCurrency,
  ListingSource,
  PricingType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

const propertyTypes: PropertyType[] = [
  "house",
  "apartment",
  "land",
  "commercial",
  "rental",
];

const listingSources: ListingSource[] = ["owner", "novacity"];

const listingCurrencies: ListingCurrency[] = ["SSP", "USD"];

const pricingTypes: PricingType[] = ["fixed", "negotiable"];

const propertyStatuses: PropertyStatus[] = [
  "draft",
  "for-sale",
  "for-rent",
  "sold",
  "rented",
  "featured",
  "new-listing",
];

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, trim: true, default: "" },
    propertyType: {
      type: String,
      required: true,
      enum: propertyTypes,
      index: true,
    },
    listingSource: {
      type: String,
      required: true,
      enum: listingSources,
      default: "owner",
      index: true,
    },
    currency: {
      type: String,
      required: true,
      enum: listingCurrencies,
      default: "USD",
      index: true,
    },
    pricingType: {
      type: String,
      required: true,
      enum: pricingTypes,
    },
    price: { type: Number, required: true, min: 0, index: true },
    /** State / region (used for public States nav + catalog filter). */
    state: { type: String, trim: true, default: "", index: true },
    location: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    /** Lister contact phone shown on the public property details page. */
    phone: { type: String, trim: true, default: "" },
    images: { type: [String], default: [] },
    bedrooms: { type: Number, min: 0, default: 0 },
    bathrooms: { type: Number, min: 0, default: 0 },
    /** Plot/building width in meters (for-sale listings). */
    areaWidthM: { type: Number, min: 0, default: null },
    /** Plot/building length in meters (for-sale listings). */
    areaLengthM: { type: Number, min: 0, default: null },
    /** Total area in square meters (m²). */
    areaSqM: { type: Number, min: 0, default: null },
    status: {
      type: String,
      required: true,
      enum: propertyStatuses,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    views: { type: Number, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

propertySchema.index({ ownerId: 1, status: 1 });
propertySchema.index({ listingSource: 1, propertyType: 1, status: 1 });
propertySchema.index({ createdAt: -1 });

export type PropertyDoc = InferSchemaType<typeof propertySchema> & {
  _id: mongoose.Types.ObjectId;
};

const PROPERTY_MODEL_NAME = "Property";

/**
 * Next.js dev (HMR) and some deploy paths can keep a stale `mongoose.models.Property`
 * compiled from an older schema (e.g. required `listingType`). Dropping the cache before
 * `mongoose.model()` ensures the current `propertySchema` is used (see `Errors-issues.md`).
 */
if (mongoose.models[PROPERTY_MODEL_NAME]) {
  delete mongoose.models[PROPERTY_MODEL_NAME];
}

export const PropertyModel: Model<PropertyDoc> = mongoose.model<PropertyDoc>(
  PROPERTY_MODEL_NAME,
  propertySchema,
);
