import {
  Building2,
  Globe2,
  KeyRound,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { HOME_SECTION_TITLE_ACCENT_CLASS } from "@/features/home/constants/homeSectionBands";
import {
  uiSurfaceCardStatic,
  uiTypography,
} from "@/lib/uiContext";
import { cn } from "@/lib/utils";

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type AudienceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const PLATFORM_FEATURES: FeatureItem[] = [
  {
    title: "Curated public catalog",
    description:
      "Filters tuned for South Sudan — browse by state, type, and budget without clutter.",
    icon: Search,
  },
  {
    title: "Fair listing rules",
    description:
      "Owners and companies publish with clear standards; PassKeys protect quality where it matters.",
    icon: ShieldCheck,
  },
  {
    title: "Dashboard tools",
    description:
      "Inventory, notifications, and PassKeys in one place so sellers stay in control.",
    icon: LayoutDashboard,
  },
];

const AUDIENCES: AudienceItem[] = [
  {
    title: "Buyers & renters",
    description:
      "Explore listings, filter by area and budget, and reach owners through structured interest forms — without noisy middlemen by default.",
    icon: Users,
  },
  {
    title: "Sellers & property owners",
    description:
      "Publish with quality gates where required, track views, and manage status from draft to sold or rented.",
    icon: KeyRound,
  },
  {
    title: "Companies",
    description:
      "Showcase inventory at scale with the same premium catalog experience and admin oversight when needed.",
    icon: Building2,
  },
  {
    title: "Foreigners & investors",
    description:
      "Transparent listings, state-level discovery, and a roadmap aimed at cross-border trust — starting in South Sudan.",
    icon: Globe2,
  },
];

const SectionHeader = ({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) => (
  <header className="max-w-2xl">
    <p className={uiTypography.eyebrow}>{eyebrow}</p>
    <h2
      id={id}
      className={cn(
        uiTypography.sectionTitle,
        "mt-2 text-pretty text-2xl sm:text-3xl",
      )}
    >
      {title}
    </h2>
    {description ? (
      <p
        className={cn(
          uiTypography.body,
          "mt-3 text-base leading-relaxed text-pretty sm:text-[1.0625rem]",
        )}
      >
        {description}
      </p>
    ) : null}
    <div className={HOME_SECTION_TITLE_ACCENT_CLASS} aria-hidden />
  </header>
);

export const NovacityPageView = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        aria-labelledby="novacity-hero-heading"
        className={cn(
          "relative overflow-hidden border-b border-border",
          "bg-[linear-gradient(165deg,color-mix(in_srgb,var(--primary)_12%,var(--background))_0%,var(--background)_45%,color-mix(in_srgb,var(--gold)_12%,var(--background))_100%)]",
          "py-12 sm:py-14 md:py-20",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_100%_-10%,color-mix(in_srgb,var(--gold)_22%,transparent),transparent_60%)]"
          aria-hidden
        />
        <Container className="relative z-[1]">
          <div className="mx-auto max-w-3xl text-center">
           
            <h1
              id="novacity-hero-heading"
              className={cn(
                uiTypography.hero,
                "text-foreground mt-3 text-pretty text-3xl sm:text-4xl md:text-5xl",
              )}
            >
              <span className="text-gold drop-shadow-[0_0_14px_rgba(212,160,23,0.35)]">
                Novacity
              </span>{" "}
              connects people to property
            </h1>
            <p
              className={cn(
                "text-foreground/85 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg sm:leading-8",
              )}
            >
              A modern marketplace and technology layer for discovering, listing, and
              transacting real estate across South Sudan — built for clarity, trust, and
              growth.
            </p>
          </div>
        </Container>
      </section>

      {/* What we do */}
      <section
        aria-labelledby="novacity-platform-heading"
        className="py-12 sm:py-14 md:py-18"
      >
        <Container>
          <SectionHeader
            id="novacity-platform-heading"
            eyebrow="What we do"
            title="A single platform for the full journey"
            description="From first search to serious inquiry, Novacity keeps listings organized, search fast, and communication between parties straightforward."
          />
          <ul className="mt-8 flex list-none flex-col gap-4 sm:mt-10 sm:gap-5">
            {PLATFORM_FEATURES.map(({ title, description, icon: Icon }) => (
              <li key={title}>
                <article
                  className={cn(
                    uiSurfaceCardStatic,
                    "flex gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6",
                  )}
                >
                  <span
                    className="bg-gold/12 text-gold flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12"
                    aria-hidden
                  >
                    <Icon className="size-5 sm:size-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground text-lg font-semibold tracking-tight text-pretty sm:text-xl">
                      {title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-base leading-relaxed text-pretty">
                      {description}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Who we serve */}
      <section
        aria-labelledby="novacity-audience-heading"
        className="border-border border-t bg-[linear-gradient(180deg,color-mix(in_srgb,var(--muted)_55%,var(--background))_0%,var(--background)_100%)] py-12 sm:py-14 md:py-18"
      >
        <Container>
          <SectionHeader
            id="novacity-audience-heading"
            eyebrow="Who we serve"
            title="Built for everyone in the property ecosystem"
          />
          <ul className="mt-8 grid list-none gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {AUDIENCES.map(({ title, description, icon: Icon }) => (
              <li key={title} className="min-w-0">
                <article
                  className={cn(
                    uiSurfaceCardStatic,
                    "border-gold/20 h-full border-l-4 p-5 sm:p-6",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-gold bg-primary/5 flex size-10 shrink-0 items-center justify-center rounded-lg"
                      aria-hidden
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="text-foreground pt-0.5 text-lg font-semibold tracking-tight text-pretty">
                      {title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mt-3 text-base leading-relaxed text-pretty">
                    {description}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Vision */}
      <section
        aria-labelledby="novacity-vision-heading"
        className={cn(
          "border-border border-t py-12 sm:py-14 md:py-16",
          "bg-[linear-gradient(140deg,color-mix(in_srgb,var(--primary)_10%,var(--background))_0%,color-mix(in_srgb,var(--gold)_14%,var(--background))_100%)]",
        )}
      >
        <Container>
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className={uiTypography.eyebrow} id="novacity-vision-heading">
              Our focus
            </p>
            <p className="text-foreground mt-4 text-xl leading-relaxed font-medium text-pretty sm:text-2xl sm:leading-9">
              Novacity is South Sudan–focused today and architected to grow with new
              regions, data sources, and partner workflows as the market matures.
            </p>
          </blockquote>
        </Container>
      </section>
    </div>
  );
};
