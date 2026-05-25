"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { propertyDetailPath, ROUTES } from "@/constants/routes";
import {
  addFavoriteAction,
  removeFavoriteAction,
} from "@/features/favorites/actions/favoriteActions";
import { cn } from "@/lib/utils";

export type FavoriteButtonProps = {
  propertyId: string;
  slug: string;
  initialFavorite: boolean;
  isAuthenticated: boolean;
  /** Contrast styling when placed on the listing card navy footer. */
  onNavyFooter?: boolean;
};

const navyFooterOutline =
  "border-primary-foreground/40 bg-transparent text-gold hover:bg-primary-foreground/10 hover:text-gold";
const navyFooterSaved =
  "border-gold bg-gold text-white hover:bg-gold/90 hover:text-white";

export const FavoriteButton = ({
  propertyId,
  slug,
  initialFavorite,
  isAuthenticated,
  onNavyFooter = false,
}: FavoriteButtonProps) => {
  const router = useRouter();
  const [fav, setFav] = useState(initialFavorite);
  const [pending, startTransition] = useTransition();

  if (!isAuthenticated) {
    const callback = encodeURIComponent(propertyDetailPath(slug));
    return (
      <Link
        href={`${ROUTES.signIn}?callbackUrl=${callback}`}
        className={cn(
          buttonVariants({ variant: onNavyFooter ? "outline" : "secondary", size: "sm" }),
          onNavyFooter && navyFooterOutline,
        )}
      >
        Sign in to save
      </Link>
    );
  }

  const handleToggle = () => {
    startTransition(async () => {
      if (fav) {
        const res = await removeFavoriteAction(propertyId, slug);
        if (res.ok) {
          setFav(false);
          router.refresh();
        }
      } else {
        const res = await addFavoriteAction(propertyId, slug);
        if (res.ok) {
          setFav(true);
          router.refresh();
        }
      }
    });
  };

  return (
    <Button
      type="button"
      variant={onNavyFooter ? "outline" : fav ? "default" : "outline"}
      size="sm"
      disabled={pending}
      aria-pressed={fav}
      aria-busy={pending || undefined}
      className={cn(onNavyFooter && (fav ? navyFooterSaved : navyFooterOutline))}
      onClick={handleToggle}
    >
      {fav ? "Saved" : "Save listing"}
    </Button>
  );
};
