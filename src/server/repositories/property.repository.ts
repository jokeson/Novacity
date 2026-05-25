import mongoose from "mongoose";

import { connectDB } from "@/server/db/connect";
import { PropertyModel, type PropertyDoc } from "@/server/models/Property";
import type {
  ListingCurrency,
  ListingSource,
  PricingType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

export type CreatePropertyInput = {
  title: string;
  slug: string;
  description?: string;
  propertyType: PropertyType;
  listingSource: ListingSource;
  currency: ListingCurrency;
  pricingType: PricingType;
  price: number;
  state?: string;
  location?: string;
  address?: string;
  phone?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  areaWidthM?: number | null;
  areaLengthM?: number | null;
  areaSqM?: number | null;
  status: PropertyStatus;
  ownerId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId | null;
  views?: number;
  isFeatured?: boolean;
  expiresAt?: Date | null;
};

export const createProperty = async (
  input: CreatePropertyInput,
): Promise<mongoose.HydratedDocument<PropertyDoc>> => {
  await connectDB();
  return PropertyModel.create(input);
};

export const findPropertyById = async (
  id: string,
): Promise<mongoose.HydratedDocument<PropertyDoc> | null> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return PropertyModel.findById(id);
};

export const findPropertyBySlug = async (
  slug: string,
): Promise<mongoose.HydratedDocument<PropertyDoc> | null> => {
  await connectDB();
  return PropertyModel.findOne({ slug });
};

export const updatePropertyById = async (
  id: string,
  patch: Partial<CreatePropertyInput>,
): Promise<mongoose.HydratedDocument<PropertyDoc> | null> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return PropertyModel.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  });
};

export const deletePropertyById = async (id: string): Promise<boolean> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  const res = await PropertyModel.findByIdAndDelete(id);
  return res !== null;
};

export const countPropertiesByOwner = async (ownerId: string): Promise<number> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return 0;
  }
  return PropertyModel.countDocuments({
    ownerId: new mongoose.Types.ObjectId(ownerId),
  });
};

const EXPIRING_LISTING_STATUSES: PropertyStatus[] = [
  "for-sale",
  "for-rent",
  "featured",
  "new-listing",
];

/** Active listings owned by `ownerId` whose `expiresAt` falls between `from` and `to` (inclusive window). */
export const listOwnerPropertiesExpiringBetween = async (
  ownerId: string,
  from: Date,
  to: Date,
): Promise<
  Array<{
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    expiresAt: Date;
  }>
> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return [];
  }
  const rows = await PropertyModel.find({
    ownerId: new mongoose.Types.ObjectId(ownerId),
    status: { $in: EXPIRING_LISTING_STATUSES },
    expiresAt: { $ne: null, $gte: from, $lte: to },
  })
    .select({ title: 1, slug: 1, expiresAt: 1 })
    .lean();

  return rows
    .filter((row) => row.expiresAt)
    .map((row) => ({
      _id: row._id as mongoose.Types.ObjectId,
      title: row.title,
      slug: row.slug,
      expiresAt: row.expiresAt as Date,
    }));
};

export const listPropertiesForAdmin = async (
  limit = 150,
): Promise<mongoose.FlattenMaps<PropertyDoc>[]> => {
  await connectDB();
  return PropertyModel.find({})
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();
};

export const incrementPropertyViewsBySlug = async (
  slug: string,
): Promise<void> => {
  await connectDB();
  await PropertyModel.updateOne({ slug }, { $inc: { views: 1 } });
};
