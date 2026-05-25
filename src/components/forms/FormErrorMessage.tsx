"use client";

import type { ComponentPropsWithoutRef } from "react";
import { get } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

export type FormErrorMessageProps = {
  message?: string;
  name?: FieldPath<FieldValues>;
} & Omit<ComponentPropsWithoutRef<"p">, "children">;

export const FormErrorMessage = ({
  message: directMessage,
  name,
  className,
  ...paragraphProps
}: FormErrorMessageProps) => {
  const { formState } = useFormContext();
  const { errors } = formState;

  let text = directMessage;

  if (!text && name) {
    const err = get(errors, name as string & FieldPath<FieldValues>);
    if (err && typeof err.message === "string") {
      text = err.message;
    }
  }

  if (!text) {
    return null;
  }

  return (
    <p role="alert" className={cn("text-destructive text-sm", className)} {...paragraphProps}>
      {text}
    </p>
  );
};
