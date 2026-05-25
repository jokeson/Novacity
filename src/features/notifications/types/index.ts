import type { NotificationType } from "@/types/domain";

export type NotificationListItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
};
