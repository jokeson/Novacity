/** Inquiry lifecycle for property leads (server / UI). */
export type InterestedClientStatus =
  | "new"
  | "contacted"
  | "closed"
  | "archived";

/** In-app notification categories. */
export type NotificationType =
  | "system"
  | "listing"
  | "expiration"
  | "interest"
  | "message"
  | "verification";
