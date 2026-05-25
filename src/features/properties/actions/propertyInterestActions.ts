"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import type { ZodError } from "zod";

import { ROUTES, propertyDetailPath } from "@/constants/routes";
import { propertyInterestSchema } from "@/features/properties/validators/propertyInterestSchema";
import { sanitizePlainText } from "@/lib/sanitize";
import { getMarketingPropertyBySlug } from "@/server/queries/propertySearch.queries";
import { createInterestedClient } from "@/server/repositories/interestedClient.repository";
import { sendNotification } from "@/server/services/notification.service";

export type InterestMutationError = {
  ok: false;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const flattenFieldErrors = (error: ZodError): Record<string, string[]> => {
  return error.flatten().fieldErrors as Record<string, string[]>;
};

export const submitPropertyInterestAction = async (
  slug: string,
  raw: unknown,
): Promise<InterestMutationError | { ok: true }> => {
  const parsed = propertyInterestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const property = await getMarketingPropertyBySlug(slug);
  if (!property) {
    return { ok: false, message: "This listing is not available." };
  }

  if (String(property._id) !== parsed.data.propertyId) {
    return { ok: false, message: "Listing mismatch." };
  }

  if (String(property.ownerId) !== parsed.data.ownerId) {
    return { ok: false, message: "Listing mismatch." };
  }

  const name = sanitizePlainText(parsed.data.name);
  const message = sanitizePlainText(parsed.data.message);
  const email = parsed.data.email.trim();

  await createInterestedClient({
    propertyId: new mongoose.Types.ObjectId(parsed.data.propertyId),
    ownerId: new mongoose.Types.ObjectId(parsed.data.ownerId),
    name,
    email,
    phone: parsed.data.phone,
    message,
    status: "new",
  });

  await sendNotification({
    userId: new mongoose.Types.ObjectId(parsed.data.ownerId),
    type: "interest",
    title: "New property inquiry",
    message: `A visitor expressed interest in “${property.title}”. Open your dashboard to review the inquiry details.`,
    relatedPropertyId: new mongoose.Types.ObjectId(parsed.data.propertyId),
  });

  revalidatePath(propertyDetailPath(slug));
  revalidatePath(ROUTES.dashboard);
  revalidatePath(ROUTES.dashboardNotifications);
  return { ok: true };
};
