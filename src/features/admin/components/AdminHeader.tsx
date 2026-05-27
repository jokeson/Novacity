"use client";

import { type ReactNode } from "react";

import { BackLink } from "@/components/shared/BackLink";
import { Container } from "@/components/shared/Container";
import { uiStickySubheaderShell, uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type AdminHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: React.ReactNode;
  backLink?: { href: string; label?: string };
  className?: string;
};

export const AdminHeader = ({
  title,
  description,
  actions,
  backLink,
  className,
}: AdminHeaderProps) => {
  return (
    <div
      className={cn(uiStickySubheaderShell, className)}
    >
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
              <div className={cn(uiTypography.body, "max-w-2xl")}>{description}</div>
            ) : null}
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
