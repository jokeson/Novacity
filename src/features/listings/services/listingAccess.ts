import mongoose from "mongoose";

import type { UserRole } from "@/types/user";

export const canManageListing = (
  ownerId: mongoose.Types.ObjectId | string,
  sub: string,
  role: UserRole,
): boolean => {
  if (role === "admin") {
    return true;
  }
  return String(ownerId) === sub;
};
