import { Container } from "@/components/shared/Container";
import { SectionTitle } from "@/components/shared/SectionTitle";
import {
  uiSurfaceCardStatic,
  uiSurfaceMutedPanel,
  uiTypography,
} from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export const NovacityPageView = () => {
  return (
    <div className="flex flex-col gap-16 py-12 lg:py-16">
      <Container className="max-w-3xl space-y-6 text-center">
        <p className={cn(uiTypography.eyebrow, "text-primary")}>South Sudan real estate</p>
        <h1 className={cn(uiTypography.hero, "text-foreground")}>
          Novacity connects people to property
        </h1>
        <p className={cn(uiTypography.body, "mx-auto max-w-2xl text-base md:text-lg")}>
          Novacity is a modern marketplace and technology layer for discovering, listing, and
          transacting real estate across South Sudan — built for clarity, trust, and growth.
        </p>
      </Container>

      <Container className="max-w-4xl space-y-12">
        <section className="space-y-4">
          <SectionTitle
            eyebrow="What we do"
            title="A single platform for the full journey"
            description="From first search to serious inquiry, Novacity keeps listings organized, search fast, and communication between parties straightforward."
          />
          <ul className={cn(uiTypography.body, "list-inside list-disc space-y-2 text-base")}>
            <li>Curated public catalog with filters tuned for local markets</li>
            <li>Owner and company listings with fair publish rules</li>
            <li>Dashboard tools for inventory, notifications, and PassKeys</li>
          </ul>
        </section>

        <section className="space-y-4">
          <SectionTitle
            eyebrow="Who we serve"
            title="Built for everyone in the property ecosystem"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className={cn(uiSurfaceCardStatic, "p-6")}>
              <h3 className={uiTypography.cardTitle}>Buyers & renters</h3>
              <p className={cn(uiTypography.body, "mt-2")}>
                Explore verified-style listings, filter by area and budget, and reach owners through
                structured interest forms — without noisy middlemen by default.
              </p>
            </div>
            <div className={cn(uiSurfaceCardStatic, "p-6")}>
              <h3 className={uiTypography.cardTitle}>Sellers & property owners</h3>
              <p className={cn(uiTypography.body, "mt-2")}>
                Publish with PassKey-backed quality gates where required, track views, and manage
                lifecycle statuses from draft to sold or rented.
              </p>
            </div>
            <div className={cn(uiSurfaceCardStatic, "p-6")}>
              <h3 className={uiTypography.cardTitle}>Companies</h3>
              <p className={cn(uiTypography.body, "mt-2")}>
                Company accounts can showcase inventory at scale with the same premium catalog
                experience and admin oversight when needed.
              </p>
            </div>
            <div className={cn(uiSurfaceCardStatic, "p-6")}>
              <h3 className={uiTypography.cardTitle}>Foreigners & investors</h3>
              <p className={cn(uiTypography.body, "mt-2")}>
                Transparent listings, state-level discovery, and a product roadmap aimed at
                cross-border trust — starting with South Sudan as home base.
              </p>
            </div>
          </div>
        </section>

        <section className={cn(uiSurfaceMutedPanel, "px-6 py-8 text-center")}>
          <p className={uiTypography.bodyEmphasis}>
            Novacity is South Sudan–focused today and architected to grow with new regions, data
            sources, and partner workflows as the market matures.
          </p>
        </section>
      </Container>
    </div>
  );
};
