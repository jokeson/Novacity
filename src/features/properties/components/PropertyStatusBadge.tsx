import type { PropertyStatus } from "@/types/property";

import type { StatusTone } from "@/components/shared/StatusBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";

const STATUS_META: Record<
  PropertyStatus,
  { label: string; tone: StatusTone }
> = {
  draft: { label: "Draft", tone: "neutral" },
  "for-sale": { label: "For sale", tone: "success" },
  "for-rent": { label: "For rent", tone: "neutral" },
  sold: { label: "Sold", tone: "danger" },
  rented: { label: "Rented", tone: "danger" },
  featured: { label: "Featured", tone: "gold" },
  "new-listing": { label: "New listing", tone: "warning" },
};

export type PropertyStatusBadgeProps = {
  status: PropertyStatus;
  className?: string;
};

export const PropertyStatusBadge = ({
  status,
  className,
}: PropertyStatusBadgeProps) => {
  const meta = STATUS_META[status];

  return (
    <StatusBadge tone={meta.tone} className={className}>
      {meta.label}
    </StatusBadge>
  );
};
