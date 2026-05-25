"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { z, type ZodError } from "zod";

import { ROUTES } from "@/constants/routes";
import { isMongoDuplicateKeyError } from "@/features/auth/services/user.service";
import {
  adminPassKeyIssueSchema,
  passKeyRedeemSchema,
} from "@/features/passkeys/validators/passkeySchema";
import { roleCanAccessDashboard } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";
import { findUserByEmail } from "@/server/repositories/user.repository";
import {
  activatePassKey,
  computePassKeyExpiresAt,
  deactivatePassKey,
  deletePassKeyIfUnused,
  expirePassKeyImmediately,
  generatePassKeyCode,
  issuePassKey,
  normalizePassKeyCode,
  redeemPassKeyForUser,
  type RedeemPassKeyResult,
} from "@/server/services/passkey.service";

export type PassKeyMutationError = {
  ok: false;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const flattenFieldErrors = (error: ZodError): Record<string, string[]> => {
  return error.flatten().fieldErrors as Record<string, string[]>;
};

const redeemReasonMessage = (
  reason: Extract<RedeemPassKeyResult, { ok: false }>["reason"],
): string => {
  switch (reason) {
    case "not_found":
      return "No PassKey matches that code.";
    case "inactive":
      return "This PassKey has been deactivated.";
    case "expired":
      return "This PassKey has expired.";
    case "used":
      return "This PassKey was already used for a published listing.";
    case "wrong_user":
      return "This PassKey is assigned to another account.";
    case "redeem_failed":
      return "Could not attach this PassKey. It may have just been claimed.";
    default:
      return "PassKey could not be redeemed.";
  }
};

const requireAdminSession = async (): Promise<
  | { ok: false; response: PassKeyMutationError }
  | { ok: true }
> => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return {
      ok: false,
      response: { ok: false, message: "Only administrators can perform this action." },
    };
  }
  return { ok: true };
};

export const redeemPassKeyAction = async (
  raw: unknown,
): Promise<PassKeyMutationError | { ok: true; message: string }> => {
  const session = await getSession();
  if (!session || !roleCanAccessDashboard(session.role)) {
    return { ok: false, message: "You must be signed in to redeem a PassKey." };
  }

  const parsed = passKeyRedeemSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const result = await redeemPassKeyForUser(parsed.data.code, session.sub);
  if (!result.ok) {
    return { ok: false, message: redeemReasonMessage(result.reason) };
  }

  revalidatePath(ROUTES.dashboardPasskeys);
  revalidatePath(ROUTES.dashboardListings);
  revalidatePath(ROUTES.dashboard);

  return {
    ok: true,
    message: result.alreadyOwned
      ? "This PassKey is already on your account."
      : "PassKey added to your account.",
  };
};

export const adminIssuePassKeyAction = async (
  raw: unknown,
): Promise<
  | PassKeyMutationError
  | { ok: true; mode: "single"; code: string; assigneeEmail: string | null }
  | { ok: true; mode: "bulk"; codes: string[]; assigneeEmail: string | null }
> => {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }

  const parsed = adminPassKeyIssueSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const emailRaw = parsed.data.assignEmail.trim();
  let assigneeId: mongoose.Types.ObjectId | null = null;
  let assigneeEmail: string | null = null;

  if (emailRaw.length > 0) {
    if (!z.string().email().safeParse(emailRaw).success) {
      return { ok: false, message: "Enter a valid assignee email or leave it blank for a pool key." };
    }
    const user = await findUserByEmail(emailRaw.toLowerCase());
    if (!user) {
      return { ok: false, message: "No user exists with that email." };
    }
    assigneeId = user._id;
    assigneeEmail = typeof user.email === "string" ? user.email : null;
  }

  const duration = parsed.data.durationDays;
  const expiresAt = computePassKeyExpiresAt(duration);
  const quantity = parsed.data.quantity;

  if (quantity === 1) {
    const custom = parsed.data.customCode?.trim() ?? "";
    const code = custom.length > 0 ? custom : generatePassKeyCode();

    try {
      await issuePassKey({
        code,
        userId: assigneeId,
        duration,
        expiresAt,
      });
    } catch (error) {
      if (isMongoDuplicateKeyError(error)) {
        return {
          ok: false,
          message:
            "That PassKey code already exists. Leave custom code blank to auto-generate a unique code.",
        };
      }
      throw error;
    }

    revalidatePath(ROUTES.adminPasskeys);
    return {
      ok: true,
      mode: "single",
      code: code.trim().toUpperCase(),
      assigneeEmail,
    };
  }

  const codes: string[] = [];
  for (let i = 0; i < quantity; i += 1) {
    let inserted = false;
    for (let attempt = 0; attempt < 30 && !inserted; attempt += 1) {
      const code = generatePassKeyCode();
      try {
        await issuePassKey({
          code,
          userId: assigneeId,
          duration,
          expiresAt,
        });
        codes.push(normalizePassKeyCode(code));
        inserted = true;
      } catch (error) {
        if (!isMongoDuplicateKeyError(error)) {
          throw error;
        }
      }
    }
    if (!inserted) {
      return {
        ok: false,
        message: "Could not generate a unique PassKey after several attempts. Try again.",
      };
    }
  }

  revalidatePath(ROUTES.adminPasskeys);
  return {
    ok: true,
    mode: "bulk",
    codes,
    assigneeEmail,
  };
};

export const adminDeactivatePassKeyAction = async (
  id: string,
): Promise<PassKeyMutationError | { ok: true }> => {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid PassKey id." };
  }
  await deactivatePassKey(id);
  revalidatePath(ROUTES.adminPasskeys);
  return { ok: true };
};

export const adminActivatePassKeyAction = async (
  id: string,
): Promise<PassKeyMutationError | { ok: true }> => {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid PassKey id." };
  }
  await activatePassKey(id);
  revalidatePath(ROUTES.adminPasskeys);
  return { ok: true };
};

export const adminExpirePassKeyAction = async (
  id: string,
): Promise<PassKeyMutationError | { ok: true }> => {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid PassKey id." };
  }
  await expirePassKeyImmediately(id);
  revalidatePath(ROUTES.adminPasskeys);
  return { ok: true };
};

export const adminDeletePassKeyAction = async (
  id: string,
): Promise<PassKeyMutationError | { ok: true }> => {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid PassKey id." };
  }
  const result = await deletePassKeyIfUnused(id);
  if (!result.ok) {
    if (result.reason === "was_used") {
      return {
        ok: false,
        message: "Published listings consumed this key; it cannot be deleted.",
      };
    }
    return { ok: false, message: "PassKey not found." };
  }
  revalidatePath(ROUTES.adminPasskeys);
  return { ok: true };
};
