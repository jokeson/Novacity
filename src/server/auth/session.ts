import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import {
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
  type SessionPayload,
  signSessionToken,
  verifySessionToken,
} from "@/lib/auth/session-jwt";
import { isUserSuspended } from "@/server/queries/user.queries";

import { roleCanAccessAdmin, roleCanAccessDashboard } from "./permissions";

export const setSessionCookie = async (payload: SessionPayload): Promise<void> => {
  const token = await signSessionToken(payload);
  const jar = await cookies();

  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
};

export const clearSessionCookie = async (): Promise<void> => {
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};

export const getSession = async (): Promise<SessionPayload | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
};

export const redirectToSignIn = (callbackPath: string): never => {
  const query = callbackPath.startsWith("/")
    ? `?callbackUrl=${encodeURIComponent(callbackPath)}`
    : "";
  redirect(`${ROUTES.signIn}${query}`);
};

export const requireSessionForDashboard = async (): Promise<SessionPayload> => {
  const session = await getSession();

  if (!session || !roleCanAccessDashboard(session.role)) {
    redirectToSignIn(ROUTES.dashboard);
  }

  const authed = session as SessionPayload;
  if (await isUserSuspended(authed.sub)) {
    await clearSessionCookie();
    redirectToSignIn(ROUTES.dashboard);
  }

  return authed;
};

export const requireSessionForAdmin = async (): Promise<SessionPayload> => {
  const session = await getSession();

  if (!session) {
    redirectToSignIn(ROUTES.admin);
  }

  const authed = session as SessionPayload;

  if (!roleCanAccessAdmin(authed.role)) {
    redirect(ROUTES.dashboard);
  }

  if (await isUserSuspended(authed.sub)) {
    await clearSessionCookie();
    redirectToSignIn(ROUTES.admin);
  }

  return authed;
};

export const sanitizeCallbackPath = (raw: unknown): string => {
  if (typeof raw !== "string") {
    return ROUTES.dashboard;
  }

  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return ROUTES.dashboard;
  }

  if (raw.startsWith("/sign-in") || raw.startsWith("/sign-up")) {
    return ROUTES.dashboard;
  }

  return raw;
};
