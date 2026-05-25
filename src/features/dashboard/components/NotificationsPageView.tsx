import { NotificationList } from "@/features/notifications/components/NotificationList";
import type { NotificationListItem } from "@/features/notifications/types";

export type { NotificationListItem };

export type NotificationsPageViewProps = {
  items: NotificationListItem[];
};

export const NotificationsPageView = ({ items }: NotificationsPageViewProps) => {
  return <NotificationList items={items} />;
};
