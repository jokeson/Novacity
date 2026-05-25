import type { HomepageListingRail } from "@/server/queries/propertySearch.queries";

/** Visual band for a homepage listing section (background + divider + card contrast). */
export type HomeListingSectionTone =
  | "gold"
  | "white"
  | "linen"
  | "navy"
  | "stone"
  | "elevated"
  | "compass"
  | "heritage";

export type HomeListingPromoImage = {
  src: string;
  alt: string;
  /** Short lines rendered over the promo image (e.g. marketing taglines). */
  overlayLines?: string[];
};

export type HomeListingSectionLayout = "grid" | "split-promo";

export type HomeListingSectionConfig = {
  rail: HomepageListingRail;
  headingId: string;
  eyebrow?: string;
  title: string;
  description: string;
  tone: HomeListingSectionTone;
  layout?: HomeListingSectionLayout;
  /** Lifestyle / category image; with `split-promo`, uses 70% width beside listings. */
  promoImage?: HomeListingPromoImage;
  gridCols: 3 | 4;
  /** Max listing cards shown in this section (defaults to all fetched items). */
  listingLimit?: number;
  /** When set, card thumbnails use these paths instead of listing photos. */
  cardImageSources?: readonly string[];
  emptyTitle: string;
  emptyDescription: string;
  errorTitle: string;
  browseLabel: string;
  browseHref: string;
  /** When set, show a footer link to the marketplace when the section has listings. */
  footerMarketplaceLabel?: string;
  showListPropertyCtaOnEmpty?: boolean;
};
