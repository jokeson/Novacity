"use client";

import { JUBA_MAP_VIEWPORT } from "@/constants/jubaMap";
import { PropertyMapSection } from "@/features/locations/components/PropertyMapSection";
import type { PropertyMapPin } from "@/features/locations/types/locationMap";

export type LocationsMapSectionProps = {
  pins: PropertyMapPin[];
};

export const LocationsMapSection = ({ pins }: LocationsMapSectionProps) => (
  <PropertyMapSection pins={pins} viewport={JUBA_MAP_VIEWPORT} />
);
