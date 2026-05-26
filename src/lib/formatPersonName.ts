/**
 * Title-case each word in a person's name (first name, last name, etc.).
 * e.g. "john DOE" → "John Doe"
 */
export const formatPersonName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return trimmed;
  }

  return trimmed
    .split(/\s+/)
    .map((part) => {
      if (!part) {
        return part;
      }
      const lower = part.toLocaleLowerCase();
      return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
    })
    .join(" ");
};
