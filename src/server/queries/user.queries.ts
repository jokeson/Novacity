import mongoose from "mongoose";
import { cache } from "react";

import type { UserRole } from "@/types/user";

import { isOwnerVerificationApprovedForListings } from "@/features/verification/services/listingAccessVerification";
import { connectDB } from "@/server/db/connect";
import { UserModel } from "@/server/models/User";

export const getUserByIdLean = async (id: string) => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return UserModel.findById(id).lean();
};

export type SidebarUserProfilePayload = {
  name: string;
  image: string | null;
  role: UserRole;
  canCreateListings: boolean;
  ownerVerificationStatus?: string;
};

export const getUserSidebarProfileById = cache(
  async (id: string): Promise<SidebarUserProfilePayload | null> => {
    const doc = await getUserByIdLean(id);
    if (!doc) {
      return null;
    }
    const u = doc as { name?: string; image?: string; role?: UserRole };
    const name =
      typeof u.name === "string" && u.name.trim().length > 0 ? u.name.trim() : "Account";
    const imageRaw = typeof u.image === "string" ? u.image.trim() : "";
    const role = u.role === "admin" || u.role === "company" || u.role === "user" ? u.role : "user";
    const ov = (u as { ownerVerificationStatus?: string }).ownerVerificationStatus;
    const canCreateListings = isOwnerVerificationApprovedForListings(role, ov);
    return {
      name,
      image: imageRaw.length > 0 ? imageRaw : null,
      role,
      canCreateListings,
      ownerVerificationStatus: typeof ov === "string" ? ov : undefined,
    };
  },
);

export const isUserSuspended = async (userId: string): Promise<boolean> => {
  const doc = await getUserByIdLean(userId);
  if (!doc) {
    return false;
  }
  const raw = doc as { suspendedAt?: Date | null };
  return raw.suspendedAt != null;
};

export const findUsersByIdsLean = async (ids: string[]) => {
  await connectDB();
  const oids = ids
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));
  if (oids.length === 0) {
    return [];
  }
  return UserModel.find({ _id: { $in: oids } })
    .select("_id email")
    .lean();
};
