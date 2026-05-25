"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type FormInputProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
} & Omit<
  ComponentPropsWithoutRef<typeof Input>,
  "name" | "defaultValue"
>;

export const FormInput = <TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  ...inputProps
}: FormInputProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Input
              {...field}
              {...inputProps}
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
