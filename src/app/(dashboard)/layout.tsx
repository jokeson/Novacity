import { DashboardPageChrome } from "@/features/dashboard/components/DashboardPageChrome";
import { PassKeyPublishBanner } from "@/features/passkeys/components/PassKeyPublishBanner";
import { OwnerVerificationBanner } from "@/features/verification/components/OwnerVerificationBanner";
import { requireSessionForDashboard } from "@/server/auth/session";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";
import { syncDashboardNotificationsForUser } from "@/server/services/dashboardNotificationSync.service";
import { hasValidPublishPassKey } from "@/server/services/passkey.service";

export default async function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireSessionForDashboard();
  await syncDashboardNotificationsForUser(session.sub);
  const doc = await getUserSidebarProfileById(session.sub);
  const profile = doc ?? {
    canCreateListings: session.role !== "user",
  };

  const showOwnerVerificationBanner =
    session.role === "user" && profile.canCreateListings === false;
  const showPassKeyPublishBanner =
    session.role === "user" &&
    profile.canCreateListings === true &&
    !(await hasValidPublishPassKey(session.sub));

  return (
    <DashboardPageChrome
      topSlot={
        showOwnerVerificationBanner ? (
          <OwnerVerificationBanner />
        ) : showPassKeyPublishBanner ? (
          <PassKeyPublishBanner />
        ) : undefined
      }
    >
      {children}
    </DashboardPageChrome>
  );
}
