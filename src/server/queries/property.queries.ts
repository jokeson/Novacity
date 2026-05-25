import mongoose from "mongoose";

import { MARKETING_PROPERTY_STATUSES } from "@/constants/propertyMarket";
import { connectDB } from "@/server/db/connect";
import { PropertyModel } from "@/server/models/Property";
import type { PropertyStatus } from "@/types/property";

const publicStatuses: PropertyStatus[] = MARKETING_PROPERTY_STATUSES;

/** Never surface drafts (or other non-public states) on the marketing site. */

export const listFeaturedProperties = async (limit = 12) => {
  await connectDB();
  return PropertyModel.find({
    isFeatured: true,
    status: { $in: publicStatuses },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const listRecentProperties = async (limit = 12) => {
  await connectDB();
  return PropertyModel.find({ status: { $in: publicStatuses } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const listPropertiesByOwner = async (ownerId: string) => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return [];
  }
  return PropertyModel.find({
    ownerId: new mongoose.Types.ObjectId(ownerId),
  })
    .sort({ createdAt: -1 })
    .lean();
};
