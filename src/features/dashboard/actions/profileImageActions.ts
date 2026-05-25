"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { revalidatePath } from "next/cache";

import { bufferMatchesDeclaredImageType } from "@/lib/image-magic-bytes";
import { isCloudinaryConfigured, uploadProfileImageBuffer } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSession } from "@/server/auth/session";
import { updateUserById } from "@/server/repositories/user.repository";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

const sanitizeBaseName = (name: string): string => {
  const base = name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
  return base.length > 0 ? base : "upload";
};

export type SaveProfileImageResult =
  | { ok: true; imageUrl: string }
  | { ok: false; error: string };

export const saveProfileImageAction = async (
  formData: FormData,
): Promise<SaveProfileImageResult> => {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "You must be signed in to update your profile photo." };
  }

  const rate = checkRateLimit(`profile-image:${session.sub}`, 20, 60_000);
  if (!rate.ok) {
    return { ok: false, error: "Too many uploads. Try again in a minute." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No image file was provided." };
  }

  if (!ALLOWED.has(file.type)) {
    return {
      ok: false,
      error: "Unsupported file type. Use PNG, JPG, JPEG, or WebP.",
    };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image is too large (maximum 5 MB)." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!bufferMatchesDeclaredImageType(buffer, file.type)) {
    return {
      ok: false,
      error: "File content does not match an allowed image type.",
    };
  }

  let imageUrl: string;

  if (isCloudinaryConfigured()) {
    try {
      const { url } = await uploadProfileImageBuffer(buffer, session.sub);
      imageUrl = url;
    } catch (err) {
      console.error("[profile-image] Cloudinary upload failed:", err);
      return {
        ok: false,
        error: "Image upload failed. Try again or contact support.",
      };
    }
  } else if (process.env.VERCEL === "1") {
    return {
      ok: false,
      error:
        "Profile photos require Cloudinary in production. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL).",
    };
  } else {
    const ext =
      file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
    const dir = join(process.cwd(), "public", "uploads", "profiles", session.sub);
    await mkdir(dir, { recursive: true });
    const filename = `${Date.now()}-${sanitizeBaseName(file.name)}${ext}`;
    const absolutePath = join(dir, filename);
    await writeFile(absolutePath, buffer);
    imageUrl = `/uploads/profiles/${session.sub}/${filename}`;
  }

  const updated = await updateUserById(session.sub, { image: imageUrl });
  if (!updated) {
    return { ok: false, error: "Could not save your profile. Try again." };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");

  return { ok: true, imageUrl };
};
