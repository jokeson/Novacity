import type { PropertyType } from "@/types/property";

import { cn } from "@/lib/utils";

const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  land: "Land",
  commercial: "Commercial",
  rental: "Rental",
};

export type PropertyMetaProps = {
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  propertyType?: PropertyType | null;
  variant?: "default" | "card";
  className?: string;
};

const formatBedrooms = (value: number): string =>
  `${value} ${value === 1 ? "bedroom" : "bedrooms"}`;

const formatBathrooms = (value: number): string =>
  `${value} ${value === 1 ? "bathroom" : "bathrooms"}`;

const formatCountLabel = (
  kind: "bedroom" | "bathroom",
  value?: number | null,
): string | null => {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return null;
  }
  return kind === "bedroom" ? formatBedrooms(value) : formatBathrooms(value);
};

export const PropertyMeta = ({
  beds,
  baths,
  sqft,
  propertyType,
  variant = "default",
  className,
}: PropertyMetaProps) => {
  const isCard = variant === "card";
  const parts: string[] = [];

  const bedrooms = formatCountLabel("bedroom", beds);
  if (bedrooms) {
    parts.push(bedrooms);
  }

  const bathrooms = formatCountLabel("bathroom", baths);
  if (bathrooms) {
    parts.push(bathrooms);
  }

  if (sqft !== undefined && sqft !== null && Number.isFinite(sqft)) {
    parts.push(`${new Intl.NumberFormat("en-US").format(sqft)} sq ft`);
  }

  if (propertyType) {
    parts.push(PROPERTY_TYPE_LABEL[propertyType]);
  }

  if (!parts.length) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-muted-foreground min-w-0",
        isCard
          ? "h-[1rem] shrink-0 truncate text-[clamp(0.5625rem,3.5cqw,0.6875rem)] leading-4"
          : "text-sm leading-relaxed",
        className,
      )}
      title={isCard ? parts.join(" · ") : undefined}
    >
      {parts.join(" · ")}
    </p>
  );
};
