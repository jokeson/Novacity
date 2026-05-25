import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export type BackLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

const backLinkClassName =
  "text-muted-foreground hover:text-gold focus-visible:ring-ring inline-flex w-fit max-w-full cursor-pointer items-center gap-1.5 rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]";

export const BackLink = ({ href, label = "Back", className }: BackLinkProps) => (
  <Link href={href} className={cn(backLinkClassName, className)} aria-label={label}>
    <ChevronLeft className="size-4 shrink-0" aria-hidden />
    <span className="truncate">{label}</span>
  </Link>
);
