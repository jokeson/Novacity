import { formatStateGroupHeading } from "@/features/search/utils/formatStateGroupHeading";
import type { PublicPropertyListItem } from "@/server/queries/propertySearch.queries";

export type StateListingGroup = {
  stateLabel: string;
  heading: string;
  items: PublicPropertyListItem[];
};

const sortItemsByRecent = (
  items: PublicPropertyListItem[],
): PublicPropertyListItem[] =>
  [...items].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

export const groupListingsByState = (
  items: PublicPropertyListItem[],
): StateListingGroup[] => {
  const buckets = new Map<
    string,
    { label: string; items: PublicPropertyListItem[] }
  >();

  for (const item of items) {
    const raw = item.state?.trim() ?? "";
    const key = raw.toLowerCase() || "__none__";
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.items.push(item);
    } else {
      buckets.set(key, { label: raw, items: [item] });
    }
  }

  const groups = [...buckets.values()].map(({ label, items: groupItems }) => ({
    stateLabel: label,
    heading: formatStateGroupHeading(label),
    items: sortItemsByRecent(groupItems),
  }));

  groups.sort((a, b) => {
    if (!a.stateLabel.trim()) {
      return 1;
    }
    if (!b.stateLabel.trim()) {
      return -1;
    }
    return a.stateLabel.localeCompare(b.stateLabel, undefined, {
      sensitivity: "base",
    });
  });

  return groups;
};
