import { SOUTH_SUDAN_STATE_OPTIONS } from "@/constants/southSudanStates";
import type { PropertyMapViewport } from "@/features/locations/types/locationMap";
import { stateSlugFromLabel } from "@/features/search/utils/stateSlug";

type StateMapDefinition = {
  center: { lat: number; lng: number };
  spread: { latDelta: number; lngDelta: number };
  defaultZoom: number;
};

/**
 * Approximate map centers per state — used to spread listing pins until sellers
 * provide accurate latitude/longitude on each property.
 */
const STATE_MAP_DEFINITIONS: Record<string, StateMapDefinition> = {
  "Central Equatoria": {
    center: { lat: 4.8594, lng: 31.5713 },
    spread: { latDelta: 0.12, lngDelta: 0.14 },
    defaultZoom: 9,
  },
  "Eastern Equatoria": {
    center: { lat: 4.75, lng: 33.25 },
    spread: { latDelta: 0.14, lngDelta: 0.16 },
    defaultZoom: 8,
  },
  Jonglei: {
    center: { lat: 7.0, lng: 31.6 },
    spread: { latDelta: 0.2, lngDelta: 0.18 },
    defaultZoom: 8,
  },
  Lakes: {
    center: { lat: 6.8, lng: 29.7 },
    spread: { latDelta: 0.14, lngDelta: 0.14 },
    defaultZoom: 8,
  },
  "Northern Bahr el Ghazal": {
    center: { lat: 9.53, lng: 28.86 },
    spread: { latDelta: 0.12, lngDelta: 0.14 },
    defaultZoom: 8,
  },
  Unity: {
    center: { lat: 9.4, lng: 29.8 },
    spread: { latDelta: 0.14, lngDelta: 0.14 },
    defaultZoom: 8,
  },
  "Upper Nile": {
    center: { lat: 9.45, lng: 31.65 },
    spread: { latDelta: 0.14, lngDelta: 0.16 },
    defaultZoom: 8,
  },
  Warrap: {
    center: { lat: 8.0, lng: 28.9 },
    spread: { latDelta: 0.12, lngDelta: 0.14 },
    defaultZoom: 8,
  },
  "Western Bahr el Ghazal": {
    center: { lat: 8.3, lng: 25.67 },
    spread: { latDelta: 0.14, lngDelta: 0.16 },
    defaultZoom: 8,
  },
  "Western Equatoria": {
    center: { lat: 4.09, lng: 28.65 },
    spread: { latDelta: 0.14, lngDelta: 0.14 },
    defaultZoom: 8,
  },
};

const SOUTH_SUDAN_FALLBACK_DEFINITION: StateMapDefinition = {
  center: { lat: 7.5, lng: 30.0 },
  spread: { latDelta: 0.35, lngDelta: 0.4 },
  defaultZoom: 6,
};

const boundsFromCenter = (
  center: { lat: number; lng: number },
  spread: { latDelta: number; lngDelta: number },
) => ({
  south: center.lat - spread.latDelta,
  north: center.lat + spread.latDelta,
  west: center.lng - spread.lngDelta,
  east: center.lng + spread.lngDelta,
});

const definitionToViewport = (
  stateLabel: string,
  definition: StateMapDefinition,
): PropertyMapViewport => ({
  center: definition.center,
  bounds: boundsFromCenter(definition.center, definition.spread),
  defaultZoom: definition.defaultZoom,
  spread: definition.spread,
  ariaLabel: `Interactive map of property locations in ${stateLabel}, South Sudan`,
  mapHint:
    "Hover a gold pin to see the full listing card above the map. Click a pin to open the property. Pins are placed across this state until an exact address is saved on the listing.",
});

const normalizeStateKey = (label: string): string => label.trim().toLowerCase();

const STATE_VIEWPORT_BY_KEY = new Map<string, PropertyMapViewport>();

for (const option of SOUTH_SUDAN_STATE_OPTIONS) {
  const definition = STATE_MAP_DEFINITIONS[option.value];
  if (!definition) {
    continue;
  }
  STATE_VIEWPORT_BY_KEY.set(
    normalizeStateKey(option.value),
    definitionToViewport(option.value, definition),
  );
}

export const getStateMapViewport = (stateLabel: string): PropertyMapViewport => {
  const trimmed = stateLabel.trim();
  const known = STATE_VIEWPORT_BY_KEY.get(normalizeStateKey(trimmed));
  if (known) {
    return known;
  }

  return definitionToViewport(
    trimmed || "South Sudan",
    SOUTH_SUDAN_FALLBACK_DEFINITION,
  );
};

export const findStateLabelForSlug = (slug: string): string => {
  const normalizedSlug = slug.trim().toLowerCase();
  for (const option of SOUTH_SUDAN_STATE_OPTIONS) {
    if (stateSlugFromLabel(option.value) === normalizedSlug) {
      return option.value;
    }
  }
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
