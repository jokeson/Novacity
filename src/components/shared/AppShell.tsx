import type { ReactNode } from "react";

import { AppShellClient } from "@/components/shared/AppShellClient";
import { Navbar } from "@/components/shared/navigation/Navbar";
import { resolveAppShellVariant, shouldShowAppNavbar } from "@/lib/app-shell-routes";
import { getRequestPathname } from "@/lib/app-shell.server";
import { sidebarProfileFromSession } from "@/lib/sidebar-profile-fallback";
import { getSession } from "@/server/auth/session";
import { roleCanAccessAdmin, roleCanAccessDashboard } from "@/server/auth/permissions";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";
import { countUnreadNotificationsForUser } from "@/server/services/notification.service";

export type AppShellProps = {
  children: ReactNode;
};

export const AppShell = async ({ children }: AppShellProps) => {
  const pathname = await getRequestPathname();
  const variant = resolveAppShellVariant(pathname);
  const showNavbar = shouldShowAppNavbar(variant);

  const session = await getSession();
  let dashboardProfile = null;
  let adminProfile = null;
  let unreadNotificationCount = 0;

  if (session && roleCanAccessDashboard(session.role)) {
    const doc = await getUserSidebarProfileById(session.sub);
    dashboardProfile = doc ?? sidebarProfileFromSession(session);
    unreadNotificationCount = await countUnreadNotificationsForUser(session.sub);
  }

  if (session && roleCanAccessAdmin(session.role)) {
    const doc = await getUserSidebarProfileById(session.sub);
    adminProfile = doc ?? sidebarProfileFromSession(session, { forAdmin: true });
  }

  return (
    <>
      {showNavbar ? <Navbar /> : null}
      <AppShellClient
        dashboardProfile={dashboardProfile}
        adminProfile={adminProfile}
        unreadNotificationCount={unreadNotificationCount}
      >
        {children}
      </AppShellClient>
    </>
  );
};
