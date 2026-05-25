import type { PropertyStatus } from "@/types/property";
import type { UserRole } from "@/types/user";

import { getUserByIdLean } from "@/server/queries/user.queries";
import {
  isOwnerVerificationApprovedForListings,
  listingVerificationRequiredMessage,
} from "@/features/verification/services/listingAccessVerification";

import {
  isPublishedListingStatus,
  publishRequiresPassKey,
} from "@/features/listings/utils/publishRules";
import { hasValidPublishPassKey } from "@/server/services/passkey.service";

export const ensurePublishEligibility = async (
  userId: string,
  role: UserRole,
  status: PropertyStatus,
): Promise<{ ok: true } | { ok: false; message: string }> => {
  if (role === "user") {
    const user = await getUserByIdLean(userId);
    const ov = (user as { ownerVerificationStatus?: string } | null)
      ?.ownerVerificationStatus;
    if (
      !isOwnerVerificationApprovedForListings(role, ov) &&
      isPublishedListingStatus(status)
    ) {
      return { ok: false, message: listingVerificationRequiredMessage };
    }
  }

  if (!publishRequiresPassKey(status, role)) {
    return { ok: true };
  }

  const allowed = await hasValidPublishPassKey(userId);
  if (!allowed) {
    return {
      ok: false,
      message:
        "Publishing requires an active PassKey on your account. Save as draft, or ask an admin to issue a PassKey.",
    };
  }

  return { ok: true };
};
