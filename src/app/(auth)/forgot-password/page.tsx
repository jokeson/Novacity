import type { Metadata } from "next";

import { AuthPageView } from "@/features/auth/components/AuthPageView";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Novacity password.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageView
      title="Recover access"
      description="Provide the email tied to your account. We’ll email next steps whenever that inbox exists."
    >
      <ForgotPasswordForm />
    </AuthPageView>
  );
}
