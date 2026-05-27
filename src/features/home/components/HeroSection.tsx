"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { AdvancedSearchModal } from "@/features/home/components/AdvancedSearchModal";
import { HOME_HERO_BRANDING } from "@/features/home/constants/homeHeroBranding";
import type { ResolvedHomeHeroContent } from "@/features/home/types/homeHero";
import { uiButtonGoldProminent, uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type HeroSectionProps = {
  content: ResolvedHomeHeroContent;
  listingStates: string[];
  /** When true, show the dashboard list / verify CTA (signed-in users only). */
  showListPropertyCta?: boolean;
  listPropertyHref?: string;
  listPropertyLabel?: string;
};

const heroGoldCtaClassName = cn(
  buttonVariants({ variant: "gold" }),
  uiButtonGoldProminent,
  "w-full cursor-pointer sm:w-auto",
);

const heroOutlineCtaClassName =
  "border-primary/25 bg-card/80 text-primary hover:border-primary/40 hover:bg-card h-11 w-full cursor-pointer rounded-2xl px-8 text-base shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md sm:h-12 sm:w-auto";

export const HeroSection = ({
  content,
  listingStates,
  showListPropertyCta = false,
  listPropertyHref = ROUTES.dashboardListingsCreate,
  listPropertyLabel = "List a property",
}: HeroSectionProps) => {
  const reduceMotion = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOpenSearch = (): void => {
    setSearchOpen(true);
  };

  return (
    <section
      className="relative min-h-[22rem] overflow-hidden border-b border-border sm:min-h-[26rem] md:min-h-[30rem] lg:min-h-[36rem] xl:min-h-[40rem]"
      aria-labelledby="hero-heading"
    >
      <Image
        src={content.imageUrl}
        alt={content.imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_srgb,var(--gold)_58%,white)_0%,color-mix(in_srgb,var(--gold)_44%,white)_26%,color-mix(in_srgb,var(--gold)_24%,white)_46%,color-mix(in_srgb,var(--gold)_8%,transparent)_62%,transparent_78%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_90%_at_0%_45%,color-mix(in_srgb,var(--gold)_22%,white),transparent_68%)]"
        aria-hidden
      />

      <Container className="relative z-10 grid min-h-[22rem] grid-rows-[minmax(0,1fr)_auto] items-stretch gap-4 py-10 sm:min-h-[26rem] sm:gap-5 sm:py-12 md:min-h-[30rem] md:gap-6 md:py-16 lg:min-h-[36rem] lg:gap-8 lg:py-20 xl:min-h-[40rem] xl:gap-10 xl:py-24">
        <motion.div
          className="flex w-full max-w-3xl flex-col justify-center gap-6 self-center sm:gap-8"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-4">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest md:text-sm">
              {content.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className={cn(uiTypography.hero, "text-primary")}
            >
              {content.heading}
            </h1>
            <p className="text-foreground/85 max-w-2xl text-pretty text-sm leading-relaxed">
              {content.body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href={ROUTES.properties} className={heroGoldCtaClassName}>
              Browse listings
            </Link>
            <Button
              type="button"
              variant="outline"
              className={heroOutlineCtaClassName}
              aria-label="Open property search"
              onClick={handleOpenSearch}
            >
              <Search className="text-gold size-4 shrink-0" aria-hidden />
              Search properties
            </Button>
            {showListPropertyCta ? (
              <Link href={listPropertyHref} className={heroGoldCtaClassName}>
                {listPropertyLabel}
              </Link>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          className="flex w-full shrink-0 justify-end self-end"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-label={`${HOME_HERO_BRANDING.companyName} — ${HOME_HERO_BRANDING.slogan}`}
        >
          <div className="border-primary/10 bg-card/55 flex max-w-[10.5rem] flex-col items-start gap-0.5 rounded-xl border px-2.5 py-2 text-left shadow-sm backdrop-blur-sm sm:max-w-[13rem] md:max-w-[15rem] lg:max-w-[17rem]">
            <p className="text-primary font-heading text-xs leading-snug font-semibold sm:text-sm">
              {HOME_HERO_BRANDING.companyName}
            </p>
            <p className="text-gold text-[9px] font-medium tracking-wide uppercase sm:text-[10px]">
              {HOME_HERO_BRANDING.location}
            </p>
            <p className="text-muted-foreground text-[10px] leading-snug sm:text-[11px]">
              {HOME_HERO_BRANDING.slogan}
            </p>
          </div>
        </motion.div>
      </Container>

      <AdvancedSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        listingStates={listingStates}
      />
    </section>
  );
};
