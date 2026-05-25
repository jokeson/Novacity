export const PROPERTY_DEFAULTS = {
  pageSize: 12,
  maxImages: 24,
  /** Required photos when creating a listing from the dashboard. */
  createImageCount: 5,
  titleMaxLength: 120,
  descriptionMaxLength: 5000,
} as const;

export const PROPERTY_LABELS = {
  forSale: "For sale",
  forRent: "For rent",
  featured: "Featured",
} as const;
