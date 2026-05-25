"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type NotificationBellProps = {
  initialUnreadCount: number;
  className?: string;
  /**
   * When the bell sits on `bg-primary` (dashboard sidebar), use footer-aligned
   * contrast (gold / white).
   */
  tone?: "default" | "on-primary";
};

export const NotificationBell = ({
  initialUnreadCount,
  className,
  tone = "default",
}: NotificationBellProps) => {
  const label =
    initialUnreadCount > 0
      ? `Notifications, ${initialUnreadCount} unread`
      : "Notifications";

  const onPrimary = tone === "on-primary";

  return (
    <Link
      href={ROUTES.dashboardNotifications}
      aria-label={label}
      className={cn(
        buttonVariants({
          variant: "outline",
          size: "icon",
          className: "relative cursor-pointer rounded-xl shadow-sm transition-all duration-300",
        }),
        onPrimary &&
          "border-primary-foreground/30 bg-primary-foreground/[0.06] text-primary-foreground shadow-none hover:border-gold/50 hover:bg-primary-foreground/12 hover:text-gold",
        className,
      )}
    >
      <Bell className="size-4" aria-hidden />
      {initialUnreadCount > 0 ? (
        <span
          className="bg-destructive text-destructive-foreground absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full text-[0.65rem] font-semibold tabular-nums"
          aria-hidden
        >
          {initialUnreadCount > 99 ? "99+" : initialUnreadCount}
        </span>
      ) : null}
    </Link>
  );
};
