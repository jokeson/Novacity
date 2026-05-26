import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { propertyDetailPath, ROUTES } from "@/constants/routes";
import { PropertyCard } from "@/features/properties/components/PropertyCard";
import { publicPropertyListItemToCardProps } from "@/features/properties/utils/publicPropertyListItemToCardProps";
import { buildPropertySearchQuery } from "@/features/search/utils/buildPropertySearchQuery";
import type { PropertySearchParams } from "@/features/search/validators/propertySearchParams";
import type { PublicPropertyListItem } from "@/server/queries/propertySearch.queries";
import { uiPropertyCardGrid } from "@/lib/responsiveLayout";
import { cn } from "@/lib/utils";

export type SearchResultsProps = {
  items: PublicPropertyListItem[];
  parsed: PropertySearchParams;
  total: number;
};

export const SearchResults = ({ items, parsed, total }: SearchResultsProps) => {
  const totalPages = Math.max(1, Math.ceil(total / parsed.pageSize));

  if (items.length === 0) {
    return (
      <EmptyState
        title="No properties match"
        description="No listings match this view. Try browsing all listings or adjust your search from the navbar."
        action={
          <Link
            href={ROUTES.properties}
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-lg")}
          >
            View all listings
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-muted-foreground text-sm">
        Showing{" "}
        <span className="text-foreground font-medium">
          {(parsed.page - 1) * parsed.pageSize + 1}–
          {Math.min(parsed.page * parsed.pageSize, total)}
        </span>{" "}
        of <span className="text-foreground font-medium">{total}</span>{" "}
        {total === 1 ? "listing" : "listings"}
        {parsed.state?.trim() ? (
          <>
            {" "}
            in{" "}
            <span className="text-foreground font-medium">{parsed.state.trim()}</span>
          </>
        ) : null}
      </p>
      <ul className={uiPropertyCardGrid}>
        {items.map((item, index) => (
          <li key={item.slug} className="min-w-0">
          <Link
            href={`${propertyDetailPath(item.slug)}${buildPropertySearchQuery(parsed)}`}
            className="focus-visible:ring-ring block h-full w-full min-w-0 max-w-full rounded-2xl focus-visible:ring-[3px] focus-visible:outline-none"
          >
            <PropertyCard
              {...publicPropertyListItemToCardProps(item)}
              priorityImage={index < 3}
            />
          </Link>
          </li>
        ))}
      </ul>
      {totalPages > 1 ? (
        <nav
          className="border-border flex flex-wrap items-center justify-between gap-4 border-t pt-6"
          aria-label="Pagination"
        >
          {parsed.page > 1 ? (
            <Link
              href={`${ROUTES.properties}${buildPropertySearchQuery(parsed, { page: parsed.page - 1 })}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              rel="prev"
            >
              Previous
            </Link>
          ) : (
            <span className="text-muted-foreground text-sm">Previous</span>
          )}
          <p className="text-muted-foreground text-sm">
            Page{" "}
            <span className="text-foreground font-medium">{parsed.page}</span>{" "}
            of{" "}
            <span className="text-foreground font-medium">{totalPages}</span>
          </p>
          {parsed.page < totalPages ? (
            <Link
              href={`${ROUTES.properties}${buildPropertySearchQuery(parsed, { page: parsed.page + 1 })}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              rel="next"
            >
              Next
            </Link>
          ) : (
            <span className="text-muted-foreground text-sm">Next</span>
          )}
        </nav>
      ) : null}
    </div>
  );
};
