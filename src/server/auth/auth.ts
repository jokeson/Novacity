import type { HydratedDocument } from "mongoose";

import type { UserDoc } from "@/server/models/User";
import type { UserRole } from "@/types/user";
import {
  createUserRecord,
  findUserWithPasswordByEmail,
  isMongoDuplicateKeyError,
} from "@/features/auth/services/user.service";

import { hashPassword, verifyPasswordHash } from "./password";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

export type RegisterUserSuccess = { ok: true; user: AuthUser };
export type RegisterUserFailure = { ok: false; message: string };

export type RegisterUserInput = {
  email: string;
  password: string;
  name?: string;
};

/** Public registration always creates `role: "user"`. Company and admin roles are assigned elsewhere. */
export const registerUser = async (
  input: RegisterUserInput,
): Promise<RegisterUserSuccess | RegisterUserFailure> => {
  const role: UserRole = "user";
  const passwordHash = await hashPassword(input.password);

  try {
    const createdUnknown = await createUserRecord({
      email: input.email,
      passwordHash,
      name: input.name,
      role,
    });
    const created = createdUnknown as HydratedDocument<UserDoc>;

    return {
      ok: true,
      user: {
        id: created._id.toString(),
        email: `${created.email}`,
        role: created.role as UserRole,
        name: typeof created.name === "string" ? created.name : "",
      },
    };
  } catch (error) {
    if (isMongoDuplicateKeyError(error)) {
      return { ok: false, message: "An account already exists for this email." };
    }

    throw error;
  }
};

export type VerifyCredentialsSuccess = { ok: true; user: AuthUser };
export type VerifyCredentialsFailure = { ok: false; message: string };

export const verifyUserCredentials = async (
  email: string,
  plainPassword: string,
): Promise<VerifyCredentialsSuccess | VerifyCredentialsFailure> => {
  const userUnknown = await findUserWithPasswordByEmail(email);
  const user = userUnknown as
    | (HydratedDocument<UserDoc> & { passwordHash: string })
    | null;

  if (!user?.passwordHash) {
    return {
      ok: false,
      message: "We could not verify that email and password combination.",
    };
  }

  const valid = await verifyPasswordHash(plainPassword, user.passwordHash);

  if (!valid) {
    return {
      ok: false,
      message: "We could not verify that email and password combination.",
    };
  }

  if (user.suspendedAt) {
    return {
      ok: false,
      message: "This account has been suspended. Contact support if you need help.",
    };
  }

  return {
    ok: true,
    user: {
      id: user._id.toString(),
      email: `${user.email}`,
      role: user.role as UserRole,
      name: typeof user.name === "string" ? user.name : "",
    },
  };
};
