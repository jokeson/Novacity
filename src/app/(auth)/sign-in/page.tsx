import type { Metadata } from "next";

import { AuthPageRouteClient } from "@/features/auth/components/AuthPageRouteClient";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Access your Novacity account.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;

  return <AuthPageRouteClient mode="sign-in" callbackUrl={callbackUrl} />;
}
