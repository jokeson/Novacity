import type { Metadata } from "next";

import { NovacityPageView } from "@/features/novacity/components/NovacityPageView";

export const metadata: Metadata = {
  title: "About Novacity | Novacity",
  description:
    "Novacity is a South Sudan–focused real estate technology platform connecting buyers, renters, sellers, companies, and investors.",
  alternates: { canonical: "/novacity" },
  openGraph: {
    title: "About Novacity | Novacity",
    description:
      "Novacity is a South Sudan–focused real estate technology platform connecting buyers, renters, sellers, companies, and investors.",
    url: "/novacity",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Novacity | Novacity",
    description:
      "Novacity is a South Sudan–focused real estate technology platform connecting buyers, renters, sellers, companies, and investors.",
  },
};

export default function NovacityPage() {
  return <NovacityPageView />;
}
