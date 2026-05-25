"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type Resolver, useForm, useWatch } from "react-hook-form";

import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  createListingAction,
  updateListingAction,
} from "@/features/listings/actions/listingActions";
import { isNextRedirectError } from "@/features/listings/utils/isNextRedirectError";
import { publishRequiresPassKey } from "@/features/listings/utils/publishRules";
import { defaultExpiresAtInputValue } from "@/features/listings/utils/expiration";
import {
  createListingFormSchema,
  listingFormSchema,
  LISTING_CREATE_IMAGE_COUNT,
  type ListingFormValues,
} from "@/features/listings/validators/listingSchema";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/user";

import { ListingAreaFields } from "./ListingAreaFields";
import { ListingImageUploader } from "./ListingImageUpload";
import { ListingLocationFields } from "./ListingLocationFields";
import { ListingPricingFields } from "./ListingPricingFields";
import { ListingStatusSelect } from "./ListingStatusSelect";

const PROPERTY_TYPE_OPTIONS = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
  { value: "rental", label: "Rental" },
] as const;

const buildEmptyValues = (): ListingFormValues => ({
  title: "",
  description: "",
  price: 0,
  currency: "USD",
  propertyType: "house",
  pricingType: "fixed",
  state: "",
  location: "",
  address: "",
  phone: "",
  images: [],
  status: "draft",
  bedrooms: 0,
  bathrooms: 0,
  expiresAt: defaultExpiresAtInputValue(),
});

export type ListingFormProps = {
  mode: "create" | "edit";
  listingId?: string;
  defaultValues?: Partial<ListingFormValues>;
  userRole: UserRole;
};

export const ListingForm = ({
  mode,
  listingId,
  defaultValues,
  userRole,
}: ListingFormProps) => {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const mergedDefaults = useMemo(
    () => ({
      ...buildEmptyValues(),
      ...defaultValues,
    }),
    [defaultValues],
  );

  const formSchema = useMemo(
    () => (mode === "create" ? createListingFormSchema : listingFormSchema),
    [mode],
  );

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(formSchema) as Resolver<ListingFormValues>,
    defaultValues: mergedDefaults,
  });

  const status = useWatch({ control: form.control, name: "status" });
  const showPassKeyNotice = publishRequiresPassKey(status, userRole);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    setSaved(false);
    try {
      if (mode === "create") {
        await createListingAction(values);
      } else if (listingId) {
        const res = await updateListingAction(listingId, values);
        if (!res.ok) {
          if (res.fieldErrors) {
            for (const [key, messages] of Object.entries(res.fieldErrors)) {
              if (!messages?.length) {
                continue;
              }
              form.setError(key as keyof ListingFormValues, {
                message: messages[0],
              });
            }
          }
          if (res.message) {
            form.setError("root", { message: res.message });
          }
          return;
        }
        setSaved(true);
        router.refresh();
      }
    } catch (error) {
      if (isNextRedirectError(error)) {
        throw error;
      }
      form.setError("root", {
        message: "Something went wrong while saving your listing.",
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        {showPassKeyNotice ? (
          <div
            className="border-border bg-muted/40 text-foreground rounded-xl border px-4 py-3 text-sm"
            role="status"
          >
            Publishing uses an active PassKey on your account (admins and company
            accounts are exempt). Each first publish consumes one unused PassKey. You
            can still save as <strong>draft</strong> without a PassKey. Manage keys
            under{" "}
            <Link
              href={ROUTES.dashboardPasskeys}
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Pass keys
            </Link>
            .
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <FormInput<ListingFormValues>
            name="title"
            label="Title"
            placeholder="Bright 2-bedroom near the park"
          />
          <FormSelect<ListingFormValues>
            name="propertyType"
            label="Property type"
            options={PROPERTY_TYPE_OPTIONS}
          />
        </div>

        <FormTextarea<ListingFormValues>
          name="description"
          label="Description"
          rows={6}
          placeholder="Describe the property, amenities, and availability."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormInput<ListingFormValues>
            name="bedrooms"
            label="Bedrooms"
            type="number"
            min={0}
            step="1"
          />
          <FormInput<ListingFormValues>
            name="bathrooms"
            label="Bathrooms"
            type="number"
            min={0}
            step="1"
          />
        </div>

        <ListingPricingFields />
        <ListingStatusSelect />
        <ListingAreaFields />
        <ListingLocationFields />

        <FormInput<ListingFormValues>
          name="expiresAt"
          label="Expiration (required when published)"
          type="datetime-local"
          description="Drafts ignore this field. Published listings use it for renewal tracking."
        />

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <ListingImageUploader
                slotCount={mode === "create" ? LISTING_CREATE_IMAGE_COUNT : undefined}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.message ? (
          <p className="text-destructive text-sm" role="alert">
            {form.formState.errors.root.message}
          </p>
        ) : null}

        {saved ? (
          <p className="text-primary text-sm" role="status">
            Listing saved.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <FormSubmitButton className="min-w-[140px]">
            {mode === "create" ? "Create listing" : "Save changes"}
          </FormSubmitButton>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(mergedDefaults)}
          >
            Reset form
          </Button>
        </div>
      </form>
    </Form>
  );
};
