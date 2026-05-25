import mongoose from "mongoose";

import { connectDB } from "@/server/db/connect";
import { PassKeyModel, type PassKeyDoc } from "@/server/models/PassKey";

export const createPassKey = async (input: {
  code: string;
  userId: mongoose.Types.ObjectId | null;
  duration: number;
  isActive?: boolean;
  expiresAt: Date;
  usedAt?: Date | null;
}): Promise<mongoose.HydratedDocument<PassKeyDoc>> => {
  await connectDB();
  return PassKeyModel.create(input);
};

export const findPassKeyByCode = async (
  code: string,
): Promise<mongoose.HydratedDocument<PassKeyDoc> | null> => {
  await connectDB();
  const normalized = code.trim().toUpperCase();
  return PassKeyModel.findOne({ code: normalized });
};

export const updatePassKeyById = async (
  id: string,
  patch: Partial<{
    isActive: boolean;
    usedAt: Date | null;
    expiresAt: Date;
  }>,
): Promise<mongoose.HydratedDocument<PassKeyDoc> | null> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return PassKeyModel.findByIdAndUpdate(id, patch, { new: true });
};

/** Active, unexpired, unused pass key — required for non-admin owner publish. */
export const hasValidPublishPassKey = async (userId: string): Promise<boolean> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return false;
  }
  const now = new Date();
  const count = await PassKeyModel.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    isActive: true,
    expiresAt: { $gt: now },
    usedAt: null,
  });
  return count > 0;
};

export const listPassKeysForUser = async (
  userId: string,
): Promise<mongoose.HydratedDocument<PassKeyDoc>[]> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }
  return PassKeyModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 });
};

export const listPassKeysForAdmin = async (
  limit = 100,
): Promise<mongoose.HydratedDocument<PassKeyDoc>[]> => {
  await connectDB();
  return PassKeyModel.find({}).sort({ createdAt: -1 }).limit(limit);
};

export const redeemPassKeyPoolToUser = async (
  passKeyId: string,
  userId: string,
): Promise<mongoose.HydratedDocument<PassKeyDoc> | null> => {
  await connectDB();
  if (
    !mongoose.Types.ObjectId.isValid(passKeyId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return null;
  }
  return PassKeyModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(passKeyId),
      userId: null,
      isActive: true,
      expiresAt: { $gt: new Date() },
      usedAt: null,
    },
    { $set: { userId: new mongoose.Types.ObjectId(userId) } },
    { new: true },
  );
};

export const deletePassKeyByIdIfUnused = async (
  id: string,
): Promise<{ ok: true } | { ok: false; reason: "not_found" | "was_used" }> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "not_found" };
  }
  const doc = await PassKeyModel.findById(id).lean();
  if (!doc) {
    return { ok: false, reason: "not_found" };
  }
  const usedAt = (doc as { usedAt?: Date | null }).usedAt;
  if (usedAt != null) {
    return { ok: false, reason: "was_used" };
  }
  await PassKeyModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  return { ok: true };
};

export const consumeOldestUnusedPassKey = async (
  userId: string,
): Promise<boolean> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return false;
  }
  const now = new Date();
  const updated = await PassKeyModel.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(userId),
      isActive: true,
      expiresAt: { $gt: now },
      usedAt: null,
    },
    { $set: { usedAt: now } },
    { sort: { createdAt: 1 }, new: true },
  );
  return updated !== null;
};
