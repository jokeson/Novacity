"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

import { ROUTES, propertyDetailPath } from "@/constants/routes";
import { getSession } from "@/server/auth/session";
import {
  addFavorite,
  findFavoriteByUserAndProperty,
  removeFavorite,
} from "@/server/repositories/favorite.repository";

export type FavoriteMutationResult =
  | { ok: true; isFavorite: boolean }
  | { ok: false; message: string };

export const addFavoriteAction = async (
  propertyId: string,
  slug: string,
): Promise<FavoriteMutationResult> => {
  const session = await getSession();
  if (!session) {
    return { ok: false, message: "Sign in to save favorites." };
  }
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return { ok: false, message: "Invalid property." };
  }

  const existing = await findFavoriteByUserAndProperty(session.sub, propertyId);
  if (existing) {
    return { ok: true, isFavorite: true };
  }

  await addFavorite({
    userId: new mongoose.Types.ObjectId(session.sub),
    propertyId: new mongoose.Types.ObjectId(propertyId),
  });

  revalidatePath(ROUTES.properties);
  revalidatePath(propertyDetailPath(slug));
  return { ok: true, isFavorite: true };
};

export const removeFavoriteAction = async (
  propertyId: string,
  slug: string,
): Promise<FavoriteMutationResult> => {
  const session = await getSession();
  if (!session) {
    return { ok: false, message: "Sign in to manage favorites." };
  }
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return { ok: false, message: "Invalid property." };
  }

  await removeFavorite(session.sub, propertyId);

  revalidatePath(ROUTES.properties);
  revalidatePath(propertyDetailPath(slug));
  return { ok: true, isFavorite: false };
};
