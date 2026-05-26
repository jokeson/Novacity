import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type LoadingSkeletonProps = {
  variant?: "card" | "text" | "table-row";
  className?: string;
};

export const LoadingSkeleton = ({
  variant = "card",
  className,
}: LoadingSkeletonProps) => {
  if (variant === "text") {
    return (
      <div className={cn("flex w-full max-w-md flex-col gap-3", className)}>
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-[92%] rounded-md" />
        <Skeleton className="h-4 w-[78%] rounded-md" />
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div
        className={cn(
          "border-border flex items-center gap-4 border-b py-3",
          className,
        )}
      >
        <Skeleton className="h-10 w-24 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-full max-w-[200px] rounded-md" />
          <Skeleton className="h-3 w-full max-w-xs rounded-md" />
        </div>
        <Skeleton className="hidden h-8 w-20 shrink-0 rounded-lg sm:block" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-2xl border-2 shadow-none",
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4 md:p-5">
        <Skeleton className="h-5 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-4 w-14 rounded-md" />
          <Skeleton className="h-4 w-14 rounded-md" />
          <Skeleton className="h-4 w-14 rounded-md" />
        </div>
      </div>
    </div>
  );
};
