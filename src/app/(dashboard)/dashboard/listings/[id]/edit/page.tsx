import { notFound } from "next/navigation";

import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { PassKeyAccessGuard } from "@/features/passkeys/components/PassKeyAccessGuard";
import { ListingForm } from "@/features/listings/components/ListingForm";
import { canManageListing } from "@/features/listings/services/listingAccess";
import { toListingFormDefaults } from "@/features/listings/utils/listingDefaults";
import { ROUTES } from "@/constants/routes";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import { findPropertyById } from "@/server/repositories/property.repository";
import { hasValidPublishPassKey } from "@/server/services/passkey.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Edit listing",
};

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireVerifiedOwnerForDashboard();
  const property = await findPropertyById(id);

  if (!property) {
    notFound();
  }

  if (!canManageListing(property.ownerId, session.sub, session.role)) {
    notFound();
  }

  const defaults = toListingFormDefaults(
    property.toObject({ depopulate: true }),
  );

  const hasKey = await hasValidPublishPassKey(session.sub);

  return (
    <>
      <DashboardHeader
        title="Edit listing"
        backLink={{ href: ROUTES.dashboardListings, label: "Back to listings" }}
        description={
          <>
            Slug stays fixed for this record:{" "}
            <span className="text-foreground font-mono text-xs">{property.slug}</span>
          </>
        }
      />
      <Container className="max-w-3xl py-8 md:py-10">
        <PassKeyAccessGuard userRole={session.role} hasValidPassKey={hasKey}>
          <div className="mt-2">
            <ListingForm
              mode="edit"
              listingId={id}
              defaultValues={defaults}
              userRole={session.role}
            />
          </div>
        </PassKeyAccessGuard>
      </Container>
    </>
  );
}
