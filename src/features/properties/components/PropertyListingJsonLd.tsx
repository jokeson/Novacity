import { propertyDetailPath } from "@/constants/routes";
import type { ListingCurrency, PricingType, PropertyStatus, PropertyType } from "@/types/property";

export type PropertyListingJsonLdProps = {
  baseUrl: string;
  property: {
    title: string;
    description: string;
    slug: string;
    price: number;
    priceCurrency: ListingCurrency;
    pricingType: PricingType;
    status: PropertyStatus;
    propertyType: PropertyType;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    location: string;
    address: string;
    phone?: string;
  };
};

const toAbsoluteUrl = (baseUrl: string, url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const origin = baseUrl.replace(/\/$/, "");
  return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
};

export const PropertyListingJsonLd = ({
  baseUrl,
  property,
}: PropertyListingJsonLdProps) => {
  const pageUrl = `${baseUrl.replace(/\/$/, "")}${propertyDetailPath(property.slug)}`;
  const images = (property.images ?? [])
    .map((src) => toAbsoluteUrl(baseUrl, src))
    .filter(Boolean);

  const availability =
    property.status === "sold" || property.status === "rented"
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock";

  const contactPhone = property.phone?.trim();

  const payload = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": pageUrl,
    name: property.title,
    description: property.description?.trim() || undefined,
    url: pageUrl,
    image: images.length > 0 ? images : undefined,
    category: property.propertyType,
    numberOfRooms: property.bedrooms > 0 ? property.bedrooms : undefined,
    numberOfBathroomsTotal: property.bathrooms > 0 ? property.bathrooms : undefined,
    ...(contactPhone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: contactPhone,
            contactType: "customer service",
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address?.trim() || undefined,
      addressLocality: property.location?.trim() || undefined,
      addressCountry: "SS",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.priceCurrency,
      availability,
      url: pageUrl,
      ...(property.pricingType === "negotiable"
        ? { description: "Price is negotiable." }
        : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
};
