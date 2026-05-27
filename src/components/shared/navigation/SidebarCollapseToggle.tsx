"use client";

import { PanelLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { sidebarAsideCollapseToggleClassName } from "@/components/shared/navigation/sidebarNavStyles";
import { useSidebarCollapse } from "@/components/shared/navigation/SidebarCollapseContext";
import { cn } from "@/lib/utils";

export type SidebarCollapseToggleProps = {
  className?: string;
};

export const SidebarCollapseToggle = ({ className }: SidebarCollapseToggleProps) => {
  const collapse = useSidebarCollapse();

  if (!collapse) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={collapse.toggle}
      className={cn(
        buttonVariants({
          variant: "outline",
          size: "icon",
          className:
            "relative shrink-0 cursor-pointer rounded-xl shadow-sm transition-all duration-300",
        }),
        sidebarAsideCollapseToggleClassName,
        className,
      )}
      aria-label={collapse.isOpen ? "Close sidebar" : "Open sidebar"}
      aria-expanded={collapse.isOpen}
    >
      <PanelLeft className="size-4" aria-hidden />
    </button>
  );
};
