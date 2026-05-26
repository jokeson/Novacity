import type { PropertyMapViewport } from "@/features/locations/types/locationMap";

/** Juba, Central Equatoria — default map viewport for Novacity locations. */
export const JUBA_MAP_CENTER = {
  lat: 4.8594,
  lng: 31.5713,
} as const;

/** Approximate city bounds for fitting markers. */
export const JUBA_MAP_BOUNDS = {
  south: 4.82,
  north: 4.9,
  west: 31.52,
  east: 31.62,
} as const;

export const JUBA_MAP_DEFAULT_ZOOM = 13;

/** Spread deterministic fallback pins within the city when lat/lng are missing. */
export const JUBA_MAP_COORD_SPREAD = {
  latDelta: 0.038,
  lngDelta: 0.048,
} as const;

export const JUBA_MAP_VIEWPORT: PropertyMapViewport = {
  center: JUBA_MAP_CENTER,
  bounds: JUBA_MAP_BOUNDS,
  defaultZoom: JUBA_MAP_DEFAULT_ZOOM,
  spread: JUBA_MAP_COORD_SPREAD,
  ariaLabel: "Interactive map of property locations in Juba, South Sudan",
  mapHint:
    "Hover a gold pin to see the full listing card above the map. Click a pin to open the listing. Pins without saved coordinates are placed across Juba until an exact address is added.",
};
