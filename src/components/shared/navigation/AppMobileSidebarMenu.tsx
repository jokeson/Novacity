"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { AdminNavLinks } from "@/features/admin/components/AdminNavLinks";
import { DashboardNavLinks } from "@/features/dashboard/components/DashboardNavLinks";
import { MobileSidebarSheet } from "@/components/shared/navigation/MobileSidebarSheet";
import { SidebarListPropertyCta } from "@/components/shared/navigation/SidebarListPropertyCta";
import { buttonVariants } from "@/components/ui/button";
import type { AppSidebarKind } from "@/lib/app-shell-routes";
import { cn } from "@/lib/utils";

export type AppMobileSidebarMenuProps = {
  sidebarKind: Exclude<AppSidebarKind, "none">;
  className?: string;
};

export const AppMobileSidebarMenu = ({
  sidebarKind,
  className,
}: AppMobileSidebarMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleNavigate = (): void => {
    setOpen(false);
  };

  const title = sidebarKind === "admin" ? "Admin menu" : "Dashboard menu";
  const triggerLabel =
    sidebarKind === "admin" ? "Open admin menu" : "Open dashboard menu";

  const footer =
    sidebarKind === "dashboard" ? (
      <SidebarListPropertyCta onNavigate={handleNavigate} />
    ) : undefined;

  return (
    <MobileSidebarSheet
      open={open}
      onOpenChange={setOpen}
      triggerLabel={triggerLabel}
      trigger={<Menu className="size-4" aria-hidden />}
      triggerClassName={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "rounded-2xl shadow-sm transition-all duration-300",
        className,
      )}
      title={title}
      footer={footer}
    >
      {sidebarKind === "admin" ? (
        <AdminNavLinks onNavigate={handleNavigate} />
      ) : (
        <DashboardNavLinks onNavigate={handleNavigate} />
      )}
    </MobileSidebarSheet>
  );
};
