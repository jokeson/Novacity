import type { UserRole } from "@/types/user";
import type { OwnerVerificationStatus } from "@/types/ownerVerification";

export const isOwnerVerificationApprovedForListings = (
  role: UserRole,
  ownerVerificationStatus?: OwnerVerificationStatus | string | null,
): boolean => {
  if (role === "admin" || role === "company") {
    return true;
  }
  return ownerVerificationStatus === "approved";
};

export const listingVerificationRequiredMessage =
  "Complete owner verification before creating or publishing listings. Open Verification in the dashboard sidebar.";
