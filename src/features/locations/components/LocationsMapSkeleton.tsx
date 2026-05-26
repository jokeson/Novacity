import { cn } from "@/lib/utils";

export type LocationsMapSkeletonProps = {
  className?: string;
};

export const LocationsMapSkeleton = ({ className }: LocationsMapSkeletonProps) => (
  <div
    className={cn(
      "border-border bg-muted/50 h-[min(72vh,680px)] min-h-[320px] w-full animate-pulse rounded-2xl border",
      className,
    )}
    aria-hidden
  />
);
