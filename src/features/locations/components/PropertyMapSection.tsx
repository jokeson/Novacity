"use client";

import dynamic from "next/dynamic";

import { LocationsMapSkeleton } from "@/features/locations/components/LocationsMapSkeleton";
import type { PropertyMapPin, PropertyMapViewport } from "@/features/locations/types/locationMap";

const PropertyMap = dynamic(
  () =>
    import("@/features/locations/components/PropertyMap").then((m) => ({
      default: m.PropertyMap,
    })),
  { ssr: false, loading: () => <LocationsMapSkeleton /> },
);

export type PropertyMapSectionProps = {
  pins: PropertyMapPin[];
  viewport: PropertyMapViewport;
};

export const PropertyMapSection = ({ pins, viewport }: PropertyMapSectionProps) => (
  <PropertyMap pins={pins} viewport={viewport} />
);
