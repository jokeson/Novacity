import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type StatusTone = "success" | "danger" | "warning" | "neutral" | "gold";

const toneClass: Record<StatusTone, string> = {
  success:
    "border-success/40 bg-success/10 text-emerald-950 dark:text-emerald-100",
  danger: "border-danger/40 bg-danger/10 text-red-950 dark:text-red-100",
  warning: "border-amber-400/50 bg-amber-50 text-amber-950 dark:text-amber-100",
  neutral: "border-border bg-muted text-foreground",
  gold: "border-gold/50 bg-gold/15 text-primary",
};

export type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
};

export const StatusBadge = ({
  children,
  tone = "neutral",
  className,
}: StatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-0.5 font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </Badge>
  );
};
