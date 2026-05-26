import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Navbar } from "@/components/shared/navigation/Navbar";
import { findStateLabelForSlug } from "@/constants/stateMapViewports";
import { PublicFooter } from "@/features/home/components/PublicFooter";
import { StatePageView } from "@/features/states/components/StatePageView";
import { uiPublicMainOffset } from "@/lib/uiContext";
import { cn } from "@/lib/utils";
import { listStatePropertyMapPins } from "@/server/queries/locationMap.queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stateLabel = findStateLabelForSlug(decodeURIComponent(slug));

  return {
    title: `${stateLabel} — Property map`,
    description: `Explore Novacity listings in ${stateLabel}, South Sudan on an interactive map. Hover pins for photos, prices, and property types.`,
    alternates: { canonical: `/states/${slug}` },
    openGraph: {
      title: `${stateLabel} | Novacity`,
      description: `Property map for ${stateLabel}, South Sudan.`,
      url: `/states/${slug}`,
      type: "website",
    },
  };
}

export default async function StateMapPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  if (!decodedSlug) {
    notFound();
  }

  const stateLabel = findStateLabelForSlug(decodedSlug);
  let pins: Awaited<ReturnType<typeof listStatePropertyMapPins>> = [];

  try {
    pins = await listStatePropertyMapPins(stateLabel);
  } catch {
    pins = [];
  }

  return (
    <>
      <Navbar />
      <main className={cn(uiPublicMainOffset)}>
        <PageHeader
          title={stateLabel}
          description="Browse properties across this state on the map — hover a pin for the listing photo, type, and price. Pins are approximate until sellers add an exact address."
        />
        <Container className="pb-12 md:pb-16">
          <StatePageView stateLabel={stateLabel} pins={pins} />
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}
