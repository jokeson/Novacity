"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Coins,
  Home,
  Image as ImageIcon,
  KeyRound,
  LayoutGrid,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  sidebarNavIconClassName,
  sidebarNavLinkClassName,
} from "@/components/shared/navigation/sidebarNavStyles";
import { ROUTES } from "@/constants/routes";
import { adminNavItems } from "@/features/admin/constants/nav";
import { cn } from "@/lib/utils";

const navIconByHref: Record<string, LucideIcon> = {
  [ROUTES.admin]: Home,
  [ROUTES.adminUsers]: Users,
  [ROUTES.adminListings]: LayoutGrid,
  [ROUTES.adminOwnerVerifications]: UserCheck,
  [ROUTES.adminPasskeys]: KeyRound,
  [ROUTES.adminHomeHero]: ImageIcon,
  [ROUTES.adminAnalytics]: BarChart3,
  [ROUTES.adminRevenue]: Coins,
};

export type AdminNavLinksProps = {
  className?: string;
  onNavigate?: () => void;
};

export const AdminNavLinks = ({ className, onNavigate }: AdminNavLinksProps) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className={cn("flex flex-col gap-2 px-2 py-2 md:px-3", className)}
    >
      {adminNavItems.map((item) => {
        const Icon = navIconByHref[item.href] ?? Home;
        const isActive =
          item.href === ROUTES.admin
            ? pathname === ROUTES.admin
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={sidebarNavLinkClassName(isActive)}
          >
            <Icon className={sidebarNavIconClassName(isActive)} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
