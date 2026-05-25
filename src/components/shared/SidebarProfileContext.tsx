"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { UserRole } from "@/types/user";

export type SidebarProfileData = {
  name: string;
  image: string | null;
  role: UserRole;
  /** When `false`, individual owners should complete `/dashboard/verification` before creating listings. */
  canCreateListings?: boolean;
  ownerVerificationStatus?: string;
};

const SidebarProfileContext = createContext<SidebarProfileData | null>(null);

export const SidebarProfileProvider = ({
  value,
  children,
}: {
  value: SidebarProfileData;
  children: ReactNode;
}) => (
  <SidebarProfileContext.Provider value={value}>{children}</SidebarProfileContext.Provider>
);

export const useSidebarProfile = (): SidebarProfileData | null =>
  useContext(SidebarProfileContext);
