import { Store } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { uiMarketplacePageHeaderShell } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type MarketplacePageHeaderProps = {
  title?: string;
  description: string;
  className?: string;
};

export const MarketplacePageHeader = ({
  title = "Marketplace listings",
  description,
  className,
}: MarketplacePageHeaderProps) => {
  return (
    <header className={cn(uiMarketplacePageHeaderShell, "min-w-0", className)}>
      <Container>
        <div className="flex min-w-0 max-w-3xl flex-col gap-2 sm:gap-2.5">
          <h1 className="font-heading flex items-center gap-2.5 text-xl font-semibold tracking-tight text-gold sm:gap-3 sm:text-2xl md:text-[1.65rem] lg:text-3xl">
            <span
              className="bg-gold/15 text-gold flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10"
              aria-hidden
            >
              <Store className="size-[1.125rem] sm:size-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 text-balance">{title}</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/90 sm:text-[0.9375rem] md:max-w-2xl md:text-base">
            {description}
          </p>
        </div>
      </Container>
    </header>
  );
};
