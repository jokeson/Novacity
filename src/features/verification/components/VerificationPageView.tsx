import Link from "next/link";

import { ApplicantVerificationForm } from "@/features/verification/components/ApplicantVerificationForm";
import { OwnerVerificationApprovedCelebration } from "@/features/verification/components/OwnerVerificationApprovedCelebration";
import { OwnerVerificationProgressSteps } from "@/features/verification/components/OwnerVerificationProgressSteps";
import { normalizeOwnerVerificationStatus } from "@/features/verification/utils/ownerVerificationSteps";
import { ROUTES } from "@/constants/routes";

export type VerificationPageViewProps = {
  status: string;
  rejectionReason: string;
  displayName: string;
};

export const VerificationPageView = ({
  status: rawStatus,
  rejectionReason,
  displayName,
}: VerificationPageViewProps) => {
  const status = normalizeOwnerVerificationStatus(rawStatus);
  const showForm = status === "unsubmitted" || status === "rejected";

  return (
    <div className="space-y-8">
      <OwnerVerificationProgressSteps status={status} />

      {status === "approved" ? (
        <OwnerVerificationApprovedCelebration displayName={displayName} />
      ) : null}

      {status === "pending" ? (
        <p
          className="text-muted-foreground text-sm leading-relaxed"
          role="status"
        >
          Your application is under review. You will be notified when approved.
        </p>
      ) : null}

      {status === "rejected" && rejectionReason.trim().length > 0 ? (
        <div
          className="border-destructive/30 bg-destructive/5 text-foreground rounded-2xl border px-4 py-3 text-sm leading-relaxed"
          role="status"
        >
          <p className="font-medium">Previous application was not approved.</p>
          <p className="text-muted-foreground mt-1">{rejectionReason}</p>
          <p className="text-muted-foreground mt-2">
            Update the form below and resubmit.
          </p>
        </div>
      ) : null}

      {showForm ? <ApplicantVerificationForm /> : null}

      {status === "approved" ? (
        <p className="text-muted-foreground text-center text-xs">
          Need help?{" "}
          <Link href={ROUTES.contact} className="text-primary font-medium underline-offset-4 hover:underline">
            Contact Novacity
          </Link>
        </p>
      ) : null}
    </div>
  );
};
