"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import { BackLink } from "@/components/shared/BackLink";
import { Container } from "@/components/shared/Container";
import { MobileSidebarSheet } from "@/components/shared/navigation/MobileSidebarSheet";
import { buttonVariants } from "@/components/ui/button";
import { DashboardNavLinks } from "@/features/dashboard/components/DashboardNavLinks";
import { uiStickySubheaderShell, uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type DashboardHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: React.ReactNode;
  /** Stable parent navigation (preferred over history-only back). */
  backLink?: { href: string; label?: string };
  className?: string;
};

export const DashboardHeader = ({
  title,
  description,
  actions,
  backLink,
  className,
}: DashboardHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={cn(uiStickySubheaderShell, className)}
    >
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="pt-0.5 md:hidden">
              <MobileSidebarSheet
                open={mobileOpen}
                onOpenChange={setMobileOpen}
                triggerLabel="Open dashboard menu"
                trigger={<Menu className="size-4" aria-hidden />}
                triggerClassName={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "rounded-2xl shadow-sm transition-all duration-300",
                )}
                title="Dashboard"
              >
                <DashboardNavLinks onNavigate={() => setMobileOpen(false)} />
              </MobileSidebarSheet>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {backLink ? (
                <BackLink
                  href={backLink.href}
                  label={backLink.label ?? "Back"}
                  className="mb-1"
                />
              ) : null}
              <h1 className={uiTypography.pageTitle}>{title}</h1>
              {description ? (
                <p className={cn(uiTypography.body, "max-w-2xl")}>{description}</p>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
};
