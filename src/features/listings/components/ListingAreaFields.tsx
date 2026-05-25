"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { FormInput } from "@/components/forms/FormInput";
import {
  computeAreaSqMeters,
  listingRequiresAreaDimensions,
} from "@/features/listings/utils/listingArea";
import type { ListingFormValues } from "@/features/listings/validators/listingSchema";

export const ListingAreaFields = () => {
  const { control, setValue } = useFormContext<ListingFormValues>();
  const status = useWatch({ control, name: "status" });
  const width = useWatch({ control, name: "areaWidthM" });
  const length = useWatch({ control, name: "areaLengthM" });

  useEffect(() => {
    if (!listingRequiresAreaDimensions(status)) {
      return;
    }
    const w = typeof width === "number" ? width : Number(width);
    const l = typeof length === "number" ? length : Number(length);
    if (Number.isFinite(w) && w > 0 && Number.isFinite(l) && l > 0) {
      setValue("areaSqM", computeAreaSqMeters(w, l), { shouldValidate: true });
    }
  }, [status, width, length, setValue]);

  if (!listingRequiresAreaDimensions(status)) {
    return null;
  }

  return (
    <fieldset className="border-border flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
      <legend className="font-heading text-foreground px-1 text-base font-semibold tracking-tight">
        Property area
      </legend>
      <p className="text-muted-foreground -mt-1 text-sm leading-relaxed">
        Required for <strong className="text-foreground font-medium">For sale</strong>{" "}
        listings. Enter width and length in meters; total area (m²) updates automatically
        and can be adjusted if needed.
      </p>
      <div className="grid gap-6 sm:grid-cols-3">
        <FormInput<ListingFormValues>
          name="areaWidthM"
          label="Width (meters)"
          type="number"
          min={0}
          step="0.01"
          placeholder="e.g. 20"
        />
        <FormInput<ListingFormValues>
          name="areaLengthM"
          label="Length (meters)"
          type="number"
          min={0}
          step="0.01"
          placeholder="e.g. 30"
        />
        <FormInput<ListingFormValues>
          name="areaSqM"
          label="Total area (m²)"
          type="number"
          min={0}
          step="0.01"
          placeholder="e.g. 600"
          description="Width × length when both are set."
        />
      </div>
    </fieldset>
  );
};
