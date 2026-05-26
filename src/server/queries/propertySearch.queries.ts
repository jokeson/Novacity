import mongoose from "mongoose";

import { HOMEPAGE_HOUSES_FOR_SALE_LIMIT } from "@/constants/homepageHousesForSale";
import { MARKETING_PROPERTY_STATUSES } from "@/constants/propertyMarket";
import type { PropertySearchParams } from "@/features/search/validators/propertySearchParams";
import { escapeRegex } from "@/features/search/utils/escapeRegex";
import { groupListingsByState } from "@/features/search/utils/groupListingsByState";
import type { StateListingGroup } from "@/features/search/utils/groupListingsByState";
import { stateSlugFromLabel } from "@/features/search/utils/stateSlug";
import { connectDB } from "@/server/db/connect";
import { PropertyModel, type PropertyDoc } from "@/server/models/Property";
import type { ListingCurrency, ListingSource } from "@/types/property";

export type PublicPropertyListItem = {
  slug: string;
  title: string;
  price: number;
  currency: ListingCurrency;
  pricingType: PropertyDoc["pricingType"];
  status: PropertyDoc["status"];
  propertyType: PropertyDoc["propertyType"];
  listingSource: ListingSource;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  state: string;
  location: string;
  address: string;
  createdAt: Date;
};

const toListItem = (
  doc: PropertyDoc & { _id: mongoose.Types.ObjectId },
): PublicPropertyListItem => ({
  slug: doc.slug,
  title: doc.title,
  price: doc.price,
  currency: (doc.currency as ListingCurrency | undefined) ?? "USD",
  pricingType: doc.pricingType,
  status: doc.status,
  propertyType: doc.propertyType,
  listingSource: (doc.listingSource as ListingSource | undefined) ?? "owner",
  bedrooms: doc.bedrooms ?? 0,
  bathrooms: doc.bathrooms ?? 0,
  images: doc.images ?? [],
  state: doc.state ?? "",
  location: doc.location ?? "",
  address: doc.address ?? "",
  createdAt:
    "createdAt" in doc && doc.createdAt instanceof Date
      ? doc.createdAt
      : new Date(),
});

export const searchPublicProperties = async (
  params: PropertySearchParams,
): Promise<{ items: PublicPropertyListItem[]; total: number }> => {
  await connectDB();

  const filter: Record<string, unknown> = {};

  if (params.featured) {
    filter.isFeatured = true;
    filter.status = { $in: MARKETING_PROPERTY_STATUSES };
  } else if (params.status === "all") {
    filter.status = { $in: MARKETING_PROPERTY_STATUSES };
  } else {
    filter.status = params.status;
  }

  if (params.type) {
    filter.propertyType = params.type;
  }

  if (params.listingSource !== "all") {
    filter.listingSource = params.listingSource;
  }

  if (params.pricingType !== "all") {
    filter.pricingType = params.pricingType;
  }

  const priceRange: { $gte?: number; $lte?: number } = {};
  if (params.minPrice !== undefined) {
    priceRange.$gte = params.minPrice;
  }
  if (params.maxPrice !== undefined) {
    priceRange.$lte = params.maxPrice;
  }
  if (Object.keys(priceRange).length > 0) {
    filter.price = priceRange;
  }

  if (params.minBeds !== undefined) {
    filter.bedrooms = { $gte: params.minBeds };
  }

  if (params.minBaths !== undefined) {
    filter.bathrooms = { $gte: params.minBaths };
  }

  const stateTrimmed = params.state?.trim();
  if (stateTrimmed) {
    filter.state = new RegExp(`^${escapeRegex(stateTrimmed)}$`, "i");
  }

  const textClauses: Record<string, unknown>[] = [];

  if (params.q) {
    const rx = new RegExp(escapeRegex(params.q), "i");
    textClauses.push({
      $or: [
        { title: rx },
        { description: rx },
        { location: rx },
        { address: rx },
      ],
    });
  }

  if (params.location) {
    const rx = new RegExp(escapeRegex(params.location), "i");
    textClauses.push({
      $or: [{ location: rx }, { address: rx }],
    });
  }

  if (textClauses.length === 1) {
    Object.assign(filter, textClauses[0]);
  } else if (textClauses.length > 1) {
    filter.$and = textClauses;
  }

  const sort: Record<string, 1 | -1> =
    params.sort === "price-asc"
      ? { price: 1 }
      : params.sort === "price-desc"
        ? { price: -1 }
        : { createdAt: -1 };

  const skip = (params.page - 1) * params.pageSize;

  const listProjection =
    "slug title price currency pricingType status propertyType listingSource bedrooms bathrooms images state location address createdAt";

  const [rawItems, total] = await Promise.all([
    PropertyModel.find(filter)
      .select(listProjection)
      .sort(sort)
      .skip(skip)
      .limit(params.pageSize)
      .lean(),
    PropertyModel.countDocuments(filter),
  ]);

  const items = rawItems.map((doc) =>
    toListItem(doc as PropertyDoc & { _id: mongoose.Types.ObjectId }),
  );

  return { items, total };
};

