import type mongoose from "mongoose";

import * as interestedClientRepository from "@/server/repositories/interestedClient.repository";
import type { InterestedClientStatus } from "@/types/domain";

export const recordPropertyInterest = async (input: {
  propertyId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) => {
  return interestedClientRepository.createInterestedClient({
    ...input,
    status: "new",
  });
};

export const getLeadsForOwner = async (
  ownerId: string,
  status?: InterestedClientStatus,
) => {
  return interestedClientRepository.listInterestedClientsForOwner(
    ownerId,
    status,
  );
};
