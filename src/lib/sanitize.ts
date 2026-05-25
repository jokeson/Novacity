/**
 * Strips angle brackets to reduce HTML/script injection in plain-text fields.
 * Prefer alongside Zod max lengths and server-side validation.
 */
export const sanitizePlainText = (value: string): string =>
  value.trim().replace(/[<>]/g, "");
