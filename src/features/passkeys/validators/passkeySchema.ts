import { z } from "zod";

export const passKeyRedeemSchema = z.object({
  code: z
    .string()
    .min(8, "Enter the full PassKey code.")
    .max(64)
    .transform((s) => s.trim()),
});

export type PassKeyRedeemInput = z.infer<typeof passKeyRedeemSchema>;

export const adminPassKeyIssueSchema = z
  .object({
    assignEmail: z.string().trim().default(""),
    durationDays: z.coerce.number().int().min(1).max(3650),
    customCode: z.string().trim().max(64).optional().default(""),
    quantity: z.coerce.number().int().min(1).max(100).default(1),
  })
  .superRefine((data, ctx) => {
    if (data.quantity > 1 && data.customCode.trim().length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customCode"],
        message: "Custom codes apply to single issues only. Clear it or set quantity to 1.",
      });
    }
  });

export type AdminPassKeyIssueInput = z.infer<typeof adminPassKeyIssueSchema>;
