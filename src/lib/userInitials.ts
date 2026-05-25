/**
 * Two-letter initials for avatars (name first, then optional email fallback).
 */
export const userDisplayInitials = (name: string, emailFallback = ""): string => {
  const source =
    name.trim().length > 0 ? name.trim() : emailFallback.trim();
  if (!source) {
    return "?";
  }
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0]!.length >= 2) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase() || "?";
};
