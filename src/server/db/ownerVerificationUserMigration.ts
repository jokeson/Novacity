import { connectDB } from "@/server/db/connect";
import { UserModel } from "@/server/models/User";

/**
 * Existing `user` accounts created before owner verification shipped are treated as approved
 * so the marketplace does not hard-lock legacy owners.
 */
export const runOwnerVerificationUserMigration = async (): Promise<void> => {
  await connectDB();
  await UserModel.updateMany(
    {
      role: "user",
      $or: [
        { ownerVerificationStatus: { $exists: false } },
        { ownerVerificationStatus: null },
      ],
    },
    { $set: { ownerVerificationStatus: "approved", ownerVerificationRejectionReason: "" } },
  ).catch(() => {
    /* ignore if field not yet in schema on stale connection */
  });
};
