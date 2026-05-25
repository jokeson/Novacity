import mongoose from "mongoose";

import { connectDB } from "@/server/db/connect";
import {
  NotificationModel,
  type NotificationDoc,
} from "@/server/models/Notification";
import type { NotificationType } from "@/types/domain";

export const createNotification = async (input: {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  relatedPropertyId?: mongoose.Types.ObjectId | null;
  relatedPassKeyId?: mongoose.Types.ObjectId | null;
}): Promise<mongoose.HydratedDocument<NotificationDoc>> => {
  await connectDB();
  return NotificationModel.create(input);
};

const MS_PER_DAY = 86_400_000;

export const hasRecentNotificationForContext = async (params: {
  userId: string;
  type: NotificationType;
  sinceMsAgo: number;
  relatedPropertyId?: mongoose.Types.ObjectId;
  relatedPassKeyId?: mongoose.Types.ObjectId;
}): Promise<boolean> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(params.userId)) {
    return false;
  }
  const since = new Date(Date.now() - params.sinceMsAgo);
  const filter: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(params.userId),
    type: params.type,
    createdAt: { $gte: since },
  };
  if (params.relatedPropertyId) {
    filter.relatedPropertyId = params.relatedPropertyId;
  }
  if (params.relatedPassKeyId) {
    filter.relatedPassKeyId = params.relatedPassKeyId;
  }
  const count = await NotificationModel.countDocuments(filter);
  return count > 0;
};

/** Default cooldown between repeat “expiring soon” alerts for the same entity. */
export const NOTIFICATION_REPEAT_COOLDOWN_MS = 5 * MS_PER_DAY;

export const listNotificationsForUser = async (
  userId: string,
  limit = 50,
): Promise<mongoose.HydratedDocument<NotificationDoc>[]> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }
  return NotificationModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const countUnreadNotificationsForUser = async (
  userId: string,
): Promise<number> => {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return 0;
  }
  return NotificationModel.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    isRead: false,
  });
};

export const markNotificationRead = async (
  id: string,
  userId: string,
): Promise<mongoose.HydratedDocument<NotificationDoc> | null> => {
  await connectDB();
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return null;
  }
  return NotificationModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    },
    { isRead: true },
    { new: true },
  );
};
