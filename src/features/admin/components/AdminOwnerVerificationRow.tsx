"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  adminApproveOwnerVerificationAction,
  adminRejectOwnerVerificationAction,
} from "@/features/admin/actions/ownerVerificationAdminActions";
import type {
  ApplicantNationality,
  OwnerIdDocumentType,
  OwnerVerificationApplicationStatus,
} from "@/types/ownerVerification";
import { formatPersonName } from "@/lib/formatPersonName";

const nationalityLabels: Record<ApplicantNationality, string> = {
  "south-sudanese": "South Sudanese",
  international: "Non–South Sudanese",
};

const idTypeLabels: Record<OwnerIdDocumentType, string> = {
  national_id: "National ID",
  drivers_license: "Driver license",
  passport: "Passport",
};

const statusBadgeTone = (
  status: OwnerVerificationApplicationStatus,
): "success" | "danger" | "warning" => {
  if (status === "approved") {
    return "success";
  }
  if (status === "rejected") {
    return "danger";
  }
  return "warning";
};

export type AdminOwnerVerificationRowProps = {
  applicationId: string;
  applicationStatus: OwnerVerificationApplicationStatus;
  applicantEmail: string;
  applicantName: string;
  fullName: string;
  phone: string;
  residentialAddress: string;
  postingState: string;
  applicantNationality: ApplicantNationality;
  idDocumentType: OwnerIdDocumentType;
  idDocumentUrl: string;
  rejectionReason: string;
};

export const AdminOwnerVerificationRow = ({
  applicationId,
  applicationStatus,
  applicantEmail,
  applicantName,
  fullName,
  phone,
  residentialAddress,
  postingState,
  applicantNationality,
  idDocumentType,
  idDocumentUrl,
  rejectionReason,
}: AdminOwnerVerificationRowProps) => {
  const formattedFullName = formatPersonName(fullName);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectReason, setRejectReason] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const handleApproveConfirm = (): void => {
    startTransition(async () => {
      const res = await adminApproveOwnerVerificationAction({ applicationId });
      if (!res.ok) {
        window.alert(res.message);
        return;
      }
      setApproveOpen(false);
      router.refresh();
    });
  };

  const handleRejectConfirm = (): void => {
    const reason = rejectReason.trim();
    if (reason.length < 3) {
      return;
    }
    startTransition(async () => {
      const res = await adminRejectOwnerVerificationAction({ applicationId, reason });
      if (!res.ok) {
        window.alert(res.message);
        return;
      }
      setRejectOpen(false);
      setRejectReason("");
      router.refresh();
    });
  };

  const readOnly = applicationStatus !== "pending";

  return (
    <tr className="border-border border-b align-top last:border-b-0">
      <td className="text-foreground px-3 py-3 text-sm">
        <div className="font-medium">{applicantEmail}</div>
        <div className="text-muted-foreground text-xs">{applicantName}</div>
      </td>
      <td className="text-muted-foreground px-3 py-3 text-sm">
        <div className="text-foreground font-medium">{formattedFullName}</div>
        <div>{phone}</div>
        <div className="mt-1 max-w-xs leading-snug">{residentialAddress}</div>
        <div className="text-foreground mt-1">State: {postingState}</div>
        <div className="mt-1 text-xs">
          {nationalityLabels[applicantNationality]} · {idTypeLabels[idDocumentType]}
        </div>
      </td>
      <td className="px-3 py-3 text-sm">
        <a
          href={idDocumentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          View ID
        </a>
      </td>
      <td className="px-3 py-3 text-sm">
        <StatusBadge tone={statusBadgeTone(applicationStatus)}>
          {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
        </StatusBadge>
        {applicationStatus === "rejected" && rejectionReason.trim().length > 0 ? (
          <p className="text-muted-foreground mt-2 max-w-[14rem] text-xs leading-relaxed">
            {rejectionReason}
          </p>
        ) : null}
      </td>
      <td className="px-3 py-3">
        {readOnly ? (
          <span className="text-muted-foreground text-sm">—</span>
        ) : (
          <div className="flex max-w-xs flex-col gap-2">
            <Button
              type="button"
              variant="gold"
              size="sm"
              className="rounded-lg"
              disabled={pending}
              onClick={() => setApproveOpen(true)}
            >
              Approve
            </Button>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason (required to reject)"
              rows={2}
              className="rounded-lg text-sm"
              aria-label="Rejection reason"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-lg"
              disabled={pending || rejectReason.trim().length < 3}
              onClick={() => setRejectOpen(true)}
            >
              Reject
            </Button>
          </div>
        )}
        <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
          <DialogContent showCloseButton className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Approve owner verification?</DialogTitle>
              <DialogDescription>
                This unlocks listing creation and publish flows for{" "}
                <span className="text-foreground font-medium">{applicantEmail}</span> (PassKey
                rules still apply for independent owners).
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                disabled={pending}
                onClick={() => setApproveOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="gold"
                className="rounded-lg"
                disabled={pending}
                onClick={handleApproveConfirm}
              >
                {pending ? "Approving…" : "Confirm approve"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogContent showCloseButton className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject application?</DialogTitle>
              <DialogDescription>
                The applicant will see your reason and can submit a new application later.
              </DialogDescription>
            </DialogHeader>
            <p className="bg-muted/60 text-foreground rounded-lg border px-3 py-2 text-sm">
              {rejectReason.trim()}
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                disabled={pending}
                onClick={() => setRejectOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-lg"
                disabled={pending || rejectReason.trim().length < 3}
                onClick={handleRejectConfirm}
              >
                {pending ? "Rejecting…" : "Confirm reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
};
