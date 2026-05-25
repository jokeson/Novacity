import { MapPin } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PropertyMapLinkProps = {
  location: string;
  address: string;
  className?: string;
};

const buildMapsUrl = (location: string, address: string): string => {
  const query = [address, location].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "Property")}`;
};

export const PropertyMapLink = ({
  location,
  address,
  className,
}: PropertyMapLinkProps) => {
  const href = buildMapsUrl(location, address);
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "inline-flex items-center gap-2",
        className,
      )}
    >
      <MapPin className="size-4" aria-hidden />
      Open in Maps
    </Link>
  );
};
