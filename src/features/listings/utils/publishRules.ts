import type { PropertyStatus } from "@/types/property";
import type { UserRole } from "@/types/user";

export const isPublishedListingStatus = (status: PropertyStatus): boolean =>
  status !== "draft";

/** Owner accounts need a PassKey to leave draft; admins exempt; company accounts per product spec. */
export const publishRequiresPassKey = (
  status: PropertyStatus,
  role: UserRole,
): boolean =>
  isPublishedListingStatus(status) &&
  role !== "admin" &&
  role !== "company";

/** When true, the first transition to a published status consumes one unused PassKey. */
export const shouldConsumePassKeyOnPublish = (
  role: UserRole,
  previousStatus: PropertyStatus | undefined,
  nextStatus: PropertyStatus,
): boolean => {
  if (!publishRequiresPassKey(nextStatus, role)) {
    return false;
  }
  const nextPublished = isPublishedListingStatus(nextStatus);
  const prevPublished =
    previousStatus !== undefined && isPublishedListingStatus(previousStatus);
  return nextPublished && !prevPublished;
};
