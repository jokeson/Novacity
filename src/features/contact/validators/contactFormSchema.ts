import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(40).default(""),
  subject: z.string().trim().min(2, "Add a short subject.").max(200),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters).").max(5000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
