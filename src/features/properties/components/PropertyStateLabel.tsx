import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

export type PropertyStateLabelProps = {
  stateLabel: string;
  className?: string;
};

/** Bright gold state pill on black — used on cards (non-interactive) and inside hero links. */
export const PropertyStateLabel = ({
  stateLabel,
  className,
}: PropertyStateLabelProps) => {
  const label = stateLabel.trim();
  if (!label) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full bg-black px-3 py-1 text-xs font-bold tracking-tight text-[#ffe566]",
        className,
      )}
    >
      <MapPin className="size-3 shrink-0 text-[#ffe566]" strokeWidth={2.5} aria-hidden />
      <span className="truncate">{label}</span>
    </span>
  );
};
