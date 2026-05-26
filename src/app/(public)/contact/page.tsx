import type { Metadata } from "next";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { PublicFooter } from "@/features/home/components/PublicFooter";
import { ContactPageView } from "@/features/contact/components/ContactPageView";
import { Navbar } from "@/components/shared/navigation/Navbar";
import { uiPageSectionY } from "@/lib/responsiveLayout";
import { uiPublicMainOffset } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact | Novacity",
  description:
    "Reach the Novacity team for support, partnerships, or product questions. We read every message.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Novacity",
    description:
      "Reach the Novacity team for support, partnerships, or product questions. We read every message.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Novacity",
    description:
      "Reach the Novacity team for support, partnerships, or product questions. We read every message.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className={cn(uiPublicMainOffset)}>
        <PageHeader
          title="Contact us"
          description="Share a question, partnership idea, or feedback. We typically respond by email."
        />
        <Container className={cn(uiPageSectionY, "min-w-0")}>
          <ContactPageView />
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}
