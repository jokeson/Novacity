/**
 * Listing/hero images saved under /uploads/ exist only on the machine that uploaded them.
 * On Vercel, use Cloudinary (HTTPS) or fall back to a placeholder.
 */
export const resolvePublicImageUrl = (
  raw: string | undefined,
  fallback: string,
): string => {
  const value = raw?.trim() ?? "";
  if (!value) {
    return fallback;
  }
  if (value.startsWith("https://") || value.startsWith("http://")) {
    return value;
  }
  if (value.startsWith("/uploads/") && process.env.VERCEL === "1") {
    return fallback;
  }
  return value;
};
