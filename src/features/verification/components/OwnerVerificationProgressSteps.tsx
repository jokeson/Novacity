"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  normalizeOwnerVerificationStatus,
  resolveVerificationStepState,
  stepShowsCheckIcon,
  VERIFICATION_PROGRESS_STEPS,
  type OwnerVerificationUiStatus,
  type VerificationStepVisualState,
} from "../utils/ownerVerificationSteps";

export type OwnerVerificationProgressStepsProps = {
  status: string;
};

const stepBadgeClassName = (state: VerificationStepVisualState): string =>
  cn(
    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300 sm:size-9",
    state === "complete" && "border-gold bg-gold/15 text-gold",
    state === "active" && "border-gold bg-gold text-white shadow-sm",
    state === "upcoming" && "border-border bg-muted text-muted-foreground",
    state === "disabled" &&
      "border-border/80 bg-muted/40 text-muted-foreground/70 opacity-60",
  );

const stepLabelClassName = (state: VerificationStepVisualState): string =>
  cn(
    "text-xs font-medium transition-colors duration-300 sm:text-sm",
    state === "active" && "text-foreground",
    state === "complete" && "text-foreground",
    state === "upcoming" && "text-muted-foreground",
    state === "disabled" && "text-muted-foreground/70",
  );

const Connector = ({ complete }: { complete: boolean }) => (
  <div
    className={cn(
      "mx-1 hidden h-0.5 min-w-6 flex-1 sm:mx-2 sm:block",
      complete ? "bg-gold/60" : "bg-border",
    )}
    aria-hidden
  />
);

export const OwnerVerificationProgressSteps = ({
  status: rawStatus,
}: OwnerVerificationProgressStepsProps) => {
  const reduceMotion = useReducedMotion();
  const status: OwnerVerificationUiStatus = normalizeOwnerVerificationStatus(rawStatus);

  return (
    <section
      aria-label="Verification progress"
      className="border-border bg-card rounded-2xl border px-4 py-4 shadow-sm sm:px-5"
    >
      <ol className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:gap-0">
        {VERIFICATION_PROGRESS_STEPS.map((step, index) => {
          const state = resolveVerificationStepState(status, step.key);
          const showCheck = stepShowsCheckIcon(state);
          const prevComplete =
            index > 0
              ? stepShowsCheckIcon(
                  resolveVerificationStepState(status, VERIFICATION_PROGRESS_STEPS[index - 1]!.key),
                )
              : false;
          const showConnectorBefore = index > 0;

          return (
            <motion.li
              key={step.key}
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: reduceMotion ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "flex min-w-0 items-center",
                index === VERIFICATION_PROGRESS_STEPS.length - 1 ? "shrink-0" : "flex-1",
              )}
              aria-current={state === "active" ? "step" : undefined}
              aria-disabled={state === "disabled" ? true : undefined}
            >
              {showConnectorBefore ? <Connector complete={prevComplete} /> : null}
              <div
                className={cn(
                  "flex min-w-0 items-center gap-2",
                  index < VERIFICATION_PROGRESS_STEPS.length - 1 && "sm:shrink-0",
                )}
              >
                <div className={stepBadgeClassName(state)} aria-hidden>
                  {showCheck ? (
                    <Check className="size-4 sm:size-5" strokeWidth={2.5} />
                  ) : (
                    <span>{step.stepNumber}</span>
                  )}
                </div>
                <span className={cn(stepLabelClassName(state), "truncate")}>
                  {step.shortTitle}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ol>
      {status === "pending" ? (
        <p className="text-muted-foreground mt-3 text-xs" role="status">
          Awaiting admin approval.
        </p>
      ) : null}
    </section>
  );
};
