"use client";

import { startTransition, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{view === "sign-in" ? "Sign in" : "Create account"}</DialogTitle>
          <DialogDescription>
            {view === "sign-in"
              ? "Use your Novacity email and password. Staff with admin access use the same sign-in."
              : "New accounts are created as individual users. Company access is granted by an administrator after signup."}
          </DialogDescription>
        </DialogHeader>
        {bannerMessage ? (
          <p
            className="border-primary/20 bg-primary/5 text-foreground rounded-xl border px-3 py-2 text-sm leading-relaxed"
            role="status"
          >
            {bannerMessage}
          </p>
        ) : null}
        {view === "sign-in" ? (
          <SignInForm
            key={`sign-in-${prefillEmail}`}
            callbackUrl={callbackUrl}
            defaultEmail={prefillEmail}
            onSwitchToSignUp={handleSwitchToSignUp}
          />
        ) : (
          <SignUpForm
            key="sign-up"
            onSignUpSuccess={handleSignUpSuccess}
            onSwitchToSignIn={handleSwitchToSignIn}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
