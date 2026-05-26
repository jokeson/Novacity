import { JUBA_MAP_VIEWPORT } from "@/constants/jubaMap";
import { getStateMapViewport } from "@/constants/stateMapViewports";
import { MARKETING_PROPERTY_STATUSES } from "@/constants/propertyMarket";
import { PUBLIC_LISTING_CARD_FALLBACK_IMAGE } from "@/features/properties/utils/publicPropertyListItemToCardProps";
import { resolveMapCoordinates } from "@/features/locations/utils/resolveMapCoordinates";
import type { PropertyMapPin, PropertyMapViewport } from "@/features/locations/types/locationMap";
import { escapeRegex } from "@/features/search/utils/escapeRegex";
import { resolvePublicImageUrl } from "@/lib/resolve-public-image-url";
import { connectDB } from "@/server/db/connect";
import { PropertyModel, type PropertyDoc } from "@/server/models/Property";
import type { ListingCurrency } from "@/types/property";

const toMapPin = (doc: PropertyDoc, viewport: PropertyMapViewport): PropertyMapPin => {
  const { lat, lng } = resolveMapCoordinates(
    doc.slug,
    viewport,
    doc.latitude,
    doc.longitude,
  );
  const images = doc.images ?? [];

  return {
    slug: doc.slug,
    title: doc.title,
    price: doc.price,
    currency: (doc.currency as ListingCurrency | undefined) ?? "USD",
    pricingType: doc.pricingType,
    status: doc.status,
    propertyType: doc.propertyType,
    location: doc.location ?? "",
    address: doc.address ?? "",
    image: resolvePublicImageUrl(
      images[0],
      PUBLIC_LISTING_CARD_FALLBACK_IMAGE,
    ),
    lat,
    lng,
  };
};

const listMarketingMapPins = async (
  filter: Record<string, unknown>,
  viewport: PropertyMapViewport,
): Promise<PropertyMapPin[]> => {
  await connectDB();

  const docs = await PropertyModel.find({
    status: { $in: MARKETING_PROPERTY_STATUSES },
    ...filter,
  })
    .select(
      "slug title price currency pricingType status propertyType location address latitude longitude images",
    )
    .sort({ createdAt: -1 })
    .lean<PropertyDoc[]>();

  return docs.map((doc) => toMapPin(doc, viewport));
};

/** Public map pins for live listings on the Juba locations page. */
export const listJubaPropertyMapPins = async (): Promise<PropertyMapPin[]> =>
  listMarketingMapPins({}, JUBA_MAP_VIEWPORT);

/** Map pins for a state/region page — pins spread in-state until exact coords exist. */
export const listStatePropertyMapPins = async (
  stateLabel: string,
): Promise<PropertyMapPin[]> => {
  const trimmed = stateLabel.trim();
  if (!trimmed) {
    return [];
  }

  const viewport = getStateMapViewport(trimmed);
  return listMarketingMapPins(
    { state: new RegExp(`^${escapeRegex(trimmed)}$`, "i") },
    viewport,
  );
};
