import mongoose from "mongoose";

import * as userRepository from "@/server/repositories/user.repository";
import type { UserDoc } from "@/server/models/User";
import type { UserRole } from "@/types/user";

import { normalizeEmail } from "../utils/email";

type UserWithPassword = mongoose.HydratedDocument<
  UserDoc & { passwordHash: string }
>;

export const findUserWithPasswordByEmail = async (
  email: string,
): Promise<UserWithPassword | null> => {
  const normalized = normalizeEmail(email);
  return userRepository.findUserWithPasswordByEmail(normalized);
};

export const findUserByEmail = async (
  email: string,
): Promise<mongoose.HydratedDocument<UserDoc> | null> => {
  return userRepository.findUserByEmail(normalizeEmail(email));
};

export const createUserRecord = async (input: {
  email: string;
  passwordHash: string;
  name?: string;
  role: UserRole;
}): Promise<mongoose.HydratedDocument<UserDoc>> => {
  return userRepository.createUser({
    ...input,
    email: normalizeEmail(input.email),
  });
};

export const isMongoDuplicateKeyError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && (error as { code?: number }).code === 11000;
};
