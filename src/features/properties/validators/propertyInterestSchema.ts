import { z } from "zod";

export const propertyInterestSchema = z.object({
  propertyId: z.string().min(1),
  ownerId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
});

export type PropertyInterestInput = z.infer<typeof propertyInterestSchema>;
