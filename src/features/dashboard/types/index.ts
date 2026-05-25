import type { NotificationListItem } from "@/features/notifications/types";
import type { PropertyStatus } from "@/types/property";

export type DashboardRecentListing = {
  id: string;
  title: string;
  slug: string;
  status: PropertyStatus;
  views: number;
  expiresAt: string | null;
};

export type DashboardRecentNotification = NotificationListItem;

export type DashboardStatsSummary = {
  listingCount: number;
  totalViews: number;
  expiringSoonCount: number;
  unreadNotifications: number;
};
