import type mongoose from "mongoose";

import * as favoriteRepository from "@/server/repositories/favorite.repository";

export const addFavoriteForUser = async (input: {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
}) => {
  return favoriteRepository.addFavorite(input);
};

export const removeFavoriteForUser = async (
  userId: string,
  propertyId: string,
) => {
  return favoriteRepository.removeFavorite(userId, propertyId);
};

export const getFavoritesForUser = async (userId: string) => {
  return favoriteRepository.listFavoritesForUser(userId);
};
