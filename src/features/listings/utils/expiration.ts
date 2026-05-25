const DEFAULT_PUBLISH_TTL_DAYS = 30;

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const defaultPublishExpiresAt = (): Date =>
  addDays(new Date(), DEFAULT_PUBLISH_TTL_DAYS);

export const toDateTimeLocalValue = (input: Date | string): string => {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(+d)) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const defaultExpiresAtInputValue = (): string =>
  toDateTimeLocalValue(defaultPublishExpiresAt());

export const parseExpiresAtOrNull = (
  status: string,
  raw: string | undefined,
): Date | null => {
  if (status === "draft") {
    return null;
  }
  if (!raw?.trim()) {
    return defaultPublishExpiresAt();
  }
  const d = new Date(raw);
  if (Number.isNaN(+d)) {
    return defaultPublishExpiresAt();
  }
  return d;
};
