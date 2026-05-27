import type { SidebarProfileData } from "@/components/shared/SidebarProfileContext";
import type { SessionPayload } from "@/lib/auth/session-jwt";

export const sidebarProfileFromSession = (
  session: SessionPayload,
  options?: { forAdmin?: boolean },
): SidebarProfileData => {
  const local = session.email.split("@")[0]?.trim();
  return {
    name: local && local.length > 0 ? local : "Account",
    image: null,
    role: session.role,
    canCreateListings: options?.forAdmin ? true : session.role !== "user",
    ownerVerificationStatus: options?.forAdmin ? undefined : session.role === "user" ? "unsubmitted" : undefined,
  };
};
