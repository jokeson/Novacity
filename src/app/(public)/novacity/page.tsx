import type { Metadata } from "next";

import { PublicFooter } from "@/features/home/components/PublicFooter";
import { NovacityPageView } from "@/features/novacity/components/NovacityPageView";
import { Navbar } from "@/components/shared/navigation/Navbar";
import { uiPublicMainOffset } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

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
  return (
    <>
      <Navbar />
      <main className={cn(uiPublicMainOffset)}>
        <NovacityPageView />
      </main>
      <PublicFooter />
    </>
  );
};
