"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { AuthModal, type AuthModalView } from "@/features/auth/components/AuthModal";

export type NavbarActionsProps = {
  className?: string;
  stacked?: boolean;
  /** Called right before opening the auth dialog (e.g. close mobile sheet). */
  onWillOpenAuth?: () => void;
};

export const NavbarActions = ({
  className,
  stacked = false,
  onWillOpenAuth,
}: NavbarActionsProps) => {
  const sizeCls = stacked ? "default" : "sm";
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState<AuthModalView>("sign-in");

  const handleOpenAuth = (view: AuthModalView): void => {
    onWillOpenAuth?.();
    setAuthInitialView(view);
    setAuthOpen(true);
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2",
          stacked && "flex-col items-stretch",
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size={sizeCls}
          className="text-gold hover:text-gold hover:bg-gold/10 cursor-pointer justify-center"
          onClick={() => handleOpenAuth("sign-in")}
        >
          Sign in
        </Button>
        <Button
          type="button"
          variant="gold"
          size={sizeCls}
          className="cursor-pointer justify-center"
          onClick={() => handleOpenAuth("sign-up")}
        >
          Create account
        </Button>
      </div>
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        initialView={authInitialView}
      />
    </>
  );
};
