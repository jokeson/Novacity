import { Navbar } from "@/components/shared/navigation/Navbar";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import {
  SidebarProfileProvider,
  type SidebarProfileData,
} from "@/components/shared/SidebarProfileContext";

import type { SessionPayload } from "@/lib/auth/session-jwt";
import { requireSessionForAdmin } from "@/server/auth/session";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";
import { uiPublicMainOffset } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

const fallbackProfile = (session: SessionPayload): SidebarProfileData => {
  const local = session.email.split("@")[0]?.trim();
  return {
    name: local && local.length > 0 ? local : "Account",
    image: null,
    role: session.role,
    canCreateListings: true,
  };
};

export default async function AdminGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireSessionForAdmin();
  const doc = await getUserSidebarProfileById(session.sub);
  const profile = doc ?? fallbackProfile(session);

  return (
    <SidebarProfileProvider value={profile}>
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar />
        <AdminLayout className={cn(uiPublicMainOffset, "min-h-0 flex-1")}>{children}</AdminLayout>
      </div>
    </SidebarProfileProvider>
  );
}
