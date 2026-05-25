"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { uiGoldTextLink } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

import { forgotPasswordMutation } from "../actions/authActions";
import type { ForgotPasswordInput } from "../validators/authSchema";
import { forgotPasswordSchema } from "../validators/authSchema";

export type ForgotPasswordFormProps = {
  className?: string;
};

export const ForgotPasswordForm = ({ className }: ForgotPasswordFormProps) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null);
    const result = await forgotPasswordMutation(values.email);

    if (result.ok) {
      setSuccessMessage(result.message);
      reset();
      return;
    }

    if (result.fieldErrors?.email?.[0]) {
      setError("email", { message: result.fieldErrors.email[0] });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-5", className)}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-destructive text-sm" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      {successMessage ? (
        <p className="text-success text-sm leading-relaxed" role="status">
          {successMessage}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="gold"
        className="flex h-11 w-full items-center justify-center rounded-2xl"
        aria-busy={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
      <div className="text-muted-foreground text-center text-sm">
        <Link href={ROUTES.signIn} className={uiGoldTextLink}>
          Back to sign in
        </Link>
      </div>
    </form>
  );
};
