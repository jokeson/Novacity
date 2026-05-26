"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import type { ZodError } from "zod";

import { ROUTES } from "@/constants/routes";
import { formatPersonName } from "@/lib/formatPersonName";
import { roleCanAccessDashboard } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";
import { getUserByIdLean } from "@/server/queries/user.queries";
import {
  createOwnerVerificationApplication,
  findPendingApplicationByUserId,
} from "@/server/repositories/ownerVerification.repository";
import { listAdminUserIds, updateUserById } from "@/server/repositories/user.repository";
import { sendNotification } from "@/server/services/notification.service";
import type { UserRole } from "@/types/user";

import {
  ownerVerificationSubmitSchema,
  type OwnerVerificationSubmitInput,
} from "../validators/ownerVerificationSubmitSchema";

export type OwnerVerificationMutationError = {
  ok: false;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const flattenFieldErrors = (error: ZodError): Record<string, string[]> => {
  return error.flatten().fieldErrors as Record<string, string[]>;
};

const requireUserSession = async (): Promise<
  | { ok: false; response: OwnerVerificationMutationError }
  | { ok: true; sub: string; role: UserRole }
> => {
  const session = await getSession();
  if (!session || !roleCanAccessDashboard(session.role)) {
    return {
      ok: false,
      response: { ok: false, message: "You must be signed in." },
    };
  }
  return { ok: true, sub: session.sub, role: session.role };
};

export const submitOwnerVerificationApplicationAction = async (
  raw: unknown,
): Promise<OwnerVerificationMutationError | { ok: true }> => {
  const auth = await requireUserSession();
  if (!auth.ok) {
    return auth.response;
  }

  if (auth.role !== "user") {
    return {
      ok: false,
      message: "Owner verification applies to individual accounts only.",
    };
  }

  const user = await getUserByIdLean(auth.sub);
  if (!user) {
    return { ok: false, message: "Account not found." };
  }

  const status = (user as { ownerVerificationStatus?: string }).ownerVerificationStatus;
  if (status === "approved") {
    return { ok: false, message: "Your account is already verified." };
  }
  if (status === "pending") {
    const pending = await findPendingApplicationByUserId(auth.sub);
    if (pending) {
      return {
        ok: false,
        message: "Your application is already pending review.",
      };
    }
  }

  const parsed = ownerVerificationSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const data: OwnerVerificationSubmitInput = parsed.data;

  if (data.applicantNationality === "south-sudanese") {
    if (data.idDocumentType === "passport") {
      return {
        ok: false,
        fieldErrors: {
          idDocumentType: ["South Sudanese applicants must use National ID or Driver license."],
        },
      };
    }
  } else if (data.idDocumentType !== "passport") {
    return {
      ok: false,
      fieldErrors: {
        idDocumentType: ["International applicants must upload a passport."],
      },
    };
  }

  await createOwnerVerificationApplication({
    userId: new mongoose.Types.ObjectId(auth.sub),
    fullName: formatPersonName(data.fullName),
    phone: data.phone,
    residentialAddress: data.residentialAddress,
    postingState: data.postingState,
    applicantNationality: data.applicantNationality,
    idDocumentType: data.idDocumentType,
    idDocumentUrl: data.idDocumentUrl,
  });

  await updateUserById(auth.sub, {
    ownerVerificationStatus: "pending",
    ownerVerificationRejectionReason: "",
  });

  const adminIds = await listAdminUserIds();
  for (const adminId of adminIds) {
    await sendNotification({
      userId: adminId,
      type: "verification",
      title: "New owner verification application",
      message: `A user submitted owner verification and is awaiting review. Open Admin → Owner verifications.`,
    });
  }

  await sendNotification({
    userId: new mongoose.Types.ObjectId(auth.sub),
    type: "verification",
    title: "Application submitted",
    message:
      "Your owner verification application was submitted and is awaiting admin approval. You will be notified when it is reviewed.",
  });

  revalidatePath(ROUTES.dashboardVerification);
  revalidatePath(ROUTES.dashboard);
  revalidatePath(ROUTES.adminOwnerVerifications);
  return { ok: true };
};
