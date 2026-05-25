"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PartyPopper, Sparkles } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type OwnerVerificationApprovedCelebrationProps = {
  displayName: string;
};

export const OwnerVerificationApprovedCelebration = ({
  displayName,
}: OwnerVerificationApprovedCelebrationProps) => {
  const reduceMotion = useReducedMotion();
  const name = displayName.trim() || "Owner";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-gold/35 from-gold/10 via-card to-card space-y-4 rounded-2xl border bg-gradient-to-br p-6 shadow-md ring-1 ring-gold/25 md:p-8"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="bg-gold/20 text-gold flex size-12 shrink-0 items-center justify-center rounded-2xl">
          <PartyPopper className="size-6" aria-hidden />
        </span>
        <div className="min-w-0 space-y-2">
          <p className="text-gold text-xs font-semibold tracking-wide uppercase">
            Congratulations
          </p>
          <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
            Welcome to Novacity as a verified owner, {name}!
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your application was approved. You are now part of the Novacity owner community and
            may create listings from your dashboard. A confirmation email with owner policies and
            listing guidelines was sent to your account email.
          </p>
        </div>
      </div>
      <div className="border-border bg-background/60 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground flex items-center gap-2 text-sm font-medium">
          <Sparkles className="text-gold size-4 shrink-0" aria-hidden />
          Ready to publish? PassKey rules still apply for independent owners.
        </p>
        <Link
          href={ROUTES.dashboardListingsCreate}
          className={cn(buttonVariants(), "rounded-lg")}
        >
          Create your first listing
        </Link>
      </div>
    </motion.div>
  );
};
