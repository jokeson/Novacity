import type { ReactNode } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { HomeListingSectionPromoImage } from "@/features/home/components/HomeListingSectionPromoImage";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { buttonVariants } from "@/components/ui/button";
import { propertyDetailPath, ROUTES } from "@/constants/routes";
import {
  HOME_EMPTY_STATE_NO_SHADOW,
  HOME_PROPERTY_CARD_MOBILE_LAYOUT,
  HOME_PROPERTY_CARD_NO_SHADOW,
  homeListingCardClassName,
} from "@/features/home/constants/homeCardSurfaces";
import { HomeSectionBandShell } from "@/features/home/components/HomeSectionBandShell";
import { HOME_SECTION_TITLE_ACCENT_CLASS } from "@/features/home/constants/homeSectionBands";
import type { HomeListingSectionConfig } from "@/features/home/types/homeListing";
import { PropertyCard } from "@/features/properties/components/PropertyCard";
import { publicPropertyListItemToCardProps } from "@/features/properties/utils/publicPropertyListItemToCardProps";
import type { PublicPropertyListItem } from "@/server/queries/propertySearch.queries";
import { uiPropertyCardGrid } from "@/lib/responsiveLayout";
import { cn } from "@/lib/utils";

const gridClassName: Record<HomeListingSectionConfig["gridCols"], string> = {
  3: "",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export type HomeListingSectionProps = HomeListingSectionConfig & {
  items: PublicPropertyListItem[];
  fetchFailed: boolean;
  fetchErrorMessage?: string | null;
  showListPropertyCta?: boolean;
  listPropertyHref?: string;
  listPropertyLabel?: string;
};

export const HomeListingSection = ({
  headingId,
  eyebrow,
  title,
  description,
  tone,
  layout = "grid",
  promoImage,
  gridCols,
  emptyTitle,
  emptyDescription,
  errorTitle,
  browseLabel,
  browseHref,
  footerMarketplaceLabel,
  showListPropertyCtaOnEmpty,
  listingLimit,
  cardImageSources,
  items,
  fetchFailed,
  fetchErrorMessage,
  showListPropertyCta = false,
  listPropertyHref = ROUTES.dashboardListingsCreate,
  listPropertyLabel = "List a property",
}: HomeListingSectionProps) => {
  const listingCardSurfaceClassName = homeListingCardClassName(tone);
  const priorityImageCount = gridCols;
  const marketplaceFooterLabel = footerMarketplaceLabel ?? browseLabel;
  const isSplitPromo = layout === "split-promo" && promoImage !== undefined;
  const maxListings = listingLimit ?? (isSplitPromo ? 4 : items.length);
  const visibleListings = items.slice(0, maxListings);

  const listingCards = (
    <ul
      className={cn(
        "list-none gap-4",
        isSplitPromo
          ? "flex flex-col"
          : cn(uiPropertyCardGrid, "mt-8 sm:mt-10", gridClassName[gridCols]),
      )}
    >
      {visibleListings.map((item, index) => {
        const cardProps = publicPropertyListItemToCardProps(item);
        const hardcodedSrc = cardImageSources?.[index];
        const cardImage =
          hardcodedSrc !== undefined
            ? { src: hardcodedSrc, alt: cardProps.image.alt }
            : cardProps.image;
        return (
          <li key={item.slug} className="min-w-0">
            <Link
              href={propertyDetailPath(item.slug)}
              className="focus-visible:ring-ring block h-full w-full min-w-0 max-w-full cursor-pointer rounded-2xl outline-none transition-colors duration-300 focus-visible:ring-[3px] focus-visible:ring-ring/55"
              aria-label={`View listing: ${cardProps.title}`}
            >
              <PropertyCard
                {...cardProps}
                image={cardImage}
                priorityImage={index < priorityImageCount}
                mobileCenterContent={HOME_PROPERTY_CARD_MOBILE_LAYOUT}
                className={cn(
                  listingCardSurfaceClassName,
                  HOME_PROPERTY_CARD_NO_SHADOW,
                  "max-md:bg-background",
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const splitPromoLayout = (sidebar: ReactNode) =>
    promoImage ? (
      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
        <div className="order-2 flex w-full min-w-0 flex-col gap-4 lg:order-1 lg:w-[30%] lg:shrink-0">
          {sidebar}
        </div>
        <HomeListingSectionPromoImage
          image={promoImage}
          browseHref={browseHref}
          browseLabel={browseLabel}
          className="order-1 lg:order-2 lg:w-[70%] lg:shrink-0"
        />
      </div>
    ) : null;

  return (
    <HomeSectionBandShell tone={tone} aria-labelledby={headingId}>
      <Container>
        <div>
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingId={headingId}
          />
          <div className={HOME_SECTION_TITLE_ACCENT_CLASS} aria-hidden />
        </div>

        {fetchFailed ? (
          <EmptyState
            className={cn("mt-10", HOME_EMPTY_STATE_NO_SHADOW)}
            title={errorTitle}
            description={
              fetchErrorMessage ??
              "Something went wrong while loading this section."
            }
            icon={AlertCircle}
            action={
              <Link
                href={browseHref}
                className={cn(buttonVariants({ variant: "gold" }))}
              >
                {browseLabel}
              </Link>
            }
          />
        ) : items.length === 0 ? (
          isSplitPromo ? (
            splitPromoLayout(
              <EmptyState
                className={HOME_EMPTY_STATE_NO_SHADOW}
                title={emptyTitle}
                description={emptyDescription}
                action={
                  showListPropertyCtaOnEmpty && showListPropertyCta ? (
                    <Link
                      href={listPropertyHref}
                      className={cn(buttonVariants({ variant: "gold" }))}
                    >
                      {listPropertyLabel}
                    </Link>
                  ) : undefined
                }
              />,
            )
          ) : (
            <EmptyState
              className={cn("mt-10", HOME_EMPTY_STATE_NO_SHADOW)}
              title={emptyTitle}
              description={emptyDescription}
              action={
                <ListingSectionActions
                  browseHref={browseHref}
                  browseLabel={browseLabel}
                  showListPropertyCta={Boolean(
                    showListPropertyCtaOnEmpty && showListPropertyCta,
                  )}
                  listPropertyHref={listPropertyHref}
                  listPropertyLabel={listPropertyLabel}
                />
              }
            />
          )
        ) : isSplitPromo ? (
          splitPromoLayout(listingCards)
        ) : (
          <>
            {listingCards}
            {footerMarketplaceLabel ? (
              <div className="mt-10 flex justify-center">
                <Link
                  href={browseHref}
                  className={cn(
                    buttonVariants({ variant: "gold" }),
                    "h-11 cursor-pointer px-8 text-base sm:h-12",
                  )}
                >
                  {marketplaceFooterLabel}
                </Link>
              </div>
            ) : null}
          </>
        )}
      </Container>
    </HomeSectionBandShell>
  );
};

type ListingSectionActionsProps = {
  browseHref: string;
  browseLabel: string;
  showListPropertyCta: boolean;
  listPropertyHref: string;
  listPropertyLabel: string;
};

const ListingSectionActions = ({
  browseHref,
  browseLabel,
  showListPropertyCta,
  listPropertyHref,
  listPropertyLabel,
}: ListingSectionActionsProps) => (
  <div className="flex flex-wrap justify-center gap-2">
    <Link
      href={browseHref}
      className={cn(buttonVariants({ variant: "gold" }))}
    >
      {browseLabel}
    </Link>
    {showListPropertyCta ? (
      <Link
        href={listPropertyHref}
        className={cn(buttonVariants({ variant: "gold" }))}
      >
        {listPropertyLabel}
      </Link>
    ) : null}
  </div>
);
