"use client";

import { startTransition, useEffect, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  authModalDialogClassName,
  authModalOverlayClassName,
} from "@/features/auth/constants/authModalStyles";
import { cn } from "@/lib/utils";

import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export type AuthModalView = "sign-in" | "sign-up";

export type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialView: AuthModalView;
  callbackUrl?: string;
};

export const AuthModal = ({
  open,
  onOpenChange,
  initialView,
  callbackUrl,
}: AuthModalProps) => {
  const [view, setView] = useState<AuthModalView>(initialView);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [prefillEmail, setPrefillEmail] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    startTransition(() => {
      setView(initialView);
      setBannerMessage(null);
      setPrefillEmail("");
    });
  }, [open, initialView]);

  const handleSignUpSuccess = (email: string): void => {
    setPrefillEmail(email);
    setBannerMessage("Account created successfully. Please sign in.");
    setView("sign-in");
  };

  const handleSwitchToSignUp = (): void => {
    setBannerMessage(null);
    setView("sign-up");
  };

  const handleSwitchToSignIn = (): void => {
    setBannerMessage(null);
    setView("sign-in");
  };

  const isSignIn = view === "sign-in";
  const HeaderIcon = isSignIn ? LogIn : UserPlus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        overlayClassName={authModalOverlayClassName}
        className={authModalDialogClassName}
      >
        <div className="border-primary-foreground/10 bg-primary border-b px-4 py-3 pr-11 sm:px-5 sm:py-3.5">
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
            <span
              className="border-gold/40 bg-gold/15 text-gold flex size-8 shrink-0 items-center justify-center rounded-xl border sm:size-9"
              aria-hidden
            >
              <HeaderIcon className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="font-heading text-gold text-base leading-tight font-semibold tracking-tight sm:text-lg">
                {isSignIn ? "Sign in" : "Create account"}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/85 mt-0.5 text-xs leading-snug">
                {isSignIn
                  ? "Use your Novacity email and password."
                  : "New accounts start as individual users; company access is granted by staff."}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="max-h-[min(70vh,32rem)] overflow-y-auto p-3 sm:p-4">
          {bannerMessage ? (
            <p
              className="border-gold/35 bg-gold/10 text-foreground mb-2.5 rounded-xl border px-3 py-2 text-xs leading-relaxed sm:mb-3 sm:text-sm"
              role="status"
            >
              {bannerMessage}
            </p>
          ) : null}
          {isSignIn ? (
            <SignInForm
              key={`sign-in-${prefillEmail}`}
              callbackUrl={callbackUrl}
              defaultEmail={prefillEmail}
              onSwitchToSignUp={handleSwitchToSignUp}
              variant="modal"
            />
          ) : (
            <SignUpForm
              key="sign-up"
              onSignUpSuccess={handleSignUpSuccess}
              onSwitchToSignIn={handleSwitchToSignIn}
              variant="modal"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
