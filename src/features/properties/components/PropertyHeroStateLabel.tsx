import Link from "next/link";

import { PropertyStateLabel } from "@/features/properties/components/PropertyStateLabel";
import { stateSlugFromLabel } from "@/features/search/utils/stateSlug";
import { cn } from "@/lib/utils";

export type PropertyHeroStateLabelProps = {
  stateLabel: string;
  className?: string;
};

export const PropertyHeroStateLabel = ({
  stateLabel,
  className,
}: PropertyHeroStateLabelProps) => {
  const label = stateLabel.trim();
  if (!label) {
    return null;
  }

  const href = `/states/${stateSlugFromLabel(label)}`;

  return (
    <Link
      href={href}
      className={cn(
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe566]",
        className,
      )}
      aria-label={`Browse listings in ${label}`}
    >
      <PropertyStateLabel
        stateLabel={label}
        className="gap-2 px-4 py-2 text-sm [&_svg]:size-4"
      />
    </Link>
  );
};
