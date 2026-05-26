import { JUBA_MAP_VIEWPORT } from "@/constants/jubaMap";
import { resolveMapCoordinates } from "@/features/locations/utils/resolveMapCoordinates";

/** @deprecated Prefer `resolveMapCoordinates` with `JUBA_MAP_VIEWPORT`. */
export const resolveJubaMapCoordinates = (
  slug: string,
  latitude?: number | null,
  longitude?: number | null,
): { lat: number; lng: number } =>
  resolveMapCoordinates(slug, JUBA_MAP_VIEWPORT, latitude, longitude);
