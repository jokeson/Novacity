"use client";

import { createContext, useContext } from "react";

export type SidebarCollapseContextValue = {
  isOpen: boolean;
  toggle: () => void;
};

const SidebarCollapseContext = createContext<SidebarCollapseContextValue | null>(null);

export const SidebarCollapseProvider = SidebarCollapseContext.Provider;

export const useSidebarCollapse = (): SidebarCollapseContextValue | null =>
  useContext(SidebarCollapseContext);
