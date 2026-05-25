"use client";

import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { SOUTH_SUDAN_STATE_OPTIONS } from "@/constants/southSudanStates";
import type { ListingFormValues } from "@/features/listings/validators/listingSchema";

const STATE_FORM_OPTIONS = SOUTH_SUDAN_STATE_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

export const ListingLocationFields = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <FormSelect<ListingFormValues>
          name="state"
          label="State / region"
          placeholder="Select state or region"
          options={STATE_FORM_OPTIONS}
        />
      </div>
      <FormInput<ListingFormValues>
        name="location"
        label="Location / area"
        placeholder="City, neighborhood, or region"
        autoComplete="address-level2"
      />
      <FormInput<ListingFormValues>
        name="address"
        label="Street address (optional)"
        placeholder="Full street address"
        autoComplete="street-address"
      />
      <FormInput<ListingFormValues>
        name="phone"
        label="Contact phone"
        type="tel"
        placeholder="+211 9XX XXX XXX"
        autoComplete="tel"
        description="Shown on your public listing. Required when publishing."
      />
    </div>
  );
};
