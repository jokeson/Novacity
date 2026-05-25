import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import type { OwnerVerificationApplicationStatus } from "@/types/ownerVerification";
import { cn } from "@/lib/utils";

export type OwnerVerificationAdminListFilter =
  | OwnerVerificationApplicationStatus
  | "all";

export const parseOwnerVerificationAdminListFilter = (
  raw: string | string[] | undefined,
): OwnerVerificationAdminListFilter => {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "approved" || v === "rejected" || v === "all" || v === "pending") {
    return v;
  }
  return "pending";
};

const tabs: { key: OwnerVerificationAdminListFilter; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

export type AdminOwnerVerificationFilterTabsProps = {
  current: OwnerVerificationAdminListFilter;
};

export const AdminOwnerVerificationFilterTabs = ({
  current,
}: AdminOwnerVerificationFilterTabsProps) => {
  return (
    <div
      className="border-border mb-6 flex flex-wrap gap-2 rounded-xl border bg-muted/30 p-1.5"
      role="tablist"
      aria-label="Filter applications by status"
    >
      {tabs.map((tab) => {
        const href =
          tab.key === "pending"
            ? ROUTES.adminOwnerVerifications
            : `${ROUTES.adminOwnerVerifications}?status=${tab.key}`;
        const isActive = current === tab.key;
        return (
          <Link
            key={tab.key}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};
