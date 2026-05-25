import { Container } from "@/components/shared/Container";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { HOME_CARD_SURFACE_ON_MUTED_SECTION } from "@/features/home/constants/homeCardSurfaces";
import { HomeSectionBandShell } from "@/features/home/components/HomeSectionBandShell";
import { cn } from "@/lib/utils";

export const CompanyInfoSection = () => {
  const stats = [
    { term: "Cities onboarded", value: "32+" },
    { term: "Curated advisers", value: "120" },
    { term: "Average response time", value: "Under 4 hours" },
  ];

  return (
    <HomeSectionBandShell
      id="company"
      tone="heritage"
      aria-labelledby="company-heading"
      className="border-b"
    >
      <Container>
        <SectionTitle
          eyebrow="Novacity"
          title="Company information"
          description="We obsess over dependable data, humane defaults, and a marketplace that behaves like trusted counsel — fast when you’re decisive, thoughtful when you need space."
          headingId="company-heading"
          className="max-w-2xl"
        />
        <p className="text-muted-foreground mt-8 max-w-3xl text-sm leading-relaxed md:text-base">
          Built for owners, renters, brokers, and companies who expect the same
          polish from software that they demand from bricks and mortar. We never
          crowd the surface — hierarchy, spacing, and motion stay minimal so
          decisions stay lucid.
        </p>
        <dl className="mt-12 grid gap-4 sm:grid-cols-3 lg:gap-6">
          {stats.map(({ term, value }) => (
            <div
              key={term}
              className={cn(
                HOME_CARD_SURFACE_ON_MUTED_SECTION,
                "border-border rounded-2xl border p-5 shadow-sm ring-foreground/5 ring-1",
              )}
            >
              <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                {term}
              </dt>
              <dd className="font-heading mt-2 text-2xl font-semibold tracking-tight text-primary lg:text-3xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </HomeSectionBandShell>
  );
};
