"use client";

import Link from "next/link";

import { AdminNavLinks } from "@/features/admin/components/AdminNavLinks";
import {
  sidebarAsideClassName,
  sidebarAsideDesktopFixedClassName,
  sidebarTitleLinkClassName,
} from "@/components/shared/navigation/sidebarNavStyles";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type AdminSidebarProps = {
  className?: string;
};

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  return (
    <aside
      className={cn(
        sidebarAsideClassName,
        sidebarAsideDesktopFixedClassName,
        "hidden w-64 md:flex",
        className,
      )}
    >
      <div className="flex flex-col gap-5 p-5 pb-3">
        <Link href={ROUTES.admin} className={sidebarTitleLinkClassName}>
          Admin
        </Link>
      </div>
      <AdminNavLinks className="flex-1 px-2 pb-4" />
    </aside>
  );
};
