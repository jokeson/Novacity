"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { buildPropertySearchQuery } from "@/features/search/utils/buildPropertySearchQuery";
import {
  parsePropertySearchParams,
  propertySearchParamsSchema,
} from "@/features/search/validators/propertySearchParams";
import { uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

const ALL_VALUE = "";

const fieldControlClassName = cn(
  "border-border bg-background text-foreground placeholder:text-muted-foreground",
  "h-9 w-full min-w-0 rounded-xl border px-3 text-sm transition-all outline-none",
  "focus-visible:border-gold/50 focus-visible:ring-[3px] focus-visible:ring-gold/25 sm:h-10",
);

const fieldLabelClassName = cn(uiTypography.label, "text-xs");

type SearchFieldProps = {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
};

const SearchField = ({ id, label, className, children }: SearchFieldProps) => (
  <div className={cn("flex min-w-0 flex-col gap-1", className)}>
    <label htmlFor={id} className={fieldLabelClassName}>
      {label}
    </label>
    {children}
  </div>
);

export type AdvancedSearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingStates: string[];
};

export const AdvancedSearchModal = ({
  open,
  onOpenChange,
  listingStates,
}: AdvancedSearchModalProps) => {
  const router = useRouter();
  const hasStates = listingStates.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const raw: Record<string, string> = {};

    for (const [key, value] of data.entries()) {
      if (typeof value === "string" && value.trim() !== "") {
        raw[key] = value.trim();
      }
    }

    const parsed = parsePropertySearchParams(raw);
    const params = parsed.success
      ? parsed.data
      : propertySearchParamsSchema.parse({});

    onOpenChange(false);
    router.push(`${ROUTES.properties}${buildPropertySearchQuery(params)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        overlayClassName="z-[55] bg-primary/40 backdrop-blur-sm"
        className={cn(
          "z-[60] grid w-[min(100vw-1.25rem,24rem)] max-w-md gap-0 overflow-hidden rounded-2xl border-2 border-border bg-card p-0 shadow-lg sm:w-full sm:max-w-lg",
          "[&_[data-slot=dialog-close]]:top-2.5 [&_[data-slot=dialog-close]]:right-2.5",
          "[&_[data-slot=dialog-close]]:text-primary-foreground [&_[data-slot=dialog-close]]:hover:bg-primary-foreground/10 [&_[data-slot=dialog-close]]:hover:text-gold",
        )}
      >
        <div className="border-primary-foreground/10 bg-primary border-b px-4 py-3 pr-11 sm:px-5 sm:py-3.5">
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
            <span
              className="border-gold/40 bg-gold/15 text-gold flex size-8 shrink-0 items-center justify-center rounded-xl border sm:size-9"
              aria-hidden
            >
              <Search className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="font-heading text-gold text-base leading-tight font-semibold tracking-tight sm:text-lg">
                Search properties
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/85 mt-0.5 text-xs leading-snug">
                Filter by location, type, and price — results open on the listings
                page.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <SearchField id="modal-search-query" label="Keywords" className="col-span-2">
              <input
                id="modal-search-query"
                name="q"
                type="search"
                placeholder="Neighborhood, feature…"
                className={fieldControlClassName}
              />
            </SearchField>

            <SearchField
              id="modal-search-location"
              label="Location"
              className={hasStates ? "col-span-1" : "col-span-2"}
            >
              <input
                id="modal-search-location"
                name="location"
                type="text"
                placeholder="City, landmark"
                autoComplete="address-level2"
                className={fieldControlClassName}
              />
            </SearchField>

            {hasStates ? (
              <SearchField id="modal-search-state" label="State" className="col-span-1">
                <select
                  id="modal-search-state"
                  name="state"
                  defaultValue=""
                  className={fieldControlClassName}
                >
                  <option value="">Any</option>
                  {listingStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </SearchField>
            ) : null}

            <SearchField id="modal-search-type" label="Property type" className="col-span-2">
              <select
                id="modal-search-type"
                name="type"
                defaultValue=""
                className={fieldControlClassName}
              >
                <option value={ALL_VALUE}>Any type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="rental">Rental</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </SearchField>

            <SearchField id="modal-search-price-min" label="Min price (USD)" className="col-span-1">
              <input
                id="modal-search-price-min"
                name="minPrice"
                inputMode="numeric"
                placeholder="Min"
                className={fieldControlClassName}
              />
            </SearchField>

            <SearchField id="modal-search-price-max" label="Max price (USD)" className="col-span-1">
              <input
                id="modal-search-price-max"
                name="maxPrice"
                inputMode="numeric"
                placeholder="Max"
                className={fieldControlClassName}
              />
            </SearchField>

            <div className="col-span-2 flex flex-col gap-2 pt-0.5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                variant="gold"
                className="h-9 w-full cursor-pointer rounded-xl px-5 text-sm font-semibold sm:h-10 sm:w-auto sm:min-w-[9.5rem]"
              >
                Search
              </Button>
              <Link
                href={ROUTES.properties}
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-gold cursor-pointer text-center text-xs font-medium underline-offset-4 transition-colors hover:underline sm:text-sm"
              >
                Browse all listings
              </Link>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
