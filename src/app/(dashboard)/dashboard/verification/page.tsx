import { redirect } from "next/navigation";

import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { VerificationPageView } from "@/features/verification/components/VerificationPageView";
import { ROUTES } from "@/constants/routes";
import { requireSessionForDashboard } from "@/server/auth/session";
import { getUserByIdLean } from "@/server/queries/user.queries";

export const metadata = {
  title: "Owner verification",
};

export default async function DashboardVerificationPage() {
  const session = await requireSessionForDashboard();
  if (session.role !== "user") {
    redirect(ROUTES.dashboard);
  }

  const user = await getUserByIdLean(session.sub);
  const u = user as { ownerVerificationStatus?: string; ownerVerificationRejectionReason?: string } | null;
  const status = typeof u?.ownerVerificationStatus === "string" ? u.ownerVerificationStatus : "unsubmitted";

  if (status === "approved") {
    redirect(ROUTES.dashboard);
  }

  const rejectionReason =
    typeof u?.ownerVerificationRejectionReason === "string" ? u.ownerVerificationRejectionReason : "";
  const displayName =
    typeof (user as { name?: string } | null)?.name === "string"
      ? (user as { name: string }).name.trim()
      : session.email.split("@")[0] ?? "Owner";

  return (
    <>
      <DashboardHeader
        title="Owner verification"
        backLink={{ href: ROUTES.dashboard, label: "Back to overview" }}
        description="Apply to list properties as a verified Novacity owner."
      />
      <Container className="max-w-3xl py-8 md:py-10">
        <VerificationPageView
          status={status}
          rejectionReason={rejectionReason}
          displayName={displayName}
        />
      </Container>
    </>
  );
}
