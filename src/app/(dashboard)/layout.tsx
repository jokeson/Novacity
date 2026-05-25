import { Navbar } from "@/components/shared/navigation/Navbar";
import {
  SidebarProfileProvider,
  type SidebarProfileData,
} from "@/components/shared/SidebarProfileContext";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { PassKeyPublishBanner } from "@/features/passkeys/components/PassKeyPublishBanner";
import { OwnerVerificationBanner } from "@/features/verification/components/OwnerVerificationBanner";

import type { SessionPayload } from "@/lib/auth/session-jwt";
import { requireSessionForDashboard } from "@/server/auth/session";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";
import { syncDashboardNotificationsForUser } from "@/server/services/dashboardNotificationSync.service";
import { countUnreadNotificationsForUser } from "@/server/services/notification.service";
import { hasValidPublishPassKey } from "@/server/services/passkey.service";
import { uiPublicMainOffset } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

const fallbackProfile = (session: SessionPayload): SidebarProfileData => {
  const local = session.email.split("@")[0]?.trim();
  return {
    name: local && local.length > 0 ? local : "Account",
    image: null,
    role: session.role,
    canCreateListings: session.role !== "user",
    ownerVerificationStatus: session.role === "user" ? "unsubmitted" : undefined,
  };
};

export default async function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireSessionForDashboard();
  await syncDashboardNotificationsForUser(session.sub);
  const unreadNotificationCount = await countUnreadNotificationsForUser(session.sub);
  const doc = await getUserSidebarProfileById(session.sub);
  const profile = doc ?? fallbackProfile(session);

  const showOwnerVerificationBanner =
    session.role === "user" && profile.canCreateListings === false;
  const showPassKeyPublishBanner =
    session.role === "user" &&
    profile.canCreateListings === true &&
    !(await hasValidPublishPassKey(session.sub));

  return (
    <SidebarProfileProvider value={profile}>
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar />
        <DashboardLayout
          className={cn(uiPublicMainOffset, "min-h-0 flex-1")}
          unreadNotificationCount={unreadNotificationCount}
          topSlot={
            showOwnerVerificationBanner ? (
              <OwnerVerificationBanner />
            ) : showPassKeyPublishBanner ? (
              <PassKeyPublishBanner />
            ) : undefined
          }
        >
          {children}
        </DashboardLayout>
      </div>
    </SidebarProfileProvider>
  );
}
