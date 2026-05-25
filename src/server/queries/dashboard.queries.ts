import mongoose from "mongoose";

import { connectDB } from "@/server/db/connect";
import { FavoriteModel } from "@/server/models/Favorite";
import { PropertyModel } from "@/server/models/Property";
import type {
  ListingCurrency,
  PricingType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

export type OwnerListingStats = {
  listingCount: number;
  totalViews: number;
  expiringSoonCount: number;
};

const MS_PER_DAY = 86_400_000;

export const getOwnerListingStats = async (
  ownerId: string,
): Promise<OwnerListingStats> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return { listingCount: 0, totalViews: 0, expiringSoonCount: 0 };
  }

  const oid = new mongoose.Types.ObjectId(ownerId);
  const now = new Date();
  const soon = new Date(now.getTime() + 7 * MS_PER_DAY);

  const [row] = await PropertyModel.aggregate<{
    listingCount: number;
    totalViews: number;
    expiringSoonCount: number;
  }>([
    { $match: { ownerId: oid } },
    {
      $group: {
        _id: null,
        listingCount: { $sum: 1 },
        totalViews: { $sum: { $ifNull: ["$views", 0] } },
        expiringSoonCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$expiresAt", null] },
                  { $gte: ["$expiresAt", now] },
                  { $lte: ["$expiresAt", soon] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  if (!row) {
    return { listingCount: 0, totalViews: 0, expiringSoonCount: 0 };
  }

  return {
    listingCount: row.listingCount,
    totalViews: row.totalViews,
    expiringSoonCount: row.expiringSoonCount,
  };
};

export type FavoritePropertyRow = {
  favoriteId: string;
  propertyId: string;
  title: string;
  slug: string;
  price: number;
  currency: ListingCurrency;
  pricingType: PricingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  image: string | null;
  bedrooms: number;
  bathrooms: number;
};

export const listFavoritePropertiesForUser = async (
  userId: string,
): Promise<FavoritePropertyRow[]> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }

  const oid = new mongoose.Types.ObjectId(userId);

  const rows = await FavoriteModel.aggregate<{
    _id: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    price: number;
    currency: ListingCurrency;
    pricingType: PricingType;
    propertyType: PropertyType;
    status: PropertyStatus;
    firstImage: string | null;
    bedrooms: number;
    bathrooms: number;
  }>([
    { $match: { userId: oid } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "properties",
        localField: "propertyId",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    {
      $project: {
        propertyId: "$property._id",
        title: "$property.title",
        slug: "$property.slug",
        price: "$property.price",
        currency: { $ifNull: ["$property.currency", "USD"] },
        pricingType: "$property.pricingType",
        propertyType: "$property.propertyType",
        status: "$property.status",
        firstImage: { $arrayElemAt: ["$property.images", 0] },
        bedrooms: "$property.bedrooms",
        bathrooms: "$property.bathrooms",
      },
    },
  ]);

  return rows.map((r) => ({
    favoriteId: String(r._id),
    propertyId: String(r.propertyId),
    title: r.title,
    slug: r.slug,
    price: r.price,
    currency: r.currency ?? "USD",
    pricingType: r.pricingType,
    propertyType: r.propertyType,
    status: r.status,
    image: r.firstImage ? String(r.firstImage) : null,
    bedrooms: r.bedrooms ?? 0,
    bathrooms: r.bathrooms ?? 0,
  }));
};
