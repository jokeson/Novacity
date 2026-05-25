"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PriceText } from "@/components/shared/PriceText";
import {
  adminDeletePropertyAction,
  adminTogglePropertyFeaturedAction,
} from "@/features/admin/actions/adminActions";
import { propertyDetailPath, dashboardListingEditPath } from "@/constants/routes";
import { PropertyStatusBadge } from "@/features/properties/components/PropertyStatusBadge";
import type { ListingCurrency, PropertyStatus } from "@/types/property";

export type AdminListingRow = {
  id: string;
  title: string;
  slug: string;
  status: PropertyStatus;
  price: number;
  currency: ListingCurrency;
  isFeatured: boolean;
  ownerEmail: string | null;
  updatedAt: string;
};

export type ListingsTableProps = {
  rows: AdminListingRow[];
};

export const ListingsTable = ({ rows }: ListingsTableProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<AdminListingRow | null>(null);

  const handleToggleFeatured = (row: AdminListingRow) => {
    startTransition(async () => {
      await adminTogglePropertyFeaturedAction({ propertyId: row.id });
      router.refresh();
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) {
      return;
    }
    const target = confirmDelete;
    startTransition(async () => {
      const res = await adminDeletePropertyAction({ propertyId: target.id });
      if (res.ok) {
        setConfirmDelete(null);
        router.refresh();
      }
    });
  };

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No listings found in the database.</p>
    );
  }

  return (
    <>
      <div className="border-border overflow-x-auto rounded-2xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="max-w-[220px]">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={propertyDetailPath(row.slug)}
                      className="text-foreground font-medium underline-offset-4 hover:underline"
                    >
                      {row.title}
                    </Link>
                    <span className="text-muted-foreground font-mono text-xs">{row.slug}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <PropertyStatusBadge status={row.status} />
                </TableCell>
                <TableCell className="text-right">
                  <PriceText
                    amount={row.price}
                    listingCurrency={row.currency}
                    className="text-base font-semibold"
                  />
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[160px] truncate text-sm">
                  {row.ownerEmail ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(row.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    {row.isFeatured ? (
                      <Badge className="rounded-lg">Featured</Badge>
                    ) : null}
                    <Link
                      href={dashboardListingEditPath(row.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-lg",
                      )}
                    >
                      Edit
                    </Link>
                    <Button
                      type="button"
                      variant={row.isFeatured ? "outline" : "gold"}
                      size="sm"
                      className="rounded-lg"
                      disabled={pending}
                      onClick={() => handleToggleFeatured(row)}
                    >
                      {row.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-lg"
                      disabled={pending}
                      onClick={() => setConfirmDelete(row)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete listing</DialogTitle>
            <DialogDescription>
              Permanently remove{" "}
              <span className="text-foreground font-medium">{confirmDelete?.title}</span>{" "}
              from the marketplace. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false}>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={pending}
              onClick={handleConfirmDelete}
            >
              {pending ? "Deleting…" : "Delete listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
