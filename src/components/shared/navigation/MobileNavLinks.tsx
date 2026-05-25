"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { mainNavCoreItems, mainNavTailItems } from "@/constants/navigation";
import { stateSlugFromLabel } from "@/features/search/utils/stateSlug";
import {
  mobileSidebarNavLinkClassName,
  mobileSidebarNavStatesPanelClassName,
  mobileSidebarNavSubLinkClassName,
} from "@/components/shared/navigation/sidebarNavStyles";
import { cn } from "@/lib/utils";

export type MobileNavLinksProps = {
  className?: string;
  listingStates: string[];
  onNavigate?: () => void;
  /** `sidebar` = navy drawer (default for mobile menu). */
  variant?: "default" | "sidebar";
};

const defaultLinkClass =
  "focus-visible:ring-ring text-foreground hover:bg-muted block min-h-11 cursor-pointer rounded-xl px-3 py-3 text-base font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none";

export const MobileNavLinks = ({
  className,
  listingStates,
  onNavigate,
  variant = "sidebar",
}: MobileNavLinksProps) => {
  const [statesOpen, setStatesOpen] = useState(false);
  const linkClass = variant === "sidebar" ? mobileSidebarNavLinkClassName : defaultLinkClass;
  const subLinkClass =
    variant === "sidebar"
      ? mobileSidebarNavSubLinkClassName
      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 block min-h-10 cursor-pointer rounded-lg px-3 py-2 text-sm";
  const statesPanelClass =
    variant === "sidebar"
      ? mobileSidebarNavStatesPanelClassName
      : "border-border mt-1 ml-1 max-h-56 space-y-0.5 overflow-y-auto rounded-lg border py-1";

  const handleNavigate = (): void => {
    onNavigate?.();
  };

  return (
    <nav aria-label="Primary mobile" className={cn("flex flex-col gap-1", className)}>
      <ul className="flex flex-col gap-0.5">
        {mainNavCoreItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={handleNavigate} className={linkClass}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={cn(linkClass, "w-full justify-between text-start")}
            aria-expanded={statesOpen}
            onClick={() => setStatesOpen((open) => !open)}
          >
            States
            <ChevronDown
              className={cn(
                "size-5 shrink-0 transition-transform duration-300",
                statesOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {statesOpen ? (
            <ul className={statesPanelClass}>
              {listingStates.length ? (
                listingStates.map((label) => (
                  <li key={label}>
                    <Link
                      href={`/states/${stateSlugFromLabel(label)}`}
                      onClick={handleNavigate}
                      className={subLinkClass}
                    >
                      {label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className={cn(subLinkClass, "pointer-events-none opacity-80")}>
                  No states yet — publish a listing with a state or region.
                </li>
              )}
            </ul>
          ) : null}
        </li>
        {mainNavTailItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={handleNavigate} className={linkClass}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