/** Max listings loaded for the navbar **Listings** browse-all (grouped by state). */
const CATALOG_GROUPED_LISTINGS_LIMIT = 500;

const catalogListProjection =
  "slug title price currency pricingType status propertyType listingSource bedrooms bathrooms images state location address createdAt";

/**
 * All published listings for the default marketplace view, grouped by `Property.state`.
 */
export const listPublicPropertiesGroupedByState = async (): Promise<{
  groups: StateListingGroup[];
  total: number;
}> => {
  await connectDB();

  const filter = { status: { $in: MARKETING_PROPERTY_STATUSES } };

  const [rawItems, total] = await Promise.all([
    PropertyModel.find(filter)
      .select(catalogListProjection)
      .sort({ state: 1, createdAt: -1 })
      .limit(CATALOG_GROUPED_LISTINGS_LIMIT)
      .lean(),
    PropertyModel.countDocuments(filter),
  ]);

  const items = rawItems.map((doc) =>
    toListItem(doc as PropertyDoc & { _id: mongoose.Types.ObjectId }),
  );

  return { groups: groupListingsByState(items), total };
};

const HOMEPAGE_LISTING_LIMIT = 6;

/** Homepage featured / ownership band — max cards before marketplace link. */
export const HOMEPAGE_FEATURED_LIMIT = 4;

const homepageListProjection =
  "slug title price currency pricingType status propertyType listingSource bedrooms bathrooms images state location address createdAt";

export type HomepageListingRail =
  | "featured"
  | "for-sale"
  | "for-rent"
  | "apartments"
  | "commercial"
  | "latest";

const HOMEPAGE_RAIL_LIMITS: Record<HomepageListingRail, number> = {
  featured: HOMEPAGE_FEATURED_LIMIT,
  "for-sale": HOMEPAGE_HOUSES_FOR_SALE_LIMIT,
  "for-rent": HOMEPAGE_LISTING_LIMIT,
  apartments: HOMEPAGE_LISTING_LIMIT,
  commercial: HOMEPAGE_LISTING_LIMIT,
  latest: HOMEPAGE_LISTING_LIMIT,
};

const homepageRailFilter = (
  rail: HomepageListingRail,
): Record<string, unknown> => {
  switch (rail) {
    case "featured":
      return {
        isFeatured: true,
        status: { $in: MARKETING_PROPERTY_STATUSES },
      };
    case "for-sale":
      return { status: "for-sale" };
    case "for-rent":
      return { status: "for-rent" };
    case "apartments":
      return {
        propertyType: "apartment",
        status: { $in: MARKETING_PROPERTY_STATUSES },
      };
    case "commercial":
      return {
        propertyType: "commercial",
        status: { $in: MARKETING_PROPERTY_STATUSES },
      };
    case "latest":
      return { status: { $in: MARKETING_PROPERTY_STATUSES } };
    default: {
      const _exhaustive: never = rail;
      return _exhaustive;
    }
  }
};

const homepageRailErrorMessage: Record<HomepageListingRail, string> = {
  featured:
    "We couldn't load featured properties right now. Please try again shortly.",
  "for-sale":
    "We couldn't load houses for sale right now. Please try again shortly.",
  "for-rent":
    "We couldn't load rental properties right now. Please try again shortly.",
  apartments:
    "We couldn't load apartments right now. Please try again shortly.",
  commercial:
    "We couldn't load commercial listings right now. Please try again shortly.",
  latest:
    "We couldn't load the latest listings right now. Please try again shortly.",
};

