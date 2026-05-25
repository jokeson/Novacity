import Link from "next/link";

import { mainNavCoreItems, mainNavTailItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

import { StatesNavDropdown } from "./StatesNavDropdown";

export type DesktopNavLinksProps = {
  className?: string;
  listingStates: string[];
};

const linkClass =
  "text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors duration-300";

export const DesktopNavLinks = ({ className, listingStates }: DesktopNavLinksProps) => {
  return (
    <nav aria-label="Primary" className={cn("flex items-center gap-8", className)}>
      <ul className="flex items-center gap-8">
        {mainNavCoreItems.map((item) => (
          <li key={item.href}>
            <Link className={linkClass} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <StatesNavDropdown states={listingStates} />
        </li>
        {mainNavTailItems.map((item) => (
          <li key={item.href}>
            <Link className={linkClass} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
