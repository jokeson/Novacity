/**
 * Common states / regions for listing forms. Values are stored on `Property.state`
 * and deduplicated case-insensitively for the public States menu.
 */
export const SOUTH_SUDAN_STATE_OPTIONS = [
  { value: "Central Equatoria", label: "Central Equatoria" },
  { value: "Eastern Equatoria", label: "Eastern Equatoria" },
  { value: "Jonglei", label: "Jonglei" },
  { value: "Lakes", label: "Lakes" },
  { value: "Northern Bahr el Ghazal", label: "Northern Bahr el Ghazal" },
  { value: "Unity", label: "Unity" },
  { value: "Upper Nile", label: "Upper Nile" },
  { value: "Warrap", label: "Warrap" },
  { value: "Western Bahr el Ghazal", label: "Western Bahr el Ghazal" },
  { value: "Western Equatoria", label: "Western Equatoria" },
] as const;
