import type { Metadata } from "next";

import { AuthPageRouteClient } from "@/features/auth/components/AuthPageRouteClient";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register for Novacity.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <AuthPageRouteClient mode="sign-up" />;
}
