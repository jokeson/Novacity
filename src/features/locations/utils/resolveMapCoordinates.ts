import type { PropertyMapViewport } from "@/features/locations/types/locationMap";

const hashSlug = (slug: string): number => {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const isValidCoordinate = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/**
 * Uses stored WGS84 coordinates when present; otherwise places a stable pin
 * inside the map viewport until precise coords are saved on the listing.
 */
export const resolveMapCoordinates = (
  slug: string,
  viewport: PropertyMapViewport,
  latitude?: number | null,
  longitude?: number | null,
): { lat: number; lng: number } => {
  if (isValidCoordinate(latitude) && isValidCoordinate(longitude)) {
    return { lat: latitude, lng: longitude };
  }

  const hash = hashSlug(slug);
  const latFactor = (hash % 1000) / 1000 - 0.5;
  const lngFactor = (Math.floor(hash / 1000) % 1000) / 1000 - 0.5;

  return {
    lat: viewport.center.lat + latFactor * 2 * viewport.spread.latDelta,
    lng: viewport.center.lng + lngFactor * 2 * viewport.spread.lngDelta,
  };
};
