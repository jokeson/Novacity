import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { HomeSectionBandShell } from "@/features/home/components/HomeSectionBandShell";
import { HOME_SECTION_TITLE_ACCENT_CLASS } from "@/features/home/constants/homeSectionBands";
import type { HomepageStateHighlight } from "@/server/queries/propertySearch.queries";
import { cn } from "@/lib/utils";

import { StateHighlightCard } from "./StateHighlightCard";

export type StatesHomeSectionProps = {
  states: HomepageStateHighlight[];
  fetchFailed: boolean;
  fetchErrorMessage?: string | null;
};

export const StatesHomeSection = ({
  states,
  fetchFailed,
  fetchErrorMessage,
}: StatesHomeSectionProps) => {
  return (
    <HomeSectionBandShell
      id="states"
      tone="compass"
      aria-labelledby="home-states-heading"
    >
      <Container>
        <div>
          <SectionTitle
            eyebrow="South Sudan"
            title="Explore by state"
            description="Discover listings across regions where sellers are active — each card opens properties in that state."
            headingId="home-states-heading"
          />
          <div className={HOME_SECTION_TITLE_ACCENT_CLASS} aria-hidden />
        </div>

        {fetchFailed ? (
          <EmptyState
            className="mt-10"
            title="Could not load states"
            description={
              fetchErrorMessage ??
              "Something went wrong while loading state highlights."
            }
            icon={AlertCircle}
            action={
              <Link
                href={ROUTES.properties}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Browse all properties
              </Link>
            }
          />
        ) : states.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="No states with listings yet"
            description="When sellers publish listings with a state or region, popular areas will appear here."
            action={
              <Link
                href={ROUTES.properties}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Browse marketplace
              </Link>
            }
          />
        ) : (
          <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {states.map((state) => (
              <li key={state.slug}>
                <StateHighlightCard state={state} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </HomeSectionBandShell>
  );
};
