import { cn } from "@/lib/utils";

export const inputClasses = cn(
  "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-2xl border px-4 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45 md:h-12 md:text-[0.9375rem]",
);

export const selectClasses = inputClasses;
