import Link from "next/link";

import { ROUTES, dashboardListingEditPath } from "@/constants/routes";
import { PropertyStatusBadge } from "@/features/properties/components/PropertyStatusBadge";
import { PriceText } from "@/components/shared/PriceText";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ListingCurrency, PropertyStatus } from "@/types/property";

import { ListingActions } from "./ListingActions";

export type ListingTableRow = {
  id: string;
  title: string;
  slug: string;
  status: PropertyStatus;
  price: number;
  currency: ListingCurrency;
  propertyType: string;
  views: number;
  expiresAt: string | null;
  updatedAt: string;
};

export type ListingTableProps = {
  rows: ListingTableRow[];
  canCreateListings?: boolean;
};

export const ListingTable = ({
  rows,
  canCreateListings = true,
}: ListingTableProps) => {
  const createHref = canCreateListings
    ? ROUTES.dashboardListingsCreate
    : ROUTES.dashboardVerification;
  const createLabel = canCreateListings
    ? "Create your first listing"
    : "Complete owner verification";

  if (rows.length === 0) {
    return (
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
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="max-w-[220px]">
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={dashboardListingEditPath(row.id)}
                    className="text-foreground font-medium underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </Link>
                  <span className="text-muted-foreground truncate font-mono text-xs">
                    {row.slug}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <PropertyStatusBadge status={row.status} />
              </TableCell>
              <TableCell className="capitalize">{row.propertyType}</TableCell>
              <TableCell className="text-right">
                <PriceText
                  amount={row.price}
                  listingCurrency={row.currency}
                  className="text-base font-semibold md:text-lg"
                />
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm tabular-nums">
                {row.views.toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {row.expiresAt
                  ? new Date(row.expiresAt).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <ListingActions listingId={row.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
