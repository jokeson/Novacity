import mongoose from "mongoose";

import { connectDB } from "@/server/db/connect";
import { FavoriteModel, type FavoriteDoc } from "@/server/models/Favorite";

export const addFavorite = async (input: {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
}): Promise<mongoose.HydratedDocument<FavoriteDoc>> => {
  await connectDB();
  return FavoriteModel.create(input);
};

export const removeFavorite = async (
  userId: string,
  propertyId: string,
): Promise<boolean> => {
  await connectDB();
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(propertyId)
  ) {
    return false;
  }
  const res = await FavoriteModel.findOneAndDelete({
    userId: new mongoose.Types.ObjectId(userId),
    propertyId: new mongoose.Types.ObjectId(propertyId),
  });
  return res !== null;
};

export const listFavoritesForUser = async (
  userId: string,
): Promise<mongoose.HydratedDocument<FavoriteDoc>[]> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }
  return FavoriteModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 });
};

export const findFavoriteByUserAndProperty = async (
  userId: string,
  propertyId: string,
): Promise<mongoose.HydratedDocument<FavoriteDoc> | null> => {
  await connectDB();
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(propertyId)
  ) {
    return null;
  }
  return FavoriteModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    propertyId: new mongoose.Types.ObjectId(propertyId),
  });
};
