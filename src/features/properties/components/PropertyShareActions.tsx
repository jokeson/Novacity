"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { propertyDetailPath } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type PropertyShareActionsProps = {
  slug: string;
  title: string;
  /** Contrast styling when placed on the listing card navy footer. */
  onNavyFooter?: boolean;
};

const navyFooterBtn =
  "border-primary-foreground/40 bg-transparent text-gold hover:bg-primary-foreground/10 hover:text-gold";

export const PropertyShareActions = ({
  slug,
  title,
  onNavyFooter = false,
}: PropertyShareActionsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const absolute = `${window.location.origin}${propertyDetailPath(slug)}`;
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [slug]);

  const handleShare = useCallback(async () => {
    const absolute = `${window.location.origin}${propertyDetailPath(slug)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: absolute });
      } catch {
        /* dismissed */
      }
    } else {
      await handleCopy();
    }
  }, [handleCopy, slug, title]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(onNavyFooter && navyFooterBtn)}
        onClick={handleCopy}
      >
        {copied ? "Link copied" : "Copy link"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(onNavyFooter && navyFooterBtn)}
        onClick={handleShare}
      >
        Share
      </Button>
    </div>
  );
};
