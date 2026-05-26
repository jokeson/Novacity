import type { PropertyCardProps } from "@/features/properties/components/PropertyCard";
import { formatListingPostedLabel } from "@/features/properties/utils/formatListingPostedLabel";
import { formatPublicListingLocation } from "@/features/properties/utils/formatPublicListingLocation";
import { resolvePublicImageUrl } from "@/lib/resolve-public-image-url";
import type { PublicPropertyListItem } from "@/server/queries/propertySearch.queries";

/** Shared with catalog / homepage so listing cards stay consistent. */
export const PUBLIC_LISTING_CARD_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1400&auto=format&fit=crop";

export const publicPropertyListItemToCardProps = (
  item: PublicPropertyListItem,
): PropertyCardProps => {
  const postedLabel = formatListingPostedLabel(item.createdAt);

  return {
    title: item.title,
    image: {
      src: resolvePublicImageUrl(
        item.images[0],
        PUBLIC_LISTING_CARD_FALLBACK_IMAGE,
      ),
      alt: item.title,
    },
    price: item.price,
    listingCurrency: item.currency,
    pricingType: item.pricingType,
    status: item.status,
    state: item.state,
    location: formatPublicListingLocation({
      location: item.location,
      address: item.address,
      state: item.state,
    }),
    meta: {
      beds: item.bedrooms,
      baths: item.bathrooms,
      propertyType: item.propertyType,
    },
    ...(postedLabel ? { postedLabel } : {}),
  };
};
