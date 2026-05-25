import type { LucideIcon } from "lucide-react";
import { LayoutGrid } from "lucide-react";

import { uiSurfaceCardStatic, uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
};

export const EmptyState = ({
  title,
  description,
  icon: Icon = LayoutGrid,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <section
      role="status"
      aria-label={title}
      className={cn(
        "border-border bg-muted/30 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-14 text-center shadow-sm transition-all duration-300",
        className,
      )}
    >
      <div
        className="bg-background text-gold ring-border flex size-12 items-center justify-center rounded-2xl shadow-sm ring-1"
        aria-hidden
      >
        <Icon className="size-6" strokeWidth={1.5} />
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className={uiTypography.cardTitle}>{title}</h2>
        {description ? <p className={uiTypography.body}>{description}</p> : null}
      </div>
      {action ? <div className="mt-1 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </section>
  );
};
