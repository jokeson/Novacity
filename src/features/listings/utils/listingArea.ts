import type { PropertyStatus } from "@/types/property";

export type ListingAreaValues = {
  areaWidthM?: number;
  areaLengthM?: number;
  areaSqM?: number;
};

export type StoredListingArea = {
  areaWidthM: number | null;
  areaLengthM: number | null;
  areaSqM: number | null;
};

/** For-sale listings must capture plot/building dimensions. */
export const listingRequiresAreaDimensions = (status: PropertyStatus): boolean =>
  status === "for-sale";

/** Keep area on sold listings; clear when status is not a sale type. */
export const shouldPersistListingArea = (status: PropertyStatus): boolean =>
  status === "for-sale" || status === "sold";

export const computeAreaSqMeters = (width: number, length: number): number =>
  Math.round(width * length * 100) / 100;

export const formatPropertyAreaLabel = (
  width?: number | null,
  length?: number | null,
  sqM?: number | null,
): string | null => {
  const w = width != null && width > 0 ? width : null;
  const l = length != null && length > 0 ? length : null;
  const sq = sqM != null && sqM > 0 ? sqM : null;

  if (w != null && l != null && sq != null) {
    return `${w} m × ${l} m · ${sq.toLocaleString("en-US")} m²`;
  }
  if (w != null && l != null) {
    return `${w} m × ${l} m`;
  }
  if (sq != null) {
    return `${sq.toLocaleString("en-US")} m²`;
  }
  return null;
};

export const resolveListingAreaForStorage = (
  status: PropertyStatus,
  values: ListingAreaValues,
): StoredListingArea => {
  if (!shouldPersistListingArea(status)) {
    return { areaWidthM: null, areaLengthM: null, areaSqM: null };
  }

  const w = values.areaWidthM;
  const l = values.areaLengthM;
  let sq = values.areaSqM;

  if (w != null && l != null && w > 0 && l > 0) {
    const computed = computeAreaSqMeters(w, l);
    if (sq == null || sq <= 0) {
      sq = computed;
    }
  }

  return {
    areaWidthM: w != null && w > 0 ? w : null,
    areaLengthM: l != null && l > 0 ? l : null,
    areaSqM: sq != null && sq > 0 ? sq : null,
  };
};
