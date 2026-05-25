import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { PassKeyAccessGuard } from "@/features/passkeys/components/PassKeyAccessGuard";
import { ListingForm } from "@/features/listings/components/ListingForm";
import { ROUTES } from "@/constants/routes";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import { hasValidPublishPassKey } from "@/server/services/passkey.service";

export const metadata = {
  title: "Create listing",
};

export default async function CreateListingPage() {
  const session = await requireVerifiedOwnerForDashboard();
  const hasKey = await hasValidPublishPassKey(session.sub);

  return (
    <>
      <DashboardHeader
        title="Create listing"
        backLink={{ href: ROUTES.dashboardListings, label: "Back to listings" }}
        description="Save as draft while you gather details. Owner accounts need an active PassKey to publish (company and admin accounts are exempt). Each first publish consumes one PassKey."
      />
      <Container className="max-w-3xl py-8 md:py-10">
        <PassKeyAccessGuard userRole={session.role} hasValidPassKey={hasKey}>
          <div className="mt-2">
            <ListingForm mode="create" userRole={session.role} />
          </div>
        </PassKeyAccessGuard>
      </Container>
    </>
  );
}
