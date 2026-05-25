"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
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
import {
  adminActivatePassKeyAction,
  adminDeactivatePassKeyAction,
  adminDeletePassKeyAction,
  adminExpirePassKeyAction,
} from "@/features/passkeys/actions/passkeyActions";

export type AdminPassKeyRow = {
  id: string;
  code: string;
  assigneeEmail: string | null;
  duration: number;
  isActive: boolean;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export type AdminPassKeysTableProps = {
  rows: AdminPassKeyRow[];
};

export const AdminPassKeysTable = ({ rows }: AdminPassKeysTableProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<AdminPassKeyRow | null>(null);

  const handleDeactivate = (id: string) => {
    startTransition(async () => {
      await adminDeactivatePassKeyAction(id);
      router.refresh();
    });
  };

  const handleActivate = (id: string) => {
    startTransition(async () => {
      await adminActivatePassKeyAction(id);
      router.refresh();
    });
  };

  const handleExpire = (id: string) => {
    startTransition(async () => {
      await adminExpirePassKeyAction(id);
      router.refresh();
    });
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    startTransition(async () => {
      const res = await adminDeletePassKeyAction(id);
      if (res.ok) {
        setDeleteTarget(null);
        router.refresh();
      }
    });
  };

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No PassKeys yet. Issue one using the form above.
      </p>
    );
  }

  return (
    <>
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Delete PassKey?</DialogTitle>
            <DialogDescription>
              This permanently removes the key from the database. Only keys that have never been
              consumed for a publish can be deleted.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget ? (
            <p className="text-muted-foreground font-mono text-sm tracking-wide">
              {deleteTarget.code}
            </p>
          ) : null}
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer rounded-xl"
              disabled={pending}
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer rounded-xl"
              disabled={pending}
              onClick={handleConfirmDelete}
            >
              Delete key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="border-border overflow-x-auto rounded-2xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const now = new Date();
            const expired = new Date(row.expiresAt) <= now;
            const used = Boolean(row.usedAt);
            return (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs tracking-wide">
                  {row.code}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate text-sm">
                  {row.assigneeEmail ?? "— (pool)"}
                </TableCell>
                <TableCell>{row.duration}d</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(row.expiresAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {row.usedAt ? new Date(row.usedAt).toLocaleString() : "—"}
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {!row.isActive
                    ? "inactive"
                    : expired
                      ? "expired"
                      : used
                        ? "used"
                        : "active"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    {row.isActive && !expired ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        disabled={pending}
                        onClick={() => handleDeactivate(row.id)}
                      >
                        Deactivate
                      </Button>
                    ) : null}
                    {!row.isActive && !expired && !used ? (
                      <Button
                        type="button"
                        variant="gold"
                        size="sm"
                        className="rounded-lg"
                        disabled={pending}
                        onClick={() => handleActivate(row.id)}
                      >
                        Activate
                      </Button>
                    ) : null}
                    {!expired && !used ? (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer rounded-lg"
                        disabled={pending}
                        onClick={() => handleExpire(row.id)}
                      >
                        Expire now
                      </Button>
                    ) : null}
                    {!used ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="cursor-pointer rounded-lg"
                        disabled={pending}
                        onClick={() => setDeleteTarget(row)}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
    </>
  );
};
