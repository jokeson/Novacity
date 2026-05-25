"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { AuthModal, type AuthModalView } from "@/features/auth/components/AuthModal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type AuthPageRouteClientProps = {
  mode: AuthModalView;
  callbackUrl?: string;
};

export const AuthPageRouteClient = ({ mode, callbackUrl }: AuthPageRouteClientProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        router.push(ROUTES.home);
      }
    },
    [router],
  );

  return (
    <div
      className={cn("bg-muted/40 min-h-[calc(100vh-4rem)] flex-1")}
      aria-label="Authentication"
    >
      <AuthModal
        open={open}
        onOpenChange={handleOpenChange}
        initialView={mode}
        callbackUrl={callbackUrl}
      />
    </div>
  );
};
