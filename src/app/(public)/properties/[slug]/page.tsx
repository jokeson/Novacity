import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyDetailsPageView } from "@/features/properties/components/PropertyDetailsPageView";
import { PropertyListingJsonLd } from "@/features/properties/components/PropertyListingJsonLd";
import { buildPropertySearchQuery } from "@/features/search/utils/buildPropertySearchQuery";
import {
  flattenSearchParamsRecord,
  parsePropertySearchParams,
} from "@/features/search/validators/propertySearchParams";
import { ROUTES } from "@/constants/routes";
import { getAppBaseUrl } from "@/lib/app-url";
import { getSession } from "@/server/auth/session";
import { findFavoriteByUserAndProperty } from "@/server/repositories/favorite.repository";
import { incrementPropertyViewsBySlug } from "@/server/repositories/property.repository";
import { getMarketingPropertyBySlug } from "@/server/queries/propertySearch.queries";
import type { ListingCurrency, ListingSource } from "@/types/property";

const appBaseUrl = getAppBaseUrl();

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const property = await getMarketingPropertyBySlug(slug);
  if (!property) {
    return { title: "Listing" };
  }
  const description =
    property.description?.trim().slice(0, 155) ||
    `View details, photos, and pricing for ${property.title}.`;
  const ogImage = property.images?.[0];
  const ogImages = ogImage
    ? [{ url: ogImage, alt: property.title }]
    : undefined;
  return {
    title: property.title,
    description,
    alternates: {
      canonical: `/properties/${slug}`,
    },
    openGraph: {
      title: property.title,
      description,
      type: "article",
      url: `/properties/${slug}`,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
};

export default async function PropertyDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const rawSearch = searchParams ? await searchParams : {};
  const flatSearch = flattenSearchParamsRecord(rawSearch);
  const parsedSearch = parsePropertySearchParams(flatSearch);
  const catalogBackHref = `${ROUTES.properties}${
    parsedSearch.success ? buildPropertySearchQuery(parsedSearch.data) : ""
  }`;

  const property = await getMarketingPropertyBySlug(slug);
  if (!property) {
    notFound();
  }

  await incrementPropertyViewsBySlug(slug);

  const session = await getSession();
  let initialFavorite = false;
  if (session) {
    const fav = await findFavoriteByUserAndProperty(
      session.sub,
      String(property._id),
    );
    initialFavorite = Boolean(fav);
  }

  const listingSource =
    (property.listingSource as ListingSource | undefined) ?? "owner";
  const currency = (property.currency as ListingCurrency | undefined) ?? "USD";

  const model = {
    id: String(property._id),
    slug: property.slug,
    title: property.title,
    description: property.description ?? "",
    price: property.price,
    currency,
    pricingType: property.pricingType,
    status: property.status,
    propertyType: property.propertyType,
    listingSource,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    images: property.images ?? [],
    state: property.state ?? "",
    location: property.location ?? "",
    address: property.address ?? "",
    phone: property.phone ?? "",
    areaWidthM: property.areaWidthM ?? null,
    areaLengthM: property.areaLengthM ?? null,
    areaSqM: property.areaSqM ?? null,
    ownerId: String(property.ownerId),
    createdAt:
      "createdAt" in property && property.createdAt instanceof Date
        ? property.createdAt
        : null,
  };

  return (
    <>
      <PropertyListingJsonLd
        baseUrl={appBaseUrl}
        property={{
          title: model.title,
          description: model.description,
          slug: model.slug,
          price: model.price,
          priceCurrency: model.currency,
          pricingType: model.pricingType,
          status: model.status,
          propertyType: model.propertyType,
          bedrooms: model.bedrooms,
          bathrooms: model.bathrooms,
          images: model.images,
          location: model.location,
          address: model.address,
          phone: model.phone,
        }}
      />
      <PropertyDetailsPageView
        property={model}
        isAuthenticated={Boolean(session)}
        initialFavorite={initialFavorite}
        catalogBackHref={catalogBackHref}
      />
    </>
  );
}
