import mongoose from "mongoose";

import { connectDB } from "@/server/db/connect";
import {
  OwnerVerificationApplicationModel,
  type OwnerVerificationApplicationDoc,
} from "@/server/models/OwnerVerificationApplication";
import type { OwnerVerificationApplicationStatus } from "@/types/ownerVerification";

export const createOwnerVerificationApplication = async (input: {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  residentialAddress: string;
  postingState: string;
  applicantNationality: "south-sudanese" | "international";
  idDocumentType: "national_id" | "drivers_license" | "passport";
  idDocumentUrl: string;
}): Promise<mongoose.HydratedDocument<OwnerVerificationApplicationDoc>> => {
  await connectDB();
  return OwnerVerificationApplicationModel.create({
    ...input,
    status: "pending",
    rejectionReason: "",
  });
};

export const findPendingApplicationByUserId = async (
  userId: string,
): Promise<mongoose.HydratedDocument<OwnerVerificationApplicationDoc> | null> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }
  return OwnerVerificationApplicationModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    status: "pending",
  });
};

export const listPendingOwnerVerificationApplications = async (
  limit = 100,
): Promise<OwnerVerificationApplicationDoc[]> => {
  await connectDB();
  return OwnerVerificationApplicationModel.find({ status: "pending" })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
};

export type OwnerVerificationApplicationWithUserRow = OwnerVerificationApplicationDoc & {
  userId: { _id: mongoose.Types.ObjectId; email?: string; name?: string };
};

/** @deprecated Use {@link listOwnerVerificationApplicationsWithUsers} */
export type PendingOwnerVerificationRow = OwnerVerificationApplicationWithUserRow;

export const listOwnerVerificationApplicationsWithUsers = async (
  filter: OwnerVerificationApplicationStatus | "all",
  limit = 100,
): Promise<OwnerVerificationApplicationWithUserRow[]> => {
  await connectDB();
  const query = filter === "all" ? {} : { status: filter };
  const sort =
    filter === "pending" ? ({ createdAt: 1 } as const) : ({ createdAt: -1 } as const);
  const rows = await OwnerVerificationApplicationModel.find(query)
    .populate("userId", "email name")
    .sort(sort)
    .limit(limit)
    .lean();
  return rows as OwnerVerificationApplicationWithUserRow[];
};

export const listPendingOwnerVerificationApplicationsWithUsers = async (
  limit = 100,
): Promise<OwnerVerificationApplicationWithUserRow[]> =>
  listOwnerVerificationApplicationsWithUsers("pending", limit);

export const findOwnerVerificationApplicationById = async (
  id: string,
): Promise<mongoose.HydratedDocument<OwnerVerificationApplicationDoc> | null> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return OwnerVerificationApplicationModel.findById(id);
};

export const updateOwnerVerificationApplicationById = async (
  id: string,
  patch: Partial<{
    status: OwnerVerificationApplicationStatus;
    rejectionReason: string;
  }>,
): Promise<mongoose.HydratedDocument<OwnerVerificationApplicationDoc> | null> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return OwnerVerificationApplicationModel.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  });
};
