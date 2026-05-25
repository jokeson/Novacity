"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userDisplayInitials } from "@/lib/userInitials";
import { cn } from "@/lib/utils";

export type UserAvatarProps = {
  name: string;
  /** Stored profile image URL (`User.image` / Cloudinary `secure_url`). */
  imageUrl?: string | null;
  size?: "sm" | "default" | "lg";
  className?: string;
  fallbackClassName?: string;
  imageAlt?: string;
};

export const UserAvatar = ({
  name,
  imageUrl,
  size = "default",
  className,
  fallbackClassName,
  imageAlt,
}: UserAvatarProps) => {
  const trimmed =
    typeof imageUrl === "string" && imageUrl.trim().length > 0
      ? imageUrl.trim()
      : null;
  const initials = userDisplayInitials(name, "");

  return (
    <Avatar size={size} className={className}>
      {trimmed ? (
        <AvatarImage src={trimmed} alt={imageAlt ?? name} />
      ) : null}
      <AvatarFallback
        className={cn(
          "bg-muted text-muted-foreground font-semibold",
          fallbackClassName,
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
