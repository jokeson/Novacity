import type { UserRole } from "@/types/user";

export type PermissionZone = "dashboard" | "admin";

const dashboardRoles: readonly UserRole[] = ["user", "company", "admin"];

export const roleCanAccessDashboard = (role: UserRole): boolean => {
  return dashboardRoles.includes(role);
};

export const roleCanAccessAdmin = (role: UserRole): boolean => {
  return role === "admin";
};

export const assertZoneForRole = (
  role: UserRole,
  zone: PermissionZone,
): void => {
  if (zone === "dashboard" && !roleCanAccessDashboard(role)) {
    throw new Error("This account cannot access the dashboard.");
  }

  if (zone === "admin" && !roleCanAccessAdmin(role)) {
    throw new Error("This account cannot access the admin console.");
  }
};
