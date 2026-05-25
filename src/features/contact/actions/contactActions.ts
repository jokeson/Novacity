"use server";

import { headers } from "next/headers";

import { checkRateLimit } from "@/lib/rate-limit";
import { contactFormSchema } from "@/features/contact/validators/contactFormSchema";
import { createContactInquiry } from "@/server/repositories/contactInquiry.repository";

export type ContactMutationResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[] | undefined> };

const contactRateLimitKey = async (): Promise<string> => {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]?.trim() ?? "unknown"
    : h.get("x-real-ip") ?? "unknown";
  return `contact:${ip}`;
};

export const submitContactInquiryAction = async (
  raw: unknown,
): Promise<ContactMutationResult> => {
  const limit = checkRateLimit(await contactRateLimitKey(), 8, 60 * 60 * 1000);
  if (!limit.ok) {
    return {
      ok: false,
      message: "Too many messages from this network. Please try again later.",
    };
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createContactInquiry({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
  } catch {
    return {
      ok: false,
      message: "We could not save your message. Please try again in a moment.",
    };
  }

  return { ok: true };
};
