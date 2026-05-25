"use client";

import type { VariantProps } from "class-variance-authority";
import { useFormStatus } from "react-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { signOutMutation } from "../actions/authActions";

export type SignOutButtonProps = {
  className?: string;
  formClassName?: string;
} & Pick<VariantProps<typeof buttonVariants>, "variant" | "size">;

const SignOutFormButton = ({
  className,
  variant,
  size,
}: Pick<SignOutButtonProps, "className" | "variant" | "size">) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      aria-busy={pending}
      className={cn("cursor-pointer rounded-xl disabled:cursor-not-allowed", className)}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
};

export const SignOutButton = ({
  className,
  formClassName,
  variant = "outline",
  size = "default",
}: SignOutButtonProps) => {
  return (
    <form action={signOutMutation} className={cn(formClassName)}>
      <SignOutFormButton variant={variant} size={size} className={className} />
    </form>
  );
};
