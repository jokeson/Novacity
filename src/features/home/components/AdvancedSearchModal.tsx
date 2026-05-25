"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const inputClasses = cn(
  "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-2xl border px-4 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45 md:h-12 md:text-[0.9375rem]",
);

const ALL_VALUE = "";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>Search properties</DialogTitle>
          <DialogDescription>
            Filter by keywords, location, type, and price. Results open on the
            listings page with your choices in the URL.
          </DialogDescription>
        </DialogHeader>
        <form
          method="get"
          action={ROUTES.properties}
          className="bg-card border-border mt-2 rounded-2xl border p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="modal-search-query" className="text-sm font-medium">
                Keywords
              </label>
              <input
                id="modal-search-query"
                name="q"
                type="search"
                placeholder="Neighborhood, feature, MLS…"
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="modal-search-location" className="text-sm font-medium">
                Location
              </label>
              <input
                id="modal-search-location"
                name="location"
                type="text"
                placeholder="City, ZIP, landmark"
                autoComplete="address-level2"
                className={inputClasses}
              />
            </div>
            {listingStates.length ? (
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="modal-search-state" className="text-sm font-medium">
                  State / region
                </label>
                <select
                  id="modal-search-state"
                  name="state"
                  defaultValue=""
                  className={inputClasses}
                >
                  <option value="">Any state</option>
                  {listingStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="modal-search-type" className="text-sm font-medium">
                Property type
              </label>
              <select
                id="modal-search-type"
                name="type"
                defaultValue=""
                className={inputClasses}
              >
                <option value={ALL_VALUE}>Any</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="rental">Rental</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="modal-search-price-min" className="text-sm font-medium">
                Price min (USD)
              </label>
              <input
                id="modal-search-price-min"
                name="minPrice"
                inputMode="numeric"
                placeholder="Optional"
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="modal-search-price-max" className="text-sm font-medium">
                Price max (USD)
              </label>
              <input
                id="modal-search-price-max"
                name="maxPrice"
                inputMode="numeric"
                placeholder="Optional"
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                className="h-11 w-full cursor-pointer rounded-2xl text-base sm:h-12 sm:w-auto sm:min-w-[10rem]"
              >
                Search properties
              </Button>
              <Link
                href={ROUTES.properties}
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-center text-sm font-medium underline-offset-4 transition-colors hover:underline sm:text-start"
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
