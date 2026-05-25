import { z } from "zod";

import { SOUTH_SUDAN_STATE_OPTIONS } from "@/constants/southSudanStates";

const isPostingState = (v: string): boolean =>
  SOUTH_SUDAN_STATE_OPTIONS.some((o) => o.value === v);

export const ownerVerificationSubmitSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  residentialAddress: z.string().trim().min(4).max(500),
  postingState: z.string().trim().refine(isPostingState, "Select a valid state."),
  applicantNationality: z.enum(["south-sudanese", "international"]),
  idDocumentType: z.enum(["national_id", "drivers_license", "passport"]),
  idDocumentUrl: z
    .string()
    .trim()
    .min(1, "Please upload your identification document (JPEG, PNG, WebP, GIF, or PDF — max 10 MB).")
    .max(2000)
    .refine(
      (v) => v.startsWith("https://") || v.startsWith("http://") || v.startsWith("/"),
      "Invalid document URL.",
    ),
});

export type OwnerVerificationSubmitInput = z.infer<typeof ownerVerificationSubmitSchema>;
