"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";

import { PropertyHeroStateLabel } from "@/features/properties/components/PropertyHeroStateLabel";
import { PropertyImage } from "@/features/properties/components/PropertyImage";
import { cn } from "@/lib/utils";

export type PropertyGalleryProps = {
  title: string;
  images: string[];
  /**
   * `featured` — tall hero (detail page), optional overlay, thumbnail strip.
   * `default` — standard aspect gallery.
   */
  layout?: "default" | "featured";
  /** Rendered top-left on the hero image (e.g. status badge). */
  heroOverlay?: ReactNode;
  /** State/region name — bottom-left on featured hero (detail page). */
  stateLabel?: string;
};

export const PropertyGallery = ({
  title,
  images,
  layout = "default",
  heroOverlay,
  stateLabel,
}: PropertyGalleryProps) => {
  const trimmedStateLabel = stateLabel?.trim() ?? "";
  const slides = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const mainSrc = slides[active] ?? slides[0];

  if (!mainSrc) {
    if (layout === "featured") {
      return (
        <div
          className="border-border bg-muted/40 text-muted-foreground flex h-[min(360px,85vw)] w-full items-center justify-center border-b text-sm md:h-[400px]"
          role="img"
          aria-label={`${title} — no photos yet`}
        >
          Photos coming soon
        </div>
      );
    }
    return (
      <div
        className="border-border bg-muted/40 text-muted-foreground flex aspect-[4/3] items-center justify-center rounded-2xl border-2 text-sm shadow-none"
        role="img"
        aria-label={`${title} — no photos yet`}
      >
        Photos coming soon
      </div>
    );
  }

  const thumbRow =
    slides.length > 1 ? (
      <div className="border-border bg-muted/30 flex gap-2 overflow-x-auto border-t px-3 py-3">
        {slides.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all shadow-none",
              index === active
                ? "border-gold"
                : "border-transparent hover:border-border",
            )}
            aria-label={`Show image ${index + 1}`}
            aria-pressed={index === active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small thumbs */}
            <img src={src} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    ) : null;

  if (layout === "featured") {
    return (
      <>
        <div className="relative h-[min(360px,85vw)] w-full bg-muted md:h-[400px]">
          <Image
            src={mainSrc}
            alt={title}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
            className="object-cover"
          />
          {heroOverlay ? (
            <div className="absolute top-5 left-5 z-10 max-w-[min(90%,20rem)]">{heroOverlay}</div>
          ) : null}
          {trimmedStateLabel ? (
            <div className="absolute bottom-5 left-5 z-10 max-w-[min(90%,22rem)]">
              <PropertyHeroStateLabel stateLabel={trimmedStateLabel} />
            </div>
          ) : null}
        </div>
        {thumbRow}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PropertyImage
        src={mainSrc}
        alt={title}
        eagerLoad
        className="rounded-2xl"
      />
      {thumbRow}
    </div>
  );
};
