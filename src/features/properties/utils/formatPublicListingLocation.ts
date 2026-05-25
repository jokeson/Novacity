/** Single-line location for cards and headers (city/area + optional address). */
export const formatPublicListingLocation = (input: {
  location?: string | null;
  address?: string | null;
  state?: string | null;
}): string => {
  const location = input.location?.trim() ?? "";
  const address = input.address?.trim() ?? "";
  const state = input.state?.trim() ?? "";

  if (location && address) {
    return `${location} · ${address}`;
  }
  if (location) {
    return location;
  }
  if (address) {
    return address;
  }
  return state;
};
