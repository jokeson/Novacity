import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Container } from "@/components/shared/Container";
import { HomeSectionBandShell } from "@/features/home/components/HomeSectionBandShell";

export const StatesHomeSectionFallback = () => (
  <HomeSectionBandShell
    id="states"
    tone="compass"
    aria-labelledby="home-states-heading"
    aria-busy
  >
    <Container>
      <LoadingSkeleton className="mb-8 h-20 w-full max-w-xl rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingSkeleton
            key={index}
            className="h-32 rounded-2xl sm:h-36"
          />
        ))}
      </div>
    </Container>
  </HomeSectionBandShell>
);
