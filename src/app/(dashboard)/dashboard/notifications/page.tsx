import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import {
  NotificationsPageView,
  type NotificationListItem,
} from "@/features/dashboard/components/NotificationsPageView";
import { ROUTES } from "@/constants/routes";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import { getNotificationsForUser } from "@/server/services/notification.service";

export const metadata = {
  title: "Notifications",
};

export default async function DashboardNotificationsPage() {
  const session = await requireVerifiedOwnerForDashboard();
  const docs = await getNotificationsForUser(session.sub, 100);

  const items: NotificationListItem[] = docs.map((doc) => ({
    id: String(doc._id),
    title: doc.title,
    message: doc.message,
    type: doc.type,
    isRead: Boolean(doc.isRead),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
  }));

  return (
    <>
      <DashboardHeader
        title="Notifications"
        backLink={{ href: ROUTES.dashboard, label: "Back to overview" }}
        description="Listing milestones, expirations, PassKey windows, lead inquiries, and status updates appear here."
      />
      <Container className="py-8 md:py-10">
        <NotificationsPageView items={items} />
      </Container>
    </>
  );
}
