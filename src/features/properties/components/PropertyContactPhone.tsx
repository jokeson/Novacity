import { Phone } from "lucide-react";

import { cn } from "@/lib/utils";

export type PropertyContactPhoneProps = {
  phone: string;
  className?: string;
};

const toTelHref = (phone: string): string => {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
};

export const PropertyContactPhone = ({
  phone,
  className,
}: PropertyContactPhoneProps) => {
  const trimmed = phone.trim();
  if (!trimmed) {
    return null;
  }

  const href = toTelHref(trimmed);

  return (
    <p className={cn("text-sm", className)}>
      <a
        href={href || undefined}
        className="text-foreground hover:text-gold inline-flex items-center gap-2 font-medium transition-colors duration-300"
        aria-label={`Call lister at ${trimmed}`}
      >
        <Phone className="text-gold size-4 shrink-0" strokeWidth={2} aria-hidden />
        <span>{trimmed}</span>
      </a>
    </p>
  );
};
