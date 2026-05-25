import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { propertyDetailPath } from "@/constants/routes";
import { PropertyCard } from "@/features/properties/components/PropertyCard";
import type { FavoritePropertyRow } from "@/server/queries/dashboard.queries";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1400&auto=format&fit=crop";

export type FavoritesPageViewProps = {
  items: FavoritePropertyRow[];
};

export const FavoritesPageView = ({ items }: FavoritesPageViewProps) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No saved favorites yet"
        description="Browse listings on the marketplace and tap the heart icon to save properties here."
      />
    );
  }

  return (
    <div
      className={cn(
        "grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {items.map((item) => {
        const imageSrc = item.image ?? FALLBACK_IMAGE;
        return (
          <Link
            key={item.favoriteId}
            href={propertyDetailPath(item.slug)}
            className="focus-visible:ring-ring block h-full w-full min-w-0 max-w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <PropertyCard
              title={item.title}
              image={{ src: imageSrc, alt: item.title }}
              price={item.price}
              listingCurrency={item.currency}
              pricingType={item.pricingType}
              status={item.status}
              meta={{
                beds: item.bedrooms,
                baths: item.bathrooms,
                propertyType: item.propertyType,
              }}
            />
          </Link>
        );
      })}
    </div>
  );
};
