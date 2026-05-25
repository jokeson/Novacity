export type OwnerVerificationUiStatus =
  | "unsubmitted"
  | "pending"
  | "approved"
  | "rejected";

export type VerificationStepKey = "form" | "submitted" | "approved";

export type VerificationStepDefinition = {
  key: VerificationStepKey;
  stepNumber: number;
  /** Compact label for horizontal stepper. */
  shortTitle: string;
};

export const VERIFICATION_PROGRESS_STEPS: VerificationStepDefinition[] = [
  { key: "form", stepNumber: 1, shortTitle: "Fill form" },
  { key: "submitted", stepNumber: 2, shortTitle: "Submitted" },
  { key: "approved", stepNumber: 3, shortTitle: "Approved" },
];

export const normalizeOwnerVerificationStatus = (
  raw: string | undefined | null,
): OwnerVerificationUiStatus => {
  if (raw === "pending" || raw === "approved" || raw === "rejected") {
    return raw;
  }
  return "unsubmitted";
};

export type VerificationStepVisualState =
  | "upcoming"
  | "active"
  | "complete"
  | "disabled";

export const resolveVerificationStepState = (
  status: OwnerVerificationUiStatus,
  stepKey: VerificationStepKey,
): VerificationStepVisualState => {
  if (stepKey === "form") {
    if (status === "unsubmitted" || status === "rejected") {
      return "active";
    }
    return "complete";
  }

  if (stepKey === "submitted") {
    if (status === "pending" || status === "approved") {
      return "complete";
    }
    return "upcoming";
  }

  if (status === "approved") {
    return "complete";
  }

  return "disabled";
};

export const stepShowsCheckIcon = (
  state: VerificationStepVisualState,
): boolean => state === "complete";
