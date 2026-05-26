import { z } from "zod";

const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "plus.unsplash.com",
  "res.cloudinary.com",
]);

export const isAllowedHeroImageUrl = (raw: string): boolean => {
  const value = raw.trim();
  if (!value) {
    return false;
  }
  if (value.startsWith("/uploads/")) {
    if (process.env.VERCEL === "1") {
      return false;
    }
    return !value.includes("..");
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return false;
    }
    return ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};

export const homeHeroUpsertSchema = z.object({
  eyebrow: z.string().trim().max(120),
  heading: z.string().trim().min(1, "Heading is required.").max(200),
  body: z.string().trim().min(1, "Supporting text is required.").max(900),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Hero image URL is required.")
    .refine(isAllowedHeroImageUrl, {
      message:
        "Use HTTPS from Unsplash or Cloudinary, or an uploaded path starting with /uploads/.",
    }),
  imageAlt: z.string().trim().min(1, "Image alt text is required.").max(220),
});

export type HomeHeroUpsertInput = z.infer<typeof homeHeroUpsertSchema>;
