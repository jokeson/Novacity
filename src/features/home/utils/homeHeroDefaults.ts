/** Curated Unsplash asset (allowed in `next.config.ts` `remotePatterns`). */
export const HOME_HERO_DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80";

export const HOME_HERO_DEFAULTS = {
  eyebrow: "Premium marketplace",
  heading: "Discover homes, rentals, and commercial space with confidence.",
  body: "Transparent listings, structured search, and a calm interface — Novacity connects serious buyers and tenants with standout places.",
  imageUrl: HOME_HERO_DEFAULT_IMAGE_URL,
  imageAlt: "Modern glass high-rise towers in a city skyline at dusk",
} as const;

export const HOME_HERO_CONFIG_KEY = "default" as const;
