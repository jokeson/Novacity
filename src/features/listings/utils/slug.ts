import { randomBytes } from "node:crypto";

const slugify = (title: string): string => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return base.length > 0 ? base : "listing";
};

export const buildListingSlugBase = (title: string): string => slugify(title);

export const buildListingSlugCandidate = (title: string): string => {
  const suffix = randomBytes(3).toString("hex");
  return `${slugify(title)}-${suffix}`;
};
