import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { HomeListingPromoImage } from "@/features/home/types/homeListing";
import { uiStandaloneImageFrame } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type HomeListingSectionPromoImageProps = {
  image: HomeListingPromoImage;
  browseHref: string;
  browseLabel: string;
  className?: string;
};

export const HomeListingSectionPromoImage = ({
  image,
  browseHref,
  browseLabel,
  className,
}: HomeListingSectionPromoImageProps) => {
  const overlayLines = image.overlayLines ?? [];

  return (
    <div
      className={cn(
        uiStandaloneImageFrame,
        "min-h-[18rem] w-full sm:min-h-[22rem] lg:min-h-[28rem]",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 70vw"
        priority={false}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/45 to-primary/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,160,23,0.18),_transparent_60%)]"
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
        {overlayLines.length > 0 ? (
          <div className="mb-6 max-w-xl space-y-1 sm:mb-8">
            {overlayLines.map((line, index) => (
              <p
                key={line}
                className={cn(
                  "font-heading text-balance text-white",
                  index === 0 &&
                    "text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl",
                  index === 1 &&
                    "text-xl font-medium text-white/95 sm:text-2xl md:text-3xl",
                  index >= 2 &&
                    "text-gold text-lg font-semibold tracking-wide sm:text-xl md:text-2xl",
                )}
              >
                {line}
              </p>
            ))}
          </div>
        ) : null}

        <Link
          href={browseHref}
          className={cn(
            buttonVariants({ variant: "gold" }),
            "pointer-events-auto h-11 w-fit cursor-pointer px-8 text-base font-semibold sm:h-12",
          )}
        >
          {browseLabel}
        </Link>
      </div>
    </div>
  );
};