/**
 * Published listings for a homepage rail (same public visibility as the catalog).
 */
export const listHomepageRailProperties = async (
  rail: HomepageListingRail,
  limit: number = HOMEPAGE_RAIL_LIMITS[rail],
): Promise<{
  items: PublicPropertyListItem[];
  error: string | null;
}> => {
  try {
    await connectDB();
    const rawItems = await PropertyModel.find(homepageRailFilter(rail))
      .select(homepageListProjection)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const items = rawItems.map((doc) =>
      toListItem(doc as PropertyDoc & { _id: mongoose.Types.ObjectId }),
    );
    return { items, error: null };
  } catch (error) {
    console.error(`[Novacity] listHomepageRailProperties(${rail}) failed:`, error);
    return { items: [], error: homepageRailErrorMessage[rail] };
  }
};

/** @deprecated Prefer `listHomepageRailProperties("for-sale")` */
export const listHomepageForSaleProperties = async (
  limit: number = HOMEPAGE_LISTING_LIMIT,
): Promise<{
  items: PublicPropertyListItem[];
  error: string | null;
}> => listHomepageRailProperties("for-sale", limit);

export const getMarketingPropertyBySlug = async (
  slug: string,
): Promise<(PropertyDoc & { _id: mongoose.Types.ObjectId }) | null> => {
  await connectDB();
  const doc = await PropertyModel.findOne({
    slug,
    status: { $in: MARKETING_PROPERTY_STATUSES },
  }).lean();
  if (!doc) {
    return null;
  }
  return doc as PropertyDoc & { _id: mongoose.Types.ObjectId };
};

export type MarketingPropertySitemapEntry = {
  slug: string;
  updatedAt: Date;
};

export const listMarketingPropertySitemapEntries =
  async (): Promise<MarketingPropertySitemapEntry[]> => {
    await connectDB();
    const rows = await PropertyModel.find({
      status: { $in: MARKETING_PROPERTY_STATUSES },
    })
      .select({ slug: 1, updatedAt: 1 })
      .lean();

    return rows.map((row) => {
      const updatedAt =
        "updatedAt" in row && row.updatedAt instanceof Date
          ? row.updatedAt
          : new Date();
      return { slug: String(row.slug), updatedAt };
    });
  };

export type HomepageStateHighlight = {
  label: string;
  slug: string;
  listingCount: number;
};

const HOMEPAGE_STATE_HIGHLIGHT_LIMIT = 5;

/**
 * Up to five states/regions with the most published listings for the homepage States section.
 */
export const listHomepageStateHighlights = async (
  limit: number = HOMEPAGE_STATE_HIGHLIGHT_LIMIT,
): Promise<{
  items: HomepageStateHighlight[];
  error: string | null;
}> => {
  try {
    await connectDB();
    const rows = await PropertyModel.aggregate<{
      label: string;
      count: number;
    }>([
      {
        $match: {
          status: { $in: MARKETING_PROPERTY_STATUSES },
          state: { $type: "string", $ne: "" },
        },
      },
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$state" } } },
          label: { $first: "$state" },
          count: { $sum: 1 },
        },
      },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1, label: 1 } },
      { $limit: limit },
    ]);

    const items = rows.map((row) => {
      const label = String(row.label ?? "").trim();
      return {
        label,
        slug: stateSlugFromLabel(label),
        listingCount: row.count,
      };
    });

    return { items, error: null };
  } catch (error) {
    console.error("[Novacity] listHomepageStateHighlights failed:", error);
    return {
      items: [],
      error:
        "We couldn't load states right now. Please try again shortly or browse all properties.",
    };
  }
};

export const listDistinctListingStates = async (): Promise<string[]> => {
  await connectDB();
  const raw = await PropertyModel.distinct("state", {
    status: { $in: MARKETING_PROPERTY_STATUSES },
  });
  const labels = new Map<string, string>();
  for (const entry of raw) {
    const t = String(entry ?? "").trim();
    if (!t) {
      continue;
    }
    const key = t.toLowerCase();
    if (!labels.has(key)) {
      labels.set(key, t);
    }
  }
  return [...labels.values()].sort((a, b) => a.localeCompare(b));
};
