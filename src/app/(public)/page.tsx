import type { Metadata } from "next";

import { HomePageView } from "@/features/home/components/HomePageView";

export const metadata: Metadata = {
  title: "Find your next space",
  description:
    "Browse houses, apartments, rentals, and commercial properties on Novacity — a premium real estate marketplace with advanced search and curated highlights.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Find your next space | Novacity",
    description:
      "Browse houses, apartments, rentals, and commercial properties on Novacity — a premium real estate marketplace with advanced search and curated highlights.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find your next space | Novacity",
    description:
      "Browse houses, apartments, rentals, and commercial properties on Novacity — a premium real estate marketplace with advanced search and curated highlights.",
  },
};

export default function HomePage() {
  return <HomePageView />;
}
