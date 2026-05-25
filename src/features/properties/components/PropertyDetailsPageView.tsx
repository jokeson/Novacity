import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { PriceText } from "@/components/shared/PriceText";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { FavoriteButton } from "@/features/properties/components/FavoriteButton";
import { PropertyContactCard } from "@/features/properties/components/PropertyContactCard";
import { PropertyDescriptionReadMore } from "@/features/properties/components/PropertyDescriptionReadMore";
import { PropertyListingDetailsSection } from "@/features/properties/components/PropertyListingDetailsSection";
import { PropertyGallery } from "@/features/properties/components/PropertyGallery";
import { PropertyShareActions } from "@/features/properties/components/PropertyShareActions";
import { PropertyStatusBadge } from "@/features/properties/components/PropertyStatusBadge";
import { formatListingPostedLabel } from "@/features/properties/utils/formatListingPostedLabel";
import type {
  ListingCurrency,
  ListingSource,
  PricingType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";
import { uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type PropertyDetailsPageViewProps = {
  property: {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: number;
    currency: ListingCurrency;
    pricingType: PricingType;
    status: PropertyStatus;
    propertyType: PropertyType;
    listingSource: ListingSource;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    state: string;
    location: string;
    address: string;
    phone: string;
    areaWidthM?: number | null;
    areaLengthM?: number | null;
    areaSqM?: number | null;
    ownerId: string;
    createdAt?: Date | string | null;
  };
  isAuthenticated: boolean;
  initialFavorite: boolean;
  /** Stable return to catalog with preserved filters when opened from search. */
  catalogBackHref: string;
};

export const PropertyDetailsPageView = ({
  property,
  isAuthenticated,
  initialFavorite,
  catalogBackHref,
}: PropertyDetailsPageViewProps) => {
  const ownershipLabel =
    property.listingSource === "novacity" ? "Listed by Novacity." : "Listed by owner.";

  const postedLabel = formatListingPostedLabel(property.createdAt);

  const priceBlock = (
    <PriceText
      amount={property.price}
      listingCurrency={property.currency}
      pricingType={property.pricingType}
      propertyStatus={property.status}
    />
  );

  return (
    <Container className="py-10">
      <nav className="mb-6" aria-label="Listing navigation">
        <Link
          href={catalogBackHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground -ml-2.5 gap-1.5",
          )}
        >
          <span aria-hidden>←</span>
          <span>
            {catalogBackHref === ROUTES.properties
              ? "Back to listings"
              : "Back to filtered listings"}
          </span>
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Card className="gap-0 overflow-hidden py-0">
          <PropertyGallery
            title={property.title}
            images={property.images}
            layout="featured"
            stateLabel={property.state}
            heroOverlay={
              <PropertyStatusBadge
                status={property.status}
                className="border-transparent bg-primary px-4 py-1.5 text-sm font-semibold text-gold shadow-sm"
              />
            }
          />

          <CardContent className="space-y-6 px-6 py-8 md:px-10">
            <header className="space-y-3">
              {/* Mobile: stacked title card + price tile */}
              <div className="flex flex-col gap-3 sm:hidden">
                <h1
                  className="font-heading text-foreground line-clamp-2 text-2xl font-semibold leading-tight tracking-tight"
                  title={property.title}
                >
                  {property.title}
                </h1>
                <div className="border-border bg-muted/40 flex flex-col gap-1 rounded-2xl border px-4 py-3">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    Price
                  </span>
                  <div className="text-foreground">{priceBlock}</div>
                </div>
                {postedLabel ? (
                  <p className="text-muted-foreground text-sm">{postedLabel}</p>
                ) : null}
              </div>

              {/* Desktop / tablet */}
              <div className="hidden space-y-3 sm:block">
                <h1 className={cn(uiTypography.sectionTitle, "md:text-4xl")}>
                  {property.title}
                </h1>
                {priceBlock}
                {postedLabel ? (
                  <p className="text-muted-foreground text-sm">{postedLabel}</p>
                ) : null}
              </div>
            </header>

            <Separator />

            <PropertyListingDetailsSection
              propertyType={property.propertyType}
              status={property.status}
              state={property.state}
              location={property.location}
              address={property.address}
              phone={property.phone}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              areaWidthM={property.areaWidthM}
              areaLengthM={property.areaLengthM}
              areaSqM={property.areaSqM}
            />

            <Separator />

            <section aria-labelledby="property-description" className="space-y-3">
              <h2 id="property-description" className={uiTypography.cardTitle}>
                About this property
              </h2>
              <PropertyDescriptionReadMore description={property.description} />
            </section>
          </CardContent>

          <CardFooter className="flex-col gap-4 border-t-0 bg-primary px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-10">
            <p className="font-heading text-gold text-base font-semibold tracking-tight md:text-lg">
              {ownershipLabel}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <FavoriteButton
                propertyId={property.id}
                slug={property.slug}
                initialFavorite={initialFavorite}
                isAuthenticated={isAuthenticated}
                onNavyFooter
              />
              <PropertyShareActions
                slug={property.slug}
                title={property.title}
                onNavyFooter
              />
            </div>
          </CardFooter>
        </Card>

        <PropertyContactCard
          slug={property.slug}
          propertyId={property.id}
          ownerId={property.ownerId}
          propertyTitle={property.title}
          location={property.location}
          address={property.address}
          phone={property.phone}
        />
      </div>
    </Container>
  );
};
