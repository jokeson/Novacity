import Link from "next/link";
import { MapPin } from "lucide-react";

import { HOME_CARD_SURFACE_ON_MUTED_SECTION } from "@/features/home/constants/homeCardSurfaces";
import { cn } from "@/lib/utils";
import type { HomepageStateHighlight } from "@/server/queries/propertySearch.queries";

export type StateHighlightCardProps = {
  state: HomepageStateHighlight;
  className?: string;
};

const listingCountLabel = (count: number): string =>
  count === 1 ? "1 listing" : `${count} listings`;

export const StateHighlightCard = ({
  state,
  className,
}: StateHighlightCardProps) => (
  <Link
    href={`/states/${state.slug}`}
    className={cn(
      "group border-border focus-visible:ring-ring flex min-h-[7.5rem] cursor-pointer flex-col justify-between rounded-2xl border p-4 shadow-sm ring-foreground/5 ring-1 transition-all duration-300 outline-none hover:border-gold/40 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/55 sm:min-h-[8rem] sm:p-5",
      HOME_CARD_SURFACE_ON_MUTED_SECTION,
      className,
    )}
    aria-label={`Browse listings in ${state.label}, ${listingCountLabel(state.listingCount)}`}
  >
    <span
      className="bg-muted text-gold flex size-9 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-gold/10 sm:size-10"
      aria-hidden
    >
      <MapPin className="size-4 sm:size-[1.125rem]" strokeWidth={1.75} />
    </span>
    <span className="mt-3 flex flex-col gap-1">
      <span className="font-heading text-primary line-clamp-2 text-base leading-snug font-semibold tracking-tight sm:text-lg">
        {state.label}
      </span>
      <span className="text-muted-foreground text-xs sm:text-sm">
        {listingCountLabel(state.listingCount)}
      </span>
    </span>
  </Link>
);
