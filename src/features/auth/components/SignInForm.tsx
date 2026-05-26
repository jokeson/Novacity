"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { uiGoldTextLink } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

import { signInMutation } from "../actions/authActions";
import type { SignInInput } from "../validators/authSchema";
import { signInSchema } from "../validators/authSchema";

export type SignInFormProps = {
  callbackUrl?: string;
  className?: string;
  /** When opening sign-in after registration, prefill the new account email. */
  defaultEmail?: string;
  /** When set (e.g. inside `AuthModal`), switches view instead of navigating to `/sign-up`. */
  onSwitchToSignUp?: () => void;
  variant?: "page" | "modal";
};

export const SignInForm = ({
  callbackUrl,
  className,
  defaultEmail = "",
  onSwitchToSignUp,
  variant = "page",
}: SignInFormProps) => {
  const isModal = variant === "modal";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: defaultEmail, password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await signInMutation(values, callbackUrl);

    if (result.ok) {
      router.replace(result.redirectTo);
      return;
    }

    if (result.fieldErrors) {
      for (const [key, messages] of Object.entries(result.fieldErrors)) {
        if (!messages?.length) {
          continue;
        }
        setError(key as keyof SignInInput, { message: messages[0] });
      }
    }

    if (result.message) {
      setError("password", { message: result.message });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn(isModal ? authModalFormClassName : "flex flex-col gap-5", className)}
      noValidate
    >
      <div className={cn("flex flex-col", isModal ? "gap-1" : "gap-2")}>
        <Label htmlFor="sign-in-email">Email</Label>
        <Input
          id="sign-in-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "sign-in-email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="sign-in-email-error" className="text-destructive text-sm" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div className={cn("flex flex-col", isModal ? "gap-1" : "gap-2")}>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="sign-in-password">Password</Label>
          <Link href={ROUTES.forgotPassword} className={cn(uiGoldTextLink, "text-xs")}>
            Forgot password?
          </Link>
        </div>
        <Input
          id="sign-in-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "sign-in-password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p id="sign-in-password-error" className="text-destructive text-sm" role="alert">
            {errors.password.message}
          </p>
        ) : null}
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
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
      {isModal ? null : (
        <p className="text-muted-foreground text-xs leading-relaxed">
          Staff accounts with elevated privileges unlock the admin console automatically after
          authentication.
        </p>
      )}
      <div
        className={cn(
          "text-muted-foreground text-center",
          isModal ? "text-xs" : "text-sm",
        )}
      >
        Need an account?{" "}
        {onSwitchToSignUp ? (
          <button
            type="button"
            className={uiGoldTextLink}
            onClick={onSwitchToSignUp}
          >
            Create one
          </button>
        ) : (
          <Link href={ROUTES.signUp} className={uiGoldTextLink}>
            Create one
          </Link>
        )}
      </div>
    </form>
  );
};
