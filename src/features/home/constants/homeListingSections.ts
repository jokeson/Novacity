import {
  HOMEPAGE_HOUSES_FOR_SALE_CARD_IMAGES,
  HOMEPAGE_HOUSES_FOR_SALE_LIMIT,
} from "@/constants/homepageHousesForSale";
import { ROUTES } from "@/constants/routes";
import type { HomeListingSectionConfig } from "@/features/home/types/homeListing";
import type { HomepageListingRail } from "@/server/queries/propertySearch.queries";

const catalogHref = (params: Record<string, string>): string => {
  const query = new URLSearchParams(params);
  return `${ROUTES.properties}?${query.toString()}`;
};

export const HOME_LISTING_SECTIONS: Record<
  HomepageListingRail,
  HomeListingSectionConfig
> = {
  featured: {
    rail: "featured",
    headingId: "featured-properties-heading",
    eyebrow: "Ownership",
    title: "Featured properties",
    description:
      "Outstanding homes and workspaces our team highlights — four curated picks; explore the rest in the marketplace.",
    tone: "gold",
    gridCols: 4,
    emptyTitle: "No featured properties yet",
    emptyDescription:
      "When listings are marked featured in admin, they will appear here automatically.",
    errorTitle: "Could not load featured properties",
    browseLabel: "Browse marketplace",
    browseHref: catalogHref({ featured: "1" }),
    footerMarketplaceLabel: "Learn more",
  },
  "for-sale": {
    rail: "for-sale",
    headingId: "houses-for-sale-heading",
    title: "Houses for sale",
    description:
      "The two most recently published for-sale listings on the platform.",
    tone: "white",
    layout: "split-promo",
    listingLimit: HOMEPAGE_HOUSES_FOR_SALE_LIMIT,
    cardImageSources: HOMEPAGE_HOUSES_FOR_SALE_CARD_IMAGES,
    promoImage: {
      src: "/images/home/houses-for-sale.png",
      alt: "Family smiling while moving into a new home with boxes at the doorway",
      overlayLines: [
        "A new home.",
        "A new beginning.",
        "Your future starts here.",
      ],
    },
    gridCols: 3,
    emptyTitle: "No houses for sale yet",
    emptyDescription:
      "When sellers publish for-sale listings, they will appear here automatically.",
    errorTitle: "Could not load listings",
    browseLabel: "Browse all properties",
    browseHref: catalogHref({ status: "for-sale" }),
    showListPropertyCtaOnEmpty: true,
  },
  "for-rent": {
    rail: "for-rent",
    headingId: "rentals-heading",
    eyebrow: "Tenants welcome",
    title: "Rental properties",
    description:
      "Flexible leases spanning urban studios to family-sized homes ready to tour.",
    tone: "linen",
    gridCols: 3,
    emptyTitle: "No rental properties yet",
    emptyDescription:
      "When sellers publish for-rent listings, they will appear here automatically.",
    errorTitle: "Could not load rental properties",
    browseLabel: "Browse rentals",
    browseHref: catalogHref({ status: "for-rent" }),
  },
  apartments: {
    rail: "apartments",
    headingId: "apartments-heading",
    eyebrow: "City living",
    title: "Apartments",
    description:
      "High-rise serenity, airy lofts, and quiet mid-rise corridors near daily essentials.",
    tone: "navy",
    gridCols: 3,
    emptyTitle: "No apartments yet",
    emptyDescription:
      "Apartment listings from verified sellers will show here as they are published.",
    errorTitle: "Could not load apartments",
    browseLabel: "Browse apartments",
    browseHref: catalogHref({ type: "apartment" }),
  },
  commercial: {
    rail: "commercial",
    headingId: "commercial-heading",
    eyebrow: "Work & invest",
    title: "Commercial buildings",
    description:
      "Scale-ready footprints for retail innovators, HQ teams, and mixed-use redevelopment.",
    tone: "stone",
    gridCols: 3,
    emptyTitle: "No commercial listings yet",
    emptyDescription:
      "Commercial properties will appear here once sellers publish them on the platform.",
    errorTitle: "Could not load commercial listings",
    browseLabel: "Browse commercial",
    browseHref: catalogHref({ type: "commercial" }),
  },
  latest: {
    rail: "latest",
    headingId: "latest-heading",
    eyebrow: "Fresh inventory",
    title: "Latest listings",
    description:
      "The newest arrivals across every category — synced here as sellers publish.",
    tone: "elevated",
    gridCols: 4,
    emptyTitle: "No listings yet",
    emptyDescription:
      "New properties will surface here automatically after they go live on Novacity.",
    errorTitle: "Could not load latest listings",
    browseLabel: "Browse marketplace",
    browseHref: ROUTES.properties,
  },
};

export const HOMEPAGE_LISTING_RAILS: HomepageListingRail[] = [
  "featured",
  "for-sale",
  "for-rent",
  "apartments",
  "commercial",
  "latest",
];
