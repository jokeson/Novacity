import type { MetadataRoute } from "next";

import { getAppBaseUrl } from "@/lib/app-url";
import { ROUTES } from "@/constants/routes";
import { listMarketingPropertySitemapEntries } from "@/server/queries/propertySearch.queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppBaseUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${ROUTES.home}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}${ROUTES.properties}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}${ROUTES.locations}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${base}${ROUTES.novacity}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}${ROUTES.contact}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const properties = await listMarketingPropertySitemapEntries();
    const propertyEntries: MetadataRoute.Sitemap = properties.map((p) => ({
      url: `${base}${ROUTES.properties}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticEntries, ...propertyEntries];
  } catch {
    return staticEntries;
  }
}
