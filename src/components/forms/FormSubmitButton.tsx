"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FormSubmitButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "type"
>;

export const FormSubmitButton = ({
  children,
  className,
  disabled,
  ...props
}: FormSubmitButtonProps) => {
  const { formState } = useFormContext();
  const { isSubmitting } = formState;

  return (
    <Button
      type="submit"
      disabled={Boolean(disabled) || isSubmitting}
      className={cn(className)}
      aria-busy={isSubmitting || undefined}
      {...props}
    >
      {children}
    </Button>
  );
};
