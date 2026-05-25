"use client";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { mobileSidebarProfileClassName } from "@/components/shared/navigation/sidebarNavStyles";
import { cn } from "@/lib/utils";

/** Minimal profile fields for the marketing navbar (no role / email in UI). */
export type NavbarProfilePayload = {
  name: string;
  image: string | null;
};

export type UserNavbarProfileProps = {
  name: string;
  image?: string | null;
  className?: string;
  /** Navy drawer footer styling */
  tone?: "default" | "on-primary";
};

export const UserNavbarProfile = ({
  name,
  image,
  className,
  tone = "default",
}: UserNavbarProfileProps) => {
  const isOnPrimary = tone === "on-primary";

  return (
    <div
      role="group"
      aria-label={`Signed in as ${name}`}
      className={cn(
        isOnPrimary
          ? mobileSidebarProfileClassName
          : "border-border/80 bg-muted/25 flex max-w-[11.5rem] shrink-0 items-center gap-2 rounded-xl border px-2 py-1 shadow-sm transition-colors duration-300 hover:bg-muted/45",
        className,
      )}
    >
      <UserAvatar
        name={name}
        imageUrl={image}
        size="sm"
        className={cn("ring-2", isOnPrimary ? "ring-primary-foreground/25" : "ring-border/50")}
        fallbackClassName={cn(
          "text-[0.65rem] font-semibold",
          isOnPrimary ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/15 text-primary",
        )}
        imageAlt=""
      />
      <span
        className={cn(
          "truncate text-sm font-medium tracking-tight",
          isOnPrimary ? "text-primary-foreground" : "text-foreground",
        )}
        title={name}
      >
        {name}
      </span>
    </div>
  );
};
