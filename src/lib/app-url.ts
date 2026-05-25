/**
 * Canonical site origin for metadata, sitemap, robots, and emails.
 * Prefer NEXT_PUBLIC_APP_URL in production; fall back to Vercel's auto URL for previews.
 */
const normalizeOrigin = (raw: string): string =>
  raw.trim().replace(/[;,]+$/, "").replace(/\/$/, "");

export const getAppBaseUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    return normalizeOrigin(configured);
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${normalizeOrigin(vercelHost)}`;
  }

  return "http://localhost:3000";
};
