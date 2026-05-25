"use server";

import { revalidatePath } from "next/cache";

import { ROUTES } from "@/constants/routes";
import { homeHeroUpsertSchema } from "@/features/home/validators/homeHeroSchema";
import { getSession } from "@/server/auth/session";
import { upsertHomeHeroConfig } from "@/server/repositories/homeHero.repository";

export type AdminHomeHeroMutationError = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type AdminHomeHeroMutationOk = { ok: true };

export const adminUpsertHomeHeroAction = async (
  raw: unknown,
): Promise<AdminHomeHeroMutationError | AdminHomeHeroMutationOk> => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "Only administrators can update the homepage hero." };
  }

  const parsed = homeHeroUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  try {
    await upsertHomeHeroConfig(parsed.data);
  } catch {
    return { ok: false, message: "Could not save hero settings. Try again." };
  }

  revalidatePath(ROUTES.home);
  revalidatePath(ROUTES.adminHomeHero);
  return { ok: true };
};
