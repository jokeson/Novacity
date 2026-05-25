import mongoose from "mongoose";

import {
  hasRecentNotificationForContext,
  NOTIFICATION_REPEAT_COOLDOWN_MS,
} from "@/server/repositories/notification.repository";
import { listOwnerPropertiesExpiringBetween } from "@/server/repositories/property.repository";
import { listPassKeysForUser } from "@/server/repositories/passkey.repository";
import { getUserByIdLean } from "@/server/queries/user.queries";
import { sendNotification } from "@/server/services/notification.service";
import type { UserRole } from "@/types/user";

const MS_PER_DAY = 86_400_000;
const LISTING_EXPIRY_WINDOW_MS = 7 * MS_PER_DAY;
const PASSKEY_EXPIRY_WINDOW_MS = 7 * MS_PER_DAY;

const formatShortDate = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

/**
 * Idempotent alerts for dashboard users: listing expiry and PassKey expiry windows.
 * Uses related ids + cooldown to avoid spamming on every navigation.
 */
const syncOwnerVerificationReminder = async (userId: string): Promise<void> => {
  const user = await getUserByIdLean(userId);
  if (!user) {
    return;
  }

  const role = (user as { role?: UserRole }).role ?? "user";
  if (role !== "user") {
    return;
  }

  const status = (user as { ownerVerificationStatus?: string }).ownerVerificationStatus;
  if (status === "approved" || status === "pending") {
    return;
  }

  const already = await hasRecentNotificationForContext({
    userId,
    type: "verification",
    sinceMsAgo: NOTIFICATION_REPEAT_COOLDOWN_MS,
  });
  if (already) {
    return;
  }

  const isRejected = status === "rejected";
  await sendNotification({
    userId: new mongoose.Types.ObjectId(userId),
    type: "verification",
    title: isRejected ? "Verification not approved" : "Complete owner verification",
    message: isRejected
      ? "Your owner application was not approved. Review the reason on the verification page and submit an updated application when ready."
      : "Submit your owner verification application to unlock listing creation, favorites, PassKeys, and other dashboard tools.",
  });
};

export const syncDashboardNotificationsForUser = async (userId: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return;
  }

  await syncOwnerVerificationReminder(userId);

  const now = new Date();
  const listingUntil = new Date(now.getTime() + LISTING_EXPIRY_WINDOW_MS);
  const expiringListings = await listOwnerPropertiesExpiringBetween(userId, now, listingUntil);

  for (const row of expiringListings) {
    const already = await hasRecentNotificationForContext({
      userId,
      type: "expiration",
      sinceMsAgo: NOTIFICATION_REPEAT_COOLDOWN_MS,
      relatedPropertyId: row._id,
    });
    if (already) {
      continue;
    }
    await sendNotification({
      userId: new mongoose.Types.ObjectId(userId),
      type: "expiration",
      title: "Listing expiring soon",
      message: `"${row.title}" expires on ${formatShortDate(row.expiresAt)}. Renew visibility or update the listing before it lapses.`,
      relatedPropertyId: row._id,
    });
  }

  const passkeyUntil = new Date(now.getTime() + PASSKEY_EXPIRY_WINDOW_MS);
  const keys = await listPassKeysForUser(userId);

  for (const key of keys) {
    const expiresAt = key.expiresAt ? new Date(key.expiresAt) : null;
    if (!expiresAt || expiresAt <= now || expiresAt > passkeyUntil) {
      continue;
    }
    if (!key.isActive) {
      continue;
    }
    const already = await hasRecentNotificationForContext({
      userId,
      type: "expiration",
      sinceMsAgo: NOTIFICATION_REPEAT_COOLDOWN_MS,
      relatedPassKeyId: key._id,
    });
    if (already) {
      continue;
    }
    await sendNotification({
      userId: new mongoose.Types.ObjectId(userId),
      type: "expiration",
      title: "PassKey expiring soon",
      message: `One of your PassKeys expires on ${formatShortDate(expiresAt)}. Redeem or request a new key before publishing deadlines slip.`,
      relatedPassKeyId: key._id,
    });
  }
};
