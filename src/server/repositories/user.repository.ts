import mongoose from "mongoose";
import { connectDB } from "@/server/db/connect";
import { UserModel, type UserDoc } from "@/server/models/User";
import type { UserRole } from "@/types/user";

type UserWithPassword = mongoose.HydratedDocument<
  UserDoc & { passwordHash: string }
>;

export const findUserWithPasswordByEmail = async (
  email: string,
): Promise<UserWithPassword | null> => {
  await connectDB();
  return UserModel.findOne({ email }).select("+passwordHash");
};

export const findUserByEmail = async (
  email: string,
): Promise<mongoose.HydratedDocument<UserDoc> | null> => {
  await connectDB();
  return UserModel.findOne({ email });
};

export const createUser = async (input: {
  email: string;
  passwordHash: string;
  name?: string;
  role: UserRole;
}): Promise<mongoose.HydratedDocument<UserDoc>> => {
  await connectDB();

  return UserModel.create({
    email: input.email,
    passwordHash: input.passwordHash,
    name: input.name ?? "",
    role: input.role,
    ownerVerificationStatus: input.role === "user" ? "unsubmitted" : "approved",
    ownerVerificationRejectionReason: "",
  });
};

export const listUsersForAdmin = async (limit = 200) => {
  await connectDB();
  return UserModel.find({})
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const updateUserById = async (
  id: string,
  patch: Partial<{
    suspendedAt: Date | null;
    name: string;
    role: UserRole;
    /** Secure HTTPS profile image URL (e.g. Cloudinary `secure_url`). */
    image: string;
    ownerVerificationStatus: string;
    ownerVerificationRejectionReason: string;
  }>,
): Promise<mongoose.HydratedDocument<UserDoc> | null> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return UserModel.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
};

export const deleteUserById = async (id: string): Promise<boolean> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  const res = await UserModel.findByIdAndDelete(id);
  return res !== null;
};

export const countUsersByRole = async (role: UserRole): Promise<number> => {
  await connectDB();
  return UserModel.countDocuments({ role });
};

export const listAdminUserIds = async (): Promise<mongoose.Types.ObjectId[]> => {
  await connectDB();
  const rows = await UserModel.find({ role: "admin" }).select("_id").lean();
  return rows.map((r) => r._id as mongoose.Types.ObjectId);
};
