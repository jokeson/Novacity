"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { z } from "zod";

import { ROUTES } from "@/constants/routes";
import { getSession } from "@/server/auth/session";
import {
  findOwnerVerificationApplicationById,
  updateOwnerVerificationApplicationById,
} from "@/server/repositories/ownerVerification.repository";
import { updateUserById } from "@/server/repositories/user.repository";
import { sendOwnerVerificationApprovedEmail } from "@/features/verification/services/sendOwnerVerificationApprovedEmail";
import { getUserByIdLean } from "@/server/queries/user.queries";
import { sendNotification } from "@/server/services/notification.service";

type AdminOwnerVerificationMutation = { ok: false; message: string } | { ok: true };

const requireAdmin = async (): Promise<
  { ok: false; message: string } | { ok: true; adminId: string }
> => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "Only administrators can perform this action." };
  }
  return { ok: true, adminId: session.sub };
};

const idSchema = z.string().refine((v) => mongoose.Types.ObjectId.isValid(v), {
  message: "Invalid id.",
});

export const adminApproveOwnerVerificationAction = async (
  raw: unknown,
): Promise<AdminOwnerVerificationMutation> => {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = z.object({ applicationId: idSchema }).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const app = await findOwnerVerificationApplicationById(parsed.data.applicationId);
  if (!app || app.status !== "pending") {
    return { ok: false, message: "Application not found or already processed." };
  }

  const userId = String(app.userId);

  await updateOwnerVerificationApplicationById(parsed.data.applicationId, {
    status: "approved",
    rejectionReason: "",
  });

  await updateUserById(userId, {
    ownerVerificationStatus: "approved",
    ownerVerificationRejectionReason: "",
  });

  await sendNotification({
    userId: new mongoose.Types.ObjectId(userId),
    type: "verification",
    title: "Owner verification approved",
    message:
      "Congratulations — you are approved to join Novacity as a verified owner. Check your email for owner policies and start listing from the dashboard.",
  });

  const ownerDoc = await getUserByIdLean(userId);
  const ownerEmail =
    typeof (ownerDoc as { email?: string } | null)?.email === "string"
      ? (ownerDoc as { email: string }).email
      : "";
  const ownerName =
    app.fullName?.trim() ||
    (typeof (ownerDoc as { name?: string } | null)?.name === "string"
      ? (ownerDoc as { name: string }).name.trim()
      : "");

  if (ownerEmail) {
    const emailResult = await sendOwnerVerificationApprovedEmail({
      to: ownerEmail,
      ownerName,
    });
    if (!emailResult.sent && process.env.NODE_ENV === "development") {
      console.warn("[owner-verification] approval email not sent:", emailResult.reason);
    }
  }

  revalidatePath(ROUTES.adminOwnerVerifications);
  revalidatePath(ROUTES.admin);
  revalidatePath(ROUTES.dashboardVerification);
  revalidatePath(ROUTES.dashboard);
  revalidatePath(ROUTES.dashboardListingsCreate);
  return { ok: true };
};

export const adminRejectOwnerVerificationAction = async (
  raw: unknown,
): Promise<AdminOwnerVerificationMutation> => {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = z
    .object({
      applicationId: idSchema,
      reason: z.string().trim().min(3).max(2000),
    })
    .safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const app = await findOwnerVerificationApplicationById(parsed.data.applicationId);
  if (!app || app.status !== "pending") {
    return { ok: false, message: "Application not found or already processed." };
  }

  const userId = String(app.userId);

  await updateOwnerVerificationApplicationById(parsed.data.applicationId, {
    status: "rejected",
    rejectionReason: parsed.data.reason,
  });

  await updateUserById(userId, {
    ownerVerificationStatus: "rejected",
    ownerVerificationRejectionReason: parsed.data.reason,
  });

  await sendNotification({
    userId: new mongoose.Types.ObjectId(userId),
    type: "verification",
    title: "Owner verification rejected",
    message: `Your application was rejected. Reason: ${parsed.data.reason}. You may submit a new application from Verification.`,
  });

  revalidatePath(ROUTES.adminOwnerVerifications);
  revalidatePath(ROUTES.admin);
  revalidatePath(ROUTES.dashboardVerification);
  revalidatePath(ROUTES.dashboard);
  return { ok: true };
};
