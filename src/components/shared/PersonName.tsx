import { formatPersonName } from "@/lib/formatPersonName";
import { cn } from "@/lib/utils";

export type PersonNameProps = {
  name: string;
  className?: string;
  /** Center text below `md` (mobile drawer, profile cards). */
  centerOnMobile?: boolean;
  as?: "span" | "p";
};

export const PersonName = ({
  name,
  className,
  centerOnMobile = false,
  as: Component = "span",
}: PersonNameProps) => {
  const formatted = formatPersonName(name);

  return (
    <Component
      className={cn(
        centerOnMobile && "max-md:text-center max-md:w-full",
        className,
      )}
      title={formatted}
    >
      {formatted}
    </Component>
  );
};
