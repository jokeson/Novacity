import mongoose from "mongoose";

import { connectDB } from "@/server/db/connect";
import {
  InterestedClientModel,
  type InterestedClientDoc,
} from "@/server/models/InterestedClient";
import type { InterestedClientStatus } from "@/types/domain";

export const createInterestedClient = async (input: {
  propertyId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status?: InterestedClientStatus;
}): Promise<mongoose.HydratedDocument<InterestedClientDoc>> => {
  await connectDB();
  return InterestedClientModel.create(input);
};

export const listInterestedClientsForOwner = async (
  ownerId: string,
  status?: InterestedClientStatus,
): Promise<mongoose.HydratedDocument<InterestedClientDoc>[]> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return [];
  }
  const filter: Record<string, unknown> = {
    ownerId: new mongoose.Types.ObjectId(ownerId),
  };
  if (status) {
    filter.status = status;
  }
  return InterestedClientModel.find(filter).sort({ createdAt: -1 });
};
