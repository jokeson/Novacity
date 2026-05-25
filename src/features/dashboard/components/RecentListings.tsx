import Link from "next/link";

import { ROUTES, dashboardListingEditPath } from "@/constants/routes";
import { PropertyStatusBadge } from "@/features/properties/components/PropertyStatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardRecentListing } from "@/features/dashboard/types";

export type RecentListingsProps = {
  listings: DashboardRecentListing[];
  canCreateListings?: boolean;
};

export const RecentListings = ({
  listings,
  canCreateListings = true,
}: RecentListingsProps) => {
  const createHref = canCreateListings
    ? ROUTES.dashboardListingsCreate
    : ROUTES.dashboardVerification;
  const createLabel = canCreateListings ? "Create a listing" : "Complete verification";
  return (
    <Card className="border-border rounded-2xl border shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="font-heading text-lg">Recent listings</CardTitle>
          <CardDescription>
            Views and expiration for your latest properties.
          </CardDescription>
        </div>
        <Link
          href={ROUTES.dashboardListings}
          className="text-primary text-sm font-medium underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {listings.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No listings yet.{" "}
            <Link
              href={createHref}
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              {createLabel}
            </Link>
            .
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {listings.map((listing) => (
              <li
                key={listing.id}
                className="border-border flex flex-col gap-2 rounded-xl border bg-background/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={dashboardListingEditPath(listing.id)}
                      className="text-foreground truncate font-medium underline-offset-4 hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <PropertyStatusBadge status={listing.status} />
                  </div>
                  <p className="text-muted-foreground font-mono text-xs">
                    {listing.slug}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  <Badge variant="secondary" className="rounded-lg font-normal">
                    {listing.views.toLocaleString()} views
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {listing.expiresAt
                      ? `Expires ${new Date(listing.expiresAt).toLocaleDateString()}`
                      : "No expiry"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
