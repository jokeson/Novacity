/** Public listing post date — e.g. `posted : 5-12-2026` */
export const formatListingPostedLabel = (
  input: Date | string | null | undefined,
): string | null => {
  if (input == null) {
    return null;
  }

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  // UTC keeps server render and client hydration aligned for RSC payloads.
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return `posted : ${day}-${month}-${year}`;
};
