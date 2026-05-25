"use client";

import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { KeyRound } from "lucide-react";

export const PassKeyPublishBanner = () => {
  return (
    <div
      role="status"
      className="border-border bg-card/95 text-foreground supports-[backdrop-filter]:bg-card/80 mx-4 mt-4 flex flex-col gap-3 rounded-2xl border px-4 py-4 shadow-sm backdrop-blur-sm md:mx-6 md:flex-row md:items-center md:justify-between md:px-6"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="border-border bg-primary/10 text-gold flex size-10 shrink-0 items-center justify-center rounded-xl border">
          <KeyRound className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="font-heading text-sm font-semibold tracking-tight md:text-base">
            PassKey required to publish
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
            Add an active PassKey to publish listings from your account. You can still
            browse the marketplace and save drafts.
          </p>
        </div>
      </div>
      <Link
        href={ROUTES.dashboardPasskeys}
        className="text-primary border-border bg-background hover:border-primary/40 inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-muted active:scale-[0.99]"
      >
        Manage Pass keys
      </Link>
    </div>
  );
};
