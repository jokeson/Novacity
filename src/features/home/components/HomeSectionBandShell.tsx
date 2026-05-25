import type { ReactNode } from "react";

import {
  HOME_SECTION_BAND_CLASS,
  HOME_SECTION_BAND_DECOR,
} from "@/features/home/constants/homeSectionBands";
import type { HomeListingSectionTone } from "@/features/home/types/homeListing";
import { cn } from "@/lib/utils";

export type HomeSectionBandShellProps = {
  tone: HomeListingSectionTone;
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
  "aria-busy"?: boolean;
};

export const HomeSectionBandShell = ({
  tone,
  children,
  className,
  id,
  "aria-labelledby": ariaLabelledby,
  "aria-busy": ariaBusy,
}: HomeSectionBandShellProps) => (
  <section
    id={id}
    aria-labelledby={ariaLabelledby}
    aria-busy={ariaBusy}
    className={cn(HOME_SECTION_BAND_CLASS[tone], className)}
  >
    <div className={HOME_SECTION_BAND_DECOR[tone]} aria-hidden />
    <div className="relative z-[1]">{children}</div>
  </section>
);
