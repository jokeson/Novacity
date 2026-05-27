import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { PassKeyExpirationAlert } from "@/features/passkeys/components/PassKeyExpirationAlert";
import { PassKeyForm } from "@/features/passkeys/components/PassKeyForm";
import { PassKeyStatusCard } from "@/features/passkeys/components/PassKeyStatusCard";
import { buildPassKeyDashboardState } from "@/features/passkeys/services/buildPassKeyDashboardState";
import { ROUTES } from "@/constants/routes";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import { listPassKeysForUser } from "@/server/services/passkey.service";

export const metadata = {
  title: "Pass keys",
};

export default async function DashboardPassKeysPage() {
  const session = await requireVerifiedOwnerForDashboard();
  const docs = await listPassKeysForUser(session.sub);
  const lean = docs.map((doc) => ({
    _id: doc._id,
    code: doc.code,
    userId: doc.userId ?? null,
    duration: doc.duration,
    isActive: doc.isActive,
    expiresAt: doc.expiresAt,
    usedAt: doc.usedAt ?? null,
    createdAt: doc.createdAt,
  }));
  const emailMap = new Map([[session.sub, session.email]]);
  const state = buildPassKeyDashboardState(lean, emailMap);

  return (
    <>
      <DashboardHeader
        title="Pass keys"
        backLink={{ href: ROUTES.dashboard, label: "Back to overview" }}
        description="Redeem a purchased code or review keys on your account. Publishing a listing for the first time consumes one unused PassKey."
      />
      <Container className="space-y-8 py-8 md:py-10">
        <PassKeyExpirationAlert
          expiringWithinSevenDays={state.expiringWithinSevenDays}
          soonestValidExpiresAt={state.soonestValidExpiresAt}
        />
        <PassKeyStatusCard
          hasValidPassKey={state.hasValidPassKey}
          keys={state.keys}
        />
        <PassKeyForm />
      </Container>
    </>
  );
}
