"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FormSelectProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  disabled?: boolean;
} & Pick<
  ComponentPropsWithoutRef<typeof SelectTrigger>,
  "className"
>;

export const FormSelect = <TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = "Choose an option",
  options,
  disabled,
  className,
}: FormSelectProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Select
              name={field.name}
              disabled={disabled}
              value={
                typeof field.value === "string" && field.value.length > 0
                  ? field.value
                  : null
              }
              onValueChange={field.onChange}
            >
              <SelectTrigger className={cn("w-full min-w-0", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
