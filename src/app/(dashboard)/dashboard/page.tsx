import { DashboardPageView } from "@/features/dashboard/components/DashboardPageView";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import {
  countUnreadNotificationsForUser,
  getNotificationsForUser,
} from "@/server/services/notification.service";
import {
  getOwnerListingStats,
} from "@/server/queries/dashboard.queries";
import { listPropertiesByOwner } from "@/server/queries/property.queries";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardHomePage() {
  const session = await requireVerifiedOwnerForDashboard();
  const [profile, properties, listingStats, unreadCount, notificationDocs] =
    await Promise.all([
      getUserSidebarProfileById(session.sub),
      listPropertiesByOwner(session.sub),
      getOwnerListingStats(session.sub),
      countUnreadNotificationsForUser(session.sub),
      getNotificationsForUser(session.sub, 5),
    ]);

  const displayName = profile?.name ?? "";
  const canCreateListings = profile?.canCreateListings ?? session.role !== "user";

  const recentListings = properties.slice(0, 5).map((doc) => ({
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    status: doc.status,
    views: typeof doc.views === "number" ? doc.views : 0,
    expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : null,
  }));

  const recentNotifications = notificationDocs.map((doc) => ({
    id: String(doc._id),
    title: doc.title,
    message: doc.message,
    type: doc.type,
    isRead: Boolean(doc.isRead),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
  }));

  const stats = {
    listingCount: listingStats.listingCount,
    totalViews: listingStats.totalViews,
    expiringSoonCount: listingStats.expiringSoonCount,
    unreadNotifications: unreadCount,
  };

  return (
    <DashboardPageView
      displayName={displayName}
      isAdmin={session.role === "admin"}
      canCreateListings={canCreateListings}
      stats={stats}
      recentListings={recentListings}
      recentNotifications={recentNotifications}
    />
  );
}
