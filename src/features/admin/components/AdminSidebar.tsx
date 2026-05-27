"use client";

import Link from "next/link";

import { SidebarCollapseToggle } from "@/components/shared/navigation/SidebarCollapseToggle";
import { AdminNavLinks } from "@/features/admin/components/AdminNavLinks";
import { sidebarTitleLinkClassName } from "@/components/shared/navigation/sidebarNavStyles";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type AdminSidebarProps = {
  className?: string;
};

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex flex-col gap-5 p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <Link href={ROUTES.admin} className={sidebarTitleLinkClassName}>
            Admin
          </Link>
          <SidebarCollapseToggle />
        </div>
      </div>
      <AdminNavLinks className="flex-1 px-2 pb-4" />
    </div>
  );
};
