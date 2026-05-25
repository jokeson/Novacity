import type mongoose from "mongoose";

import * as notificationRepository from "@/server/repositories/notification.repository";
import type { NotificationType } from "@/types/domain";

export const sendNotification = async (input: {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  relatedPropertyId?: mongoose.Types.ObjectId | null;
  relatedPassKeyId?: mongoose.Types.ObjectId | null;
}) => {
  return notificationRepository.createNotification(input);
};

export const getNotificationsForUser = async (
  userId: string,
  limit?: number,
) => {
  return notificationRepository.listNotificationsForUser(userId, limit);
};

export const countUnreadNotificationsForUser = async (userId: string) => {
  return notificationRepository.countUnreadNotificationsForUser(userId);
};

export const markNotificationAsRead = async (id: string, userId: string) => {
  return notificationRepository.markNotificationRead(id, userId);
};
