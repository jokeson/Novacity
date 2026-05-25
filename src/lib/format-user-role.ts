import type { UserRole } from "@/types/user";

export const formatUserRoleLabel = (role: UserRole): string => {
  if (role === "admin") {
    return "Administrator";
  }
  if (role === "company") {
    return "Company";
  }
  return "Individual";
};
