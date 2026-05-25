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
import { Badge } from "@/components/ui/badge";
import {
  adminDeleteUserAction,
  adminPromoteUserToCompanyAction,
  adminSuspendUserAction,
} from "@/features/admin/actions/adminActions";
import type { UserRole } from "@/types/user";

export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  suspended: boolean;
  createdAt: string;
};

export type UsersTableProps = {
  rows: AdminUserRow[];
};

export const UsersTable = ({ rows }: UsersTableProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<AdminUserRow | null>(null);
  const [promoteTarget, setPromoteTarget] = useState<AdminUserRow | null>(null);
  const [feedback, setFeedback] = useState<{ type: "error"; text: string } | null>(null);

  const handleSuspendToggle = (row: AdminUserRow) => {
    startTransition(async () => {
      setFeedback(null);
      const res = await adminSuspendUserAction({ userId: row.id, suspend: !row.suspended });
      if (res.ok) {
        router.refresh();
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) {
      return;
    }
    const target = confirmDelete;
    startTransition(async () => {
      setFeedback(null);
      const res = await adminDeleteUserAction({ userId: target.id });
      if (res.ok) {
        setConfirmDelete(null);
        router.refresh();
      }
    });
  };

  const handleConfirmPromote = () => {
    if (!promoteTarget) {
      return;
    }
    const target = promoteTarget;
    startTransition(async () => {
      setFeedback(null);
      const res = await adminPromoteUserToCompanyAction({ userId: target.id });
      if (res.ok) {
        setPromoteTarget(null);
        router.refresh();
      } else {
        setFeedback({ type: "error", text: res.message });
        setPromoteTarget(null);
      }
    });
  };

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No users found in the database.</p>
    );
  }

  return (
    <>
      {feedback ? (
        <p className="text-destructive mb-4 text-sm" role="alert">
          {feedback.text}
        </p>
      ) : null}
      <div className="border-border overflow-x-auto rounded-2xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.email}</TableCell>
                <TableCell className="text-muted-foreground max-w-[180px] truncate text-sm">
                  {row.name || "—"}
                </TableCell>
                <TableCell className="capitalize">{row.role}</TableCell>
                <TableCell>
                  {row.suspended ? (
                    <Badge variant="destructive" className="rounded-lg">
                      Suspended
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-lg">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    {row.role === "user" ? (
                      <Button
                        type="button"
                        variant="gold"
                        size="sm"
                        className="rounded-lg"
                        disabled={pending || row.suspended}
                        onClick={() => setPromoteTarget(row)}
                        title={
                          row.suspended
                            ? "Unsuspend before granting company access"
                            : undefined
                        }
                      >
                        Make company
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={pending}
                      onClick={() => handleSuspendToggle(row)}
                    >
                      {row.suspended ? "Unsuspend" : "Suspend"}
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
            <DialogTitle>Delete user account</DialogTitle>
            <DialogDescription>
              This permanently removes{" "}
              <span className="text-foreground font-medium">{confirmDelete?.email}</span>{" "}
              and cannot be undone. The account must own zero listings.
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
              {pending ? "Deleting…" : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(promoteTarget)} onOpenChange={(o) => !o && setPromoteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant company access</DialogTitle>
            <DialogDescription>
              Promote{" "}
              <span className="text-foreground font-medium">{promoteTarget?.email}</span> to a
              company account. They can publish with company PassKey rules after their next sign-in
              (session role updates on login).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false}>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setPromoteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gold"
              className="rounded-xl"
              disabled={pending}
              onClick={handleConfirmPromote}
            >
              {pending ? "Updating…" : "Confirm company access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
