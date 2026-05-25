import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import {
  ListingTable,
  type ListingTableRow,
} from "@/features/listings/components/ListingTable";
import { cn } from "@/lib/utils";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import { getUserSidebarProfileById } from "@/server/queries/user.queries";
import { listPropertiesByOwner } from "@/server/queries/property.queries";

export const metadata = {
  title: "My listings",
};

export default async function DashboardListingsPage() {
  const session = await requireVerifiedOwnerForDashboard();
  const profile = await getUserSidebarProfileById(session.sub);
  const canCreateListings = profile?.canCreateListings ?? session.role !== "user";
  const docs = await listPropertiesByOwner(session.sub);
  const rows: ListingTableRow[] = docs.map((doc) => ({
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    status: doc.status,
    price: doc.price,
    currency: doc.currency ?? "USD",
    propertyType: doc.propertyType,
    views: typeof doc.views === "number" ? doc.views : 0,
    expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : "",
  }));

  return (
    <>
      <DashboardHeader
        title="Listings"
        backLink={{ href: ROUTES.dashboard, label: "Back to dashboard" }}
        description="Create, publish, and manage your properties. Publishing beyond draft requires an active PassKey unless you are an admin."
        actions={
          <Link
            href={
              canCreateListings
                ? ROUTES.dashboardListingsCreate
                : ROUTES.dashboardVerification
            }
            className={cn(buttonVariants({ variant: "gold" }))}
            aria-label={
              canCreateListings
                ? "Create a new listing"
                : "Complete owner verification to create listings"
            }
          >
            {canCreateListings ? "New listing" : "Verify to list"}
          </Link>
        }
      />
      <Container className="py-10">
        <ListingTable rows={rows} canCreateListings={canCreateListings} />
      </Container>
    </>
  );
}
