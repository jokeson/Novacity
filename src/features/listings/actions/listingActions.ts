"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import {
  ROUTES,
  dashboardListingEditPath,
  propertyDetailPath,
} from "@/constants/routes";
import { isMongoDuplicateKeyError } from "@/features/auth/services/user.service";
import { ensurePublishEligibility } from "@/features/listings/services/listingPublishPolicy";
import { canManageListing } from "@/features/listings/services/listingAccess";
import { buildListingSlugCandidate } from "@/features/listings/utils/slug";
import { parseExpiresAtOrNull } from "@/features/listings/utils/expiration";
import { resolveListingAreaForStorage } from "@/features/listings/utils/listingArea";
import { shouldConsumePassKeyOnPublish } from "@/features/listings/utils/publishRules";
import {
  isOwnerVerificationApprovedForListings,
  listingVerificationRequiredMessage,
} from "@/features/verification/services/listingAccessVerification";
import { createListingFormSchema, listingFormSchema } from "@/features/listings/validators/listingSchema";
import { roleCanAccessDashboard } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";
import { getUserByIdLean } from "@/server/queries/user.queries";
import {
  createProperty,
  deletePropertyById,
  findPropertyById,
  findPropertyBySlug,
  updatePropertyById,
} from "@/server/repositories/property.repository";
import { consumePassKeyAfterPublish } from "@/server/services/passkey.service";
import { sendNotification } from "@/server/services/notification.service";
import type { ListingSource, PropertyStatus } from "@/types/property";
import type { UserRole } from "@/types/user";

export type ListingMutationError = {
  ok: false;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const flattenFieldErrors = (error: ZodError): Record<string, string[]> => {
  return error.flatten().fieldErrors as Record<string, string[]>;
};

const requireDashboardSession = async (): Promise<
  | { ok: false; response: ListingMutationError }
  | { ok: true; sub: string; role: UserRole }
> => {
  const session = await getSession();
  if (!session || !roleCanAccessDashboard(session.role)) {
    return {
      ok: false,
      response: { ok: false, message: "You must be signed in to manage listings." },
    };
  }

  return { ok: true, sub: session.sub, role: session.role };
};

/** Listing source is derived from the authenticated role (no manual “channel”). */
const resolveListingSourceAndCompanyId = (
  role: UserRole,
  sub: string,
): { listingSource: ListingSource; companyId: mongoose.Types.ObjectId | null } => {
  if (role === "company") {
    return {
      listingSource: "novacity",
      companyId: new mongoose.Types.ObjectId(sub),
    };
  }
  if (role === "admin") {
    return { listingSource: "novacity", companyId: null };
  }
  return { listingSource: "owner", companyId: null };
};

const pickUniqueSlug = async (title: string): Promise<string> => {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate =
      attempt === 0
        ? buildListingSlugCandidate(title)
        : buildListingSlugCandidate(`${title}-${attempt}`);
    const existing = await findPropertyBySlug(candidate);
    if (!existing) {
      return candidate;
    }
  }
  return buildListingSlugCandidate(`${title}-${Date.now()}`);
};

export const createListingAction = async (
  raw: unknown,
): Promise<ListingMutationError | { ok: true }> => {
  const auth = await requireDashboardSession();
  if (!auth.ok) {
    return auth.response;
  }

  const userDoc = await getUserByIdLean(auth.sub);
  const ov = (userDoc as { ownerVerificationStatus?: string } | null)?.ownerVerificationStatus;
  if (!isOwnerVerificationApprovedForListings(auth.role, ov)) {
    return { ok: false, message: listingVerificationRequiredMessage };
  }

  const parsed = createListingFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const publishCheck = await ensurePublishEligibility(
    auth.sub,
    auth.role,
    parsed.data.status,
  );
  if (!publishCheck.ok) {
    return { ok: false, message: publishCheck.message };
  }

  const ownerId = new mongoose.Types.ObjectId(auth.sub);
  const { listingSource, companyId } = resolveListingSourceAndCompanyId(
    auth.role,
    auth.sub,
  );

  const expiresAt = parseExpiresAtOrNull(parsed.data.status, parsed.data.expiresAt);
  const area = resolveListingAreaForStorage(parsed.data.status, parsed.data);

  const slug = await pickUniqueSlug(parsed.data.title);

  try {
    await createProperty({
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      propertyType: parsed.data.propertyType,
      listingSource,
      currency: parsed.data.currency,
      pricingType: parsed.data.pricingType,
      price: parsed.data.price,
      state: parsed.data.state,
      location: parsed.data.location,
      address: parsed.data.address,
      phone: parsed.data.phone,
      images: parsed.data.images,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      areaWidthM: area.areaWidthM,
      areaLengthM: area.areaLengthM,
      areaSqM: area.areaSqM,
      status: parsed.data.status,
      ownerId,
      companyId,
      expiresAt,
    });
  } catch (error) {
    if (isMongoDuplicateKeyError(error)) {
      return {
        ok: false,
        message: "Slug collision — try a slightly different title.",
      };
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const first = Object.values(error.errors)[0]?.message;
      return {
        ok: false,
        message:
          first ??
          "Listing could not be saved. Refresh the page if you just deployed a schema update.",
      };
    }
    throw error;
  }

  if (
    shouldConsumePassKeyOnPublish(auth.role, undefined, parsed.data.status)
  ) {
    await consumePassKeyAfterPublish(auth.sub);
  }

  revalidatePath(ROUTES.dashboardListings);
  revalidatePath(ROUTES.properties);
  revalidatePath(ROUTES.home);
  redirect(ROUTES.dashboardListings);
};

