"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";

import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { submitPropertyInterestAction } from "@/features/properties/actions/propertyInterestActions";
import {
  propertyInterestSchema,
  type PropertyInterestInput,
} from "@/features/properties/validators/propertyInterestSchema";

export type InterestedClientFormProps = {
  slug: string;
  propertyId: string;
  ownerId: string;
  propertyTitle?: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export const InterestedClientForm = ({
  slug,
  propertyId,
  ownerId,
  propertyTitle,
  onSuccess,
  onCancel,
}: InterestedClientFormProps) => {
  const [pending, startTransition] = useTransition();

  const form = useForm<PropertyInterestInput>({
    resolver: zodResolver(propertyInterestSchema) as Resolver<PropertyInterestInput>,
    defaultValues: {
      propertyId,
      ownerId,
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const res = await submitPropertyInterestAction(slug, values);
      if (!res.ok) {
        if (res.fieldErrors) {
          for (const [key, messages] of Object.entries(res.fieldErrors)) {
            if (!messages?.length) {
              continue;
            }
            form.setError(key as keyof PropertyInterestInput, {
              message: messages[0],
            });
          }
        }
        if (res.message) {
          form.setError("root", { message: res.message });
        }
        return;
      }
      onSuccess();
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <DialogHeader>
          <DialogTitle className="font-heading">Interested in this property</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            Share your contact details. The lister receives a dashboard notification and
            your inquiry is stored securely.
            {propertyTitle ? (
              <>
                {" "}
                Listing: <span className="text-foreground font-medium">{propertyTitle}</span>.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormInput<PropertyInterestInput>
          name="name"
          label="Name"
          autoComplete="name"
          required
          maxLength={120}
        />
        <FormInput<PropertyInterestInput>
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <FormInput<PropertyInterestInput>
          name="phone"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          maxLength={40}
        />
        <FormTextarea<PropertyInterestInput>
          name="message"
          label="Message"
          rows={4}
          placeholder="Ask about tours, availability, or documents."
          maxLength={5000}
        />

        {form.formState.errors.root?.message ? (
          <p className="text-destructive text-sm" role="alert">
            {form.formState.errors.root.message}
          </p>
        ) : null}

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            className="rounded-lg"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            className="rounded-lg"
            disabled={pending}
            aria-busy={pending || undefined}
          >
            {pending ? "Sending…" : "Send inquiry"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
