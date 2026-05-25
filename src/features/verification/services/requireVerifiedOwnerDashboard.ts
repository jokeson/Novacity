import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import type { SessionPayload } from "@/lib/auth/session-jwt";
import { requireSessionForDashboard } from "@/server/auth/session";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";

/**
 * Redirects unapproved `user` accounts to owner verification before dashboard marketplace tools.
 * Admin and company roles bypass this guard.
 */
export const requireVerifiedOwnerForDashboard = async (): Promise<SessionPayload> => {
  const session = await requireSessionForDashboard();
  if (session.role !== "user") {
    return session;
  }

  const profile = await getUserSidebarProfileById(session.sub);
  if (profile?.canCreateListings) {
    return session;
  }

  redirect(ROUTES.dashboardVerification);
};
