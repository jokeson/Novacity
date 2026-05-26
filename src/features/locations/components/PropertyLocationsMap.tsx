"use client";

import { JUBA_MAP_VIEWPORT } from "@/constants/jubaMap";
import { PropertyMap } from "@/features/locations/components/PropertyMap";
import type { PropertyMapPin } from "@/features/locations/types/locationMap";

export type PropertyLocationsMapProps = {
  pins: PropertyMapPin[];
  className?: string;
};

/** Juba city locations map — see `PropertyMap` for the shared implementation. */
export const PropertyLocationsMap = ({
  pins,
  className,
}: PropertyLocationsMapProps) => (
  <PropertyMap pins={pins} viewport={JUBA_MAP_VIEWPORT} className={className} />
);
