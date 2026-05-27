import type { Metadata } from "next";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { LocationsPageView } from "@/features/locations/components/LocationsPageView";
import { uiPageSectionY } from "@/lib/responsiveLayout";
import { cn } from "@/lib/utils";
import { listJubaPropertyMapPins } from "@/server/queries/locationMap.queries";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Explore Novacity property listings on an interactive map of Juba, South Sudan — hover pins for prices and details.",
  alternates: { canonical: "/locations" },
  openGraph: {
    title: "Locations | Novacity",
    description:
      "Explore property listings on an interactive map of Juba, South Sudan.",
    url: "/locations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Locations | Novacity",
    description:
      "Explore property listings on an interactive map of Juba, South Sudan.",
  },
};

export default async function LocationsPage() {
  let pins: Awaited<ReturnType<typeof listJubaPropertyMapPins>> = [];
  try {
    pins = await listJubaPropertyMapPins();
  } catch {
    pins = [];
  }

  return (
    <>
      <PageHeader
        title="Locations"
        description="Discover houses, apartments, commercial space, and more across Juba — hover a pin for price and property type, then click to view the full listing."
      />
      <Container className={cn(uiPageSectionY, "min-w-0")}>
        <LocationsPageView pins={pins} />
      </Container>
    </>
  );
}
