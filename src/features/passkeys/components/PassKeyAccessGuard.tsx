"use client";

import Link from "next/link";
import { type ReactNode } from "react";

import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/user";
import { cn } from "@/lib/utils";

export type PassKeyAccessGuardProps = {
  userRole: UserRole;
  hasValidPassKey: boolean;
  children: ReactNode;
  className?: string;
};

export const PassKeyAccessGuard = ({
  userRole,
  hasValidPassKey,
  children,
  className,
}: PassKeyAccessGuardProps) => {
  if (userRole === "admin") {
    return <>{children}</>;
  }

  if (userRole !== "user") {
    return <>{children}</>;
  }

  if (hasValidPassKey) {
    return <>{children}</>;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div
        role="alert"
        className="border-destructive/30 bg-destructive/5 text-foreground rounded-2xl border px-4 py-4 text-sm leading-relaxed shadow-sm"
      >
        <p className="font-medium">PassKey required to publish</p>
        <p className="text-muted-foreground mt-1">
          You can keep working on drafts. When you are ready to publish a listing,
          add an active PassKey from your account.
        </p>
        <Link
          href={ROUTES.dashboardPasskeys}
          className="text-primary mt-3 inline-flex font-medium underline-offset-4 hover:underline"
        >
          Open Pass keys
        </Link>
      </div>
      {children}
    </div>
  );
};
