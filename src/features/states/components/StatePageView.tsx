import Link from "next/link";
import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { PropertyMapSection } from "@/features/locations/components/PropertyMapSection";
import { getStateMapViewport } from "@/constants/stateMapViewports";
import type { PropertyMapPin } from "@/features/locations/types/locationMap";
import { buildPropertySearchQuery } from "@/features/search/utils/buildPropertySearchQuery";
import { propertySearchParamsSchema } from "@/features/search/validators/propertySearchParams";
import { cn } from "@/lib/utils";

export type StatePageViewProps = {
  stateLabel: string;
  pins: PropertyMapPin[];
};

export const StatePageView = ({ stateLabel, pins }: StatePageViewProps) => {
  const viewport = getStateMapViewport(stateLabel);
  const catalogSearch = buildPropertySearchQuery(propertySearchParamsSchema.parse({}), {
    state: stateLabel,
  });
  const catalogHref = `${ROUTES.properties}${catalogSearch}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="border-primary/15 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--primary)_10%,var(--background))_0%,var(--background)_100%)] flex flex-col gap-2 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <span
            className="bg-primary/8 text-gold flex size-10 shrink-0 items-center justify-center rounded-xl"
            aria-hidden
          >
            <MapPin className="size-5" />
          </span>
          <div>
            <p className="text-foreground text-sm font-semibold">{stateLabel}</p>
            <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
              {pins.length === 0
                ? "Listings in this state will appear on the map when published."
                : `${pins.length} ${pins.length === 1 ? "property" : "properties"} mapped in ${stateLabel}`}
            </p>
          </div>
        </div>
        <Link
          href={catalogHref}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
        >
          Browse listings
        </Link>
      </div>

      {pins.length === 0 ? (
        <EmptyState
          title={`No listings in ${stateLabel} yet`}
          description="When sellers publish properties with this state or region, they will appear on the map automatically."
          icon={MapPin}
          action={
            <Link href={catalogHref} className={cn(buttonVariants({ variant: "gold" }))}>
              Search marketplace
            </Link>
          }
        />
      ) : (
        <PropertyMapSection pins={pins} viewport={viewport} />
      )}
    </div>
  );
};
