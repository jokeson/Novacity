import { SignJWT, jwtVerify } from "jose";

import type { UserRole } from "@/types/user";

import {
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
} from "./session-constants";

export type SessionPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

export { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE_SECONDS };

const resolveSecretKey = (): Uint8Array | null => {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 24) {
    return null;
  }
  return new TextEncoder().encode(secret);
};

export const signSessionToken = async (
  payload: SessionPayload,
): Promise<string> => {
  const key = resolveSecretKey();
  if (!key) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set AUTH_SECRET (24+ chars) in your environment.",
    );
  }

  return new SignJWT({
    sub: payload.sub,
    role: payload.role,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_COOKIE_MAX_AGE_SECONDS}s`)
    .sign(key);
};

export const verifySessionToken = async (
  token: string,
): Promise<SessionPayload | null> => {
  const key = resolveSecretKey();
  if (!key) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const roleRaw = typeof payload.role === "string" ? payload.role : null;

    if (
      !sub ||
      !email ||
      (roleRaw !== "user" && roleRaw !== "admin" && roleRaw !== "company")
    ) {
      return null;
    }

    const role = roleRaw as UserRole;

    return { sub, role, email };
  } catch {
    return null;
  }
};
