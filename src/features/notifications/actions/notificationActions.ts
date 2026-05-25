"use server";

import { revalidatePath } from "next/cache";

import { ROUTES } from "@/constants/routes";
import { requireSessionForDashboard } from "@/server/auth/session";
import { markNotificationAsRead } from "@/server/services/notification.service";

export const markNotificationReadAction = async (
  notificationId: string,
): Promise<{ ok: true } | { ok: false; message: string }> => {
  const session = await requireSessionForDashboard();
  const updated = await markNotificationAsRead(notificationId, session.sub);
  if (!updated) {
    return { ok: false, message: "Notification not found." };
  }
  revalidatePath(ROUTES.dashboardNotifications);
  revalidatePath(ROUTES.dashboard);
  return { ok: true };
};
