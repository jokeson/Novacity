import type { Metadata } from "next";

import { Container } from "@/components/shared/Container";
import { PublicFooter } from "@/features/home/components/PublicFooter";
import { MarketplacePageHeader } from "@/features/search/components/MarketplacePageHeader";
import { PropertiesCatalogView } from "@/features/search/components/PropertiesCatalogView";
import { isMarketplaceBrowseAllView } from "@/features/search/utils/isMarketplaceBrowseAllView";
import {
  parsePropertySearchParams,
  propertySearchParamsSchema,
} from "@/features/search/validators/propertySearchParams";
import { Navbar } from "@/components/shared/navigation/Navbar";
import { uiPageSectionY } from "@/lib/responsiveLayout";
import { uiPublicMainOffset } from "@/lib/uiContext";
import { cn } from "@/lib/utils";
import type { StateListingGroup } from "@/features/search/utils/groupListingsByState";
import {
  listPublicPropertiesGroupedByState,
  searchPublicProperties,
  type PublicPropertyListItem,
} from "@/server/queries/propertySearch.queries";

const firstString = (
  value: string | string[] | undefined,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw : undefined;
};

const baseDescription =
  "Browse published Novacity listings. Open any card for full details, photos, and contact options.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const state = firstString(raw.state)?.trim();
  const titleBase = state
    ? `Properties in ${state} | Novacity`
    : "Browse properties | Novacity";
  const description = state
    ? `Browse published listings in ${state}. ${baseDescription}`
    : baseDescription;

  return {
    title: titleBase,
    description,
    alternates: {
      canonical: state ? undefined : "/properties",
    },
    openGraph: {
      title: titleBase,
      description,
      url: "/properties",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleBase,
      description,
    },
  };
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertiesPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const parsed = parsePropertySearchParams(raw);
  const params = parsed.success
    ? parsed.data
    : propertySearchParamsSchema.parse({});

  const browseAllByState = isMarketplaceBrowseAllView(params);

  let total: number;
  let items: PublicPropertyListItem[] | undefined;
  let groups: StateListingGroup[] | undefined;

  if (browseAllByState) {
    const grouped = await listPublicPropertiesGroupedByState();
    total = grouped.total;
    groups = grouped.groups;
  } else {
    const result = await searchPublicProperties(params);
    total = result.total;
    items = result.items;
  }

  return (
    <>
      <Navbar />
      <main className={cn(uiPublicMainOffset)}>
        <MarketplacePageHeader
          description={
            browseAllByState
              ? "All published properties grouped by state or region. Use search or pick a state in the navbar to filter."
              : "Browse published properties. Use the search icon in the navbar or a state in the menu to narrow results; links keep your filters in the URL."
          }
        />
        <Container className={cn(uiPageSectionY, "min-w-0")}>
          <PropertiesCatalogView
            parsed={params}
            total={total}
            items={items}
            groups={groups}
          />
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}