export const updateListingAction = async (
  listingId: string,
  raw: unknown,
): Promise<ListingMutationError | { ok: true }> => {
  const auth = await requireDashboardSession();
  if (!auth.ok) {
    return auth.response;
  }

  const parsed = listingFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const existing = await findPropertyById(listingId);
  if (!existing) {
    return { ok: false, message: "Listing not found." };
  }

  if (!canManageListing(existing.ownerId, auth.sub, auth.role)) {
    return { ok: false, message: "You cannot edit this listing." };
  }

  const userDoc = await getUserByIdLean(auth.sub);
  const ov = (userDoc as { ownerVerificationStatus?: string } | null)?.ownerVerificationStatus;
  if (
    auth.role === "user" &&
    !isOwnerVerificationApprovedForListings(auth.role, ov) &&
    (parsed.data.status !== "draft" || (existing.status as PropertyStatus) !== "draft")
  ) {
    return { ok: false, message: listingVerificationRequiredMessage };
  }

  const publishCheck = await ensurePublishEligibility(
    auth.sub,
    auth.role,
    parsed.data.status,
  );
  if (!publishCheck.ok) {
    return { ok: false, message: publishCheck.message };
  }

  const expiresAt = parseExpiresAtOrNull(parsed.data.status, parsed.data.expiresAt);
  const area = resolveListingAreaForStorage(parsed.data.status, parsed.data);

  const updated = await updatePropertyById(listingId, {
    title: parsed.data.title,
    description: parsed.data.description,
    propertyType: parsed.data.propertyType,
    pricingType: parsed.data.pricingType,
    price: parsed.data.price,
    currency: parsed.data.currency,
    state: parsed.data.state,
    location: parsed.data.location,
    address: parsed.data.address,
    phone: parsed.data.phone,
    images: parsed.data.images,
    bedrooms: parsed.data.bedrooms,
    bathrooms: parsed.data.bathrooms,
    areaWidthM: area.areaWidthM,
    areaLengthM: area.areaLengthM,
    areaSqM: area.areaSqM,
    status: parsed.data.status,
    expiresAt,
  });

  if (!updated) {
    return { ok: false, message: "Could not update listing." };
  }

  if (
    shouldConsumePassKeyOnPublish(
      auth.role,
      existing.status as PropertyStatus,
      parsed.data.status,
    )
  ) {
    await consumePassKeyAfterPublish(auth.sub);
  }

  const previousStatus = existing.status as PropertyStatus;
  const nextStatus = parsed.data.status;
  if (previousStatus !== nextStatus) {
    const ownerId = existing.ownerId as mongoose.Types.ObjectId;
    const propertyObjectId = new mongoose.Types.ObjectId(listingId);
    let title = "Listing status updated";
    let message = `“${parsed.data.title}” changed from ${previousStatus} to ${nextStatus}.`;
    if (nextStatus === "sold") {
      title = "Property marked sold";
      message = `“${parsed.data.title}” is now marked as sold. Congratulations on closing this listing.`;
    } else if (nextStatus === "rented") {
      title = "Property marked rented";
      message = `“${parsed.data.title}” is now marked as rented.`;
    }
    await sendNotification({
      userId: ownerId,
      type: "listing",
      title,
      message,
      relatedPropertyId: propertyObjectId,
    });
    revalidatePath(ROUTES.dashboardNotifications);
    revalidatePath(ROUTES.dashboard);
  }

  revalidatePath(ROUTES.dashboardListings);
  revalidatePath(ROUTES.properties);
  revalidatePath(ROUTES.home);
  revalidatePath(dashboardListingEditPath(listingId));
  if (typeof existing.slug === "string" && existing.slug) {
    revalidatePath(propertyDetailPath(existing.slug));
  }
  return { ok: true };
};

export const deleteListingAction = async (
  listingId: string,
): Promise<ListingMutationError | { ok: true }> => {
  const auth = await requireDashboardSession();
  if (!auth.ok) {
    return auth.response;
  }

  const existing = await findPropertyById(listingId);
  if (!existing) {
    return { ok: false, message: "Listing not found." };
  }

  if (!canManageListing(existing.ownerId, auth.sub, auth.role)) {
    return { ok: false, message: "You cannot delete this listing." };
  }

  const removed = await deletePropertyById(listingId);
  if (!removed) {
    return { ok: false, message: "Could not delete listing." };
  }

  revalidatePath(ROUTES.dashboardListings);
  revalidatePath(ROUTES.properties);
  revalidatePath(ROUTES.home);
  return { ok: true };
};
