import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shared/AppShell";
import { getAppBaseUrl } from "@/lib/app-url";
import { uiAppBody } from "@/lib/responsiveLayout";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppBaseUrl()),
  title: {
    default: "Novacity",
    template: "%s | Novacity",
  },
  description: "Modern real estate marketplace platform",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Novacity",
    description: "Modern real estate marketplace platform",
    siteName: "Novacity",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Novacity",
    description: "Modern real estate marketplace platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, "font-sans")}
    >
      <body className={cn(uiAppBody, "font-sans")}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
