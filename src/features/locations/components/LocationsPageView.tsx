import Link from "next/link";
import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { LocationsMapSection } from "@/features/locations/components/LocationsMapSection";
import type { PropertyMapPin } from "@/features/locations/types/locationMap";
import { cn } from "@/lib/utils";

export type LocationsPageViewProps = {
  pins: PropertyMapPin[];
};

export const LocationsPageView = ({ pins }: LocationsPageViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-gold/25 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--gold)_14%,var(--background))_0%,var(--background)_100%)] flex flex-col gap-2 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <span
            className="bg-gold/15 text-gold flex size-10 shrink-0 items-center justify-center rounded-xl"
            aria-hidden
          >
            <MapPin className="size-5" />
          </span>
          <div>
            <p className="text-foreground text-sm font-semibold">Juba, South Sudan</p>
            <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
              {pins.length === 0
                ? "Live listings will appear on the map as they are published."
                : `${pins.length} ${pins.length === 1 ? "property" : "properties"} on the map`}
            </p>
          </div>
        </div>
        <Link
          href={ROUTES.listings}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
        >
          Browse all listings
        </Link>
      </div>

      {pins.length === 0 ? (
        <EmptyState
          title="No properties on the map yet"
          description="When sellers publish for-sale or for-rent listings, they will be pinned here across Juba with photos on hover."
          icon={MapPin}
          action={
            <Link href={ROUTES.listings} className={cn(buttonVariants({ variant: "gold" }))}>
              View marketplace
            </Link>
          }
        />
      ) : (
        <LocationsMapSection pins={pins} />
      )}
    </div>
  );
};
