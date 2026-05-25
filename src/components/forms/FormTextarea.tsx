"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type FormTextareaProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
} & Omit<
  ComponentPropsWithoutRef<"textarea">,
  "name" | "defaultValue"
>;

export const FormTextarea = <TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  ...textareaProps
}: FormTextareaProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Textarea
              {...textareaProps}
              {...field}
              value={
                typeof field.value === "string"
                  ? field.value
                  : field.value === undefined || field.value === null
                    ? ""
                    : String(field.value)
              }
              className={cn(className)}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
