export type PropertyStatus =
  | "draft"
  | "for-sale"
  | "for-rent"
  | "sold"
  | "rented"
  | "featured"
  | "new-listing";

/** Who presents the listing publicly (set server-side; replaces manual “listing channel”). */
export type ListingSource = "owner" | "novacity";

export type ListingCurrency = "SSP" | "USD";

export type PricingType = "fixed" | "negotiable";

export type PropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial"
  | "rental";
