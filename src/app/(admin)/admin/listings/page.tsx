import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import {
  ListingsTable,
  type AdminListingRow,
} from "@/features/admin/components/ListingsTable";
import { buttonVariants } from "@/components/ui/button";
import { findUsersByIdsLean } from "@/server/queries/user.queries";
import { listPropertiesForAdmin } from "@/server/repositories/property.repository";
import type { ListingCurrency } from "@/types/property";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Listings — Admin",
};

export default async function AdminListingsPage() {
  const properties = await listPropertiesForAdmin(200);
  const ownerIds = [
    ...new Set(properties.map((p) => String(p.ownerId)).filter(Boolean)),
  ];
  const owners = await findUsersByIdsLean(ownerIds);
  const emailByOwner = new Map(
    owners.map((o) => [String(o._id), typeof o.email === "string" ? o.email : ""]),
  );

  const rows: AdminListingRow[] = properties.map((p) => ({
    id: String(p._id),
    title: String(p.title),
    slug: String(p.slug),
    status: p.status,
    price: typeof p.price === "number" ? p.price : 0,
    currency: (p.currency as ListingCurrency | undefined) ?? "USD",
    isFeatured: Boolean(p.isFeatured),
    ownerEmail: emailByOwner.get(String(p.ownerId)) ?? null,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : "",
  }));

  return (
    <>
      <AdminHeader
        title="Listings"
        description="Moderate the catalog: toggle featured placement, open the editor as an admin, or delete abusive records."
        backLink={{ href: ROUTES.admin, label: "Overview" }}
        actions={
          <Link
            href={ROUTES.dashboardListingsCreate}
            className={cn(buttonVariants({ variant: "gold" }), "rounded-xl")}
          >
            Create listing (admin)
          </Link>
        }
      />
      <Container className="py-8 md:py-10">
        <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-relaxed">
          Company-quality listings can be authored from the dashboard; admins skip PassKey
          checks when publishing.
        </p>
        <ListingsTable rows={rows} />
      </Container>
    </>
  );
}
