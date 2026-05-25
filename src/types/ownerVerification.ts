/** Denormalized on `User` for fast listing-access checks (authoritative; never trust client-only). */
export type OwnerVerificationStatus =
  | "unsubmitted"
  | "pending"
  | "approved"
  | "rejected";

export type OwnerVerificationApplicationStatus = "pending" | "approved" | "rejected";

export type ApplicantNationality = "south-sudanese" | "international";

export type OwnerIdDocumentType =
  | "national_id"
  | "drivers_license"
  | "passport";
