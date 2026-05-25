"use client";

import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import type { ListingFormValues } from "@/features/listings/validators/listingSchema";

const PRICING_OPTIONS = [
  { value: "fixed", label: "Fixed price" },
  { value: "negotiable", label: "Negotiable" },
] as const;

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "SSP", label: "SSP (South Sudan pound)" },
] as const;

export const ListingPricingFields = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormInput<ListingFormValues>
        name="price"
        label="Price"
        type="number"
        inputMode="decimal"
        min={0}
        step="1"
        placeholder="0"
      />
      <FormSelect<ListingFormValues>
        name="currency"
        label="Currency"
        options={CURRENCY_OPTIONS}
      />
      <div className="md:col-span-2">
        <FormSelect<ListingFormValues>
          name="pricingType"
          label="Pricing type"
          options={PRICING_OPTIONS}
        />
      </div>
    </div>
  );
};
