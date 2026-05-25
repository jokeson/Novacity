"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { z } from "zod";

import { ROUTES } from "@/constants/routes";
import { getSession } from "@/server/auth/session";
import {
  countPropertiesByOwner,
  deletePropertyById,
  findPropertyById,
  updatePropertyById,
} from "@/server/repositories/property.repository";
import {
  countUsersByRole,
  deleteUserById,
  updateUserById,
} from "@/server/repositories/user.repository";
import { getUserByIdLean } from "@/server/queries/user.queries";
import type { UserRole } from "@/types/user";

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

export type AdminMutationError = { ok: false; message: string };
export type AdminMutationOk = { ok: true };

export const adminSuspendUserAction = async (
  raw: unknown,
): Promise<AdminMutationError | AdminMutationOk> => {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = z
    .object({
      userId: idSchema,
      suspend: z.boolean(),
    })
    .safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  if (parsed.data.userId === auth.adminId) {
    return { ok: false, message: "You cannot change suspension for your own account here." };
  }

  const updated = await updateUserById(parsed.data.userId, {
    suspendedAt: parsed.data.suspend ? new Date() : null,
  });

  if (!updated) {
    return { ok: false, message: "User not found." };
  }

  revalidatePath(ROUTES.adminUsers);
  revalidatePath(ROUTES.admin);
  return { ok: true };
};

export const adminDeleteUserAction = async (
  raw: unknown,
): Promise<AdminMutationError | AdminMutationOk> => {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = z.object({ userId: idSchema }).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const { userId } = parsed.data;

  if (userId === auth.adminId) {
    return { ok: false, message: "You cannot delete your own administrator account." };
  }

  const listingCount = await countPropertiesByOwner(userId);
  if (listingCount > 0) {
    return {
      ok: false,
      message: `This user still owns ${listingCount} listing(s). Remove or reassign them before deleting the account.`,
    };
  }

  const target = await getUserByIdLean(userId);
  if (!target) {
    return { ok: false, message: "User not found." };
  }

  const targetRole = target.role;
  if (targetRole === "admin") {
    const admins = await countUsersByRole("admin");
    if (admins <= 1) {
      return { ok: false, message: "Cannot delete the last admin account." };
    }
  }

  const removed = await deleteUserById(userId);
  if (!removed) {
    return { ok: false, message: "User could not be deleted." };
  }

  revalidatePath(ROUTES.adminUsers);
  revalidatePath(ROUTES.admin);
  return { ok: true };
};

export const adminTogglePropertyFeaturedAction = async (
  raw: unknown,
): Promise<AdminMutationError | AdminMutationOk> => {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = z.object({ propertyId: idSchema }).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const property = await findPropertyById(parsed.data.propertyId);
  if (!property) {
    return { ok: false, message: "Listing not found." };
  }

  const next = !property.isFeatured;
  const updated = await updatePropertyById(parsed.data.propertyId, {
    isFeatured: next,
  });

  if (!updated) {
    return { ok: false, message: "Could not update listing." };
  }

  revalidatePath(ROUTES.adminListings);
  revalidatePath(ROUTES.admin);
  revalidatePath(ROUTES.properties);
  revalidatePath(ROUTES.home);
  return { ok: true };
};

export const adminDeletePropertyAction = async (
  raw: unknown,
): Promise<AdminMutationError | AdminMutationOk> => {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = z.object({ propertyId: idSchema }).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const removed = await deletePropertyById(parsed.data.propertyId);
  if (!removed) {
    return { ok: false, message: "Listing not found or could not be deleted." };
  }

  revalidatePath(ROUTES.adminListings);
  revalidatePath(ROUTES.admin);
  revalidatePath(ROUTES.properties);
  revalidatePath(ROUTES.home);
  return { ok: true };
};

export const adminPromoteUserToCompanyAction = async (
  raw: unknown,
): Promise<AdminMutationError | AdminMutationOk> => {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = z.object({ userId: idSchema }).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const { userId } = parsed.data;

  if (userId === auth.adminId) {
    return { ok: false, message: "You cannot change your own role here." };
  }

  const target = await getUserByIdLean(userId);
  if (!target) {
    return { ok: false, message: "User not found." };
  }

  const suspended = (target as { suspendedAt?: Date | null }).suspendedAt;
  if (suspended != null) {
    return {
      ok: false,
      message: "Unsuspend the account before promoting it to company.",
    };
  }

  const targetRole = (target as { role?: UserRole }).role;
  if (targetRole !== "user") {
    return {
      ok: false,
      message: "Only individual (user) accounts can be promoted to company.",
    };
  }

  const updated = await updateUserById(userId, {
    role: "company",
    ownerVerificationStatus: "approved",
    ownerVerificationRejectionReason: "",
  });
  if (!updated) {
    return { ok: false, message: "User not found." };
  }

  revalidatePath(ROUTES.adminUsers);
  revalidatePath(ROUTES.admin);
  return { ok: true };
};
