"use client";

import { FormSelect } from "@/components/forms/FormSelect";
import type { ListingFormValues } from "@/features/listings/validators/listingSchema";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (not visible publicly)" },
  { value: "for-sale", label: "For sale" },
  { value: "for-rent", label: "For rent" },
  { value: "new-listing", label: "New listing" },
  { value: "featured", label: "Featured" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
] as const;

export const ListingStatusSelect = () => {
  return (
    <FormSelect<ListingFormValues>
      name="status"
      label="Listing status"
      description="Drafts stay private. Publishing may require an active PassKey (admins exempt)."
      options={STATUS_OPTIONS}
    />
  );
};
