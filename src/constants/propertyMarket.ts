import type { PropertyStatus } from "@/types/property";

/** Statuses visible on public marketing / discovery (never drafts or sold/rented). */
export const MARKETING_PROPERTY_STATUSES: PropertyStatus[] = [
  "for-sale",
  "for-rent",
  "featured",
  "new-listing",
];
