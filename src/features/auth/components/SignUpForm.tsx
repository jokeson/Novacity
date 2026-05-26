"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import {
  authModalFormClassName,
  authModalSubmitClassName,
} from "@/features/auth/constants/authModalStyles";
import { formatPersonName } from "@/lib/formatPersonName";
import { uiGoldTextLink } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

import { signUpMutation } from "../actions/authActions";
import type { SignUpInput } from "../validators/authSchema";
import { signUpSchema } from "../validators/authSchema";

export type SignUpFormProps = {
  className?: string;
  /** Called after a successful registration (no session is created until sign-in). */
  onSignUpSuccess?: (email: string) => void;
  /** When set (e.g. inside `AuthModal`), switches view instead of navigating to `/sign-in`. */
  onSwitchToSignIn?: () => void;
  variant?: "page" | "modal";
};

export const SignUpForm = ({
  className,
  onSignUpSuccess,
  onSwitchToSignIn,
  variant = "page",
}: SignUpFormProps) => {
  const isModal = variant === "modal";
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await signUpMutation(values);

    if (result.ok) {
      reset({
        email: result.email,
        password: "",
        confirmPassword: "",
        name: values.name,
      });
      onSignUpSuccess?.(result.email);
      return;
    }

    if (result.fieldErrors) {
      for (const [key, messages] of Object.entries(result.fieldErrors)) {
        if (!messages?.length) {
          continue;
        }
        setError(key as keyof SignUpInput, {
          message: messages[0],
        });
      }
    }

    if (result.message) {
      setError("email", { message: result.message });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn(isModal ? authModalFormClassName : "flex flex-col gap-5", className)}
      noValidate
    >
      <div className={cn("flex flex-col", isModal ? "gap-1" : "gap-2")}>
        <Label htmlFor="sign-up-name">Full name (optional)</Label>
        <Input
          id="sign-up-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          {...register("name", {
            onBlur: (event) => {
              const value = event.target.value;
              if (!value.trim()) {
                return;
              }
              setValue("name", formatPersonName(value), { shouldValidate: true });
            },
          })}
        />
        {errors.name ? (
          <p className="text-destructive text-sm" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>
      <div className={cn("flex flex-col", isModal ? "gap-1" : "gap-2")}>
        <Label htmlFor="sign-up-email">Email</Label>
        <Input
          id="sign-up-email"
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
      <div
        className={cn(
          "grid gap-2.5",
          isModal ? "grid-cols-1 sm:grid-cols-2 sm:gap-x-3" : "grid-cols-1",
        )}
      >
        <div className={cn("flex flex-col", isModal ? "gap-1" : "gap-2")}>
          <Label htmlFor="sign-up-password">Password</Label>
          <Input
            id="sign-up-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-destructive text-sm" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div className={cn("flex flex-col", isModal ? "gap-1" : "gap-2")}>
          <Label htmlFor="sign-up-confirm">Confirm password</Label>
          <Input
            id="sign-up-confirm"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-destructive text-sm" role="alert">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>
      <Button
        type="submit"
        variant="gold"
        className={cn(
          "flex w-full items-center justify-center rounded-xl",
          isModal ? authModalSubmitClassName : "h-11",
        )}
        aria-busy={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
      {isModal ? null : (
        <p className="text-muted-foreground text-xs leading-relaxed">
          By continuing you agree to fair-use policies. Company access is assigned by Novacity
          staff after your account exists.
        </p>
      )}
      <div
        className={cn(
          "text-muted-foreground text-center",
          isModal ? "text-xs" : "text-sm",
        )}
      >
        Already registered?{" "}
        {onSwitchToSignIn ? (
          <button type="button" className={uiGoldTextLink} onClick={onSwitchToSignIn}>
            Sign in
          </button>
        ) : (
          <Link href={ROUTES.signIn} className={uiGoldTextLink}>
            Sign in
          </Link>
        )}
      </div>
    </form>
  );
};
