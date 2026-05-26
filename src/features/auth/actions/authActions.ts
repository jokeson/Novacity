"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { ZodError } from "zod";

import { ROUTES } from "@/constants/routes";
import { formatPersonName } from "@/lib/formatPersonName";
import { checkRateLimit } from "@/lib/rate-limit";
import { registerUser, verifyUserCredentials } from "@/server/auth/auth";
import {
  clearSessionCookie,
  sanitizeCallbackPath,
  setSessionCookie,
} from "@/server/auth/session";

import type { SignInInput, SignUpInput } from "../validators/authSchema";
import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../validators/authSchema";

export type MutationError = {
  ok: false;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export type SignUpMutationSuccess = { ok: true; email: string };
export type SignInMutationSuccess = { ok: true; redirectTo: string };

const flattenFieldErrors = (error: ZodError): Record<string, string[]> => {
  return error.flatten().fieldErrors as Record<string, string[]>;
};

const authRateLimitKey = async (bucket: string): Promise<string> => {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]?.trim() ?? "unknown"
    : h.get("x-real-ip") ?? "unknown";
  return `auth:${ip}:${bucket}`;
};

export const signInMutation = async (
  input: SignInInput,
  callbackRaw?: unknown,
): Promise<MutationError | SignInMutationSuccess> => {
  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const signInLimit = checkRateLimit(
    await authRateLimitKey("sign-in"),
    30,
    15 * 60 * 1000,
  );
  if (!signInLimit.ok) {
    return {
      ok: false,
      message: "Too many sign-in attempts. Try again in a few minutes.",
    };
  }

  const auth = await verifyUserCredentials(parsed.data.email, parsed.data.password);

  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  await setSessionCookie({
    sub: auth.user.id,
    email: auth.user.email,
    role: auth.user.role,
  });

  let target = sanitizeCallbackPath(callbackRaw);

  if (target.startsWith(ROUTES.admin) && auth.user.role !== "admin") {
    target = ROUTES.dashboard;
  }

  return { ok: true, redirectTo: target };
};

export const signUpMutation = async (
  input: SignUpInput,
): Promise<MutationError | SignUpMutationSuccess> => {
  const parsed = signUpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const signUpLimit = checkRateLimit(
    await authRateLimitKey("sign-up"),
    12,
    60 * 60 * 1000,
  );
  if (!signUpLimit.ok) {
    return {
      ok: false,
      message: "Too many account creations from this network. Try again later.",
    };
  }

  const rawName = parsed.data.name?.trim() ?? "";
  const created = await registerUser({
    email: parsed.data.email,
    password: parsed.data.password,
    name: rawName ? formatPersonName(rawName) : parsed.data.name,
  });

  if (!created.ok) {
    return { ok: false, message: created.message };
  }

  return { ok: true, email: created.user.email };
};

export type ForgotMutationResult =
  | { ok: true; message: string }
  | MutationError;

export const forgotPasswordMutation = async (
  email: unknown,
): Promise<ForgotMutationResult> => {
  const parsed = forgotPasswordSchema.safeParse({ email });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const forgotLimit = checkRateLimit(
    await authRateLimitKey("forgot-password"),
    10,
    60 * 60 * 1000,
  );
  if (!forgotLimit.ok) {
    return {
      ok: false,
      message: "Too many recovery requests. Try again later.",
    };
  }

  return {
    ok: true,
    message:
      "If we find an account for that email, we will send recovery instructions shortly.",
  };
};

export const signOutMutation = async (): Promise<void> => {
  await clearSessionCookie();
  redirect(ROUTES.home);
};
