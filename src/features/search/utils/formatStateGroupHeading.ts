/** Marketplace section title, e.g. `Upper Nile` → `Upper Nile state`. */
export const formatStateGroupHeading = (stateLabel: string): string => {
  const trimmed = stateLabel.trim();
  if (!trimmed) {
    return "Other listings";
  }
  const lower = trimmed.toLowerCase();
  if (lower.endsWith(" state")) {
    return trimmed;
  }
  return `${trimmed} state`;
};
