"use client";

import { useRouter } from "next/navigation";

import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { stateSlugFromLabel } from "@/features/search/utils/stateSlug";
import { cn } from "@/lib/utils";

export type StatesNavDropdownProps = {
  states: string[];
  className?: string;
};

const triggerClass =
  "text-muted-foreground hover:text-foreground data-popup-open:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-md text-sm font-medium transition-colors duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring";

export const StatesNavDropdown = ({ states, className }: StatesNavDropdownProps) => {
  const router = useRouter();

  if (!states.length) {
    return (
      <span
        className={cn(
          "text-muted-foreground cursor-default text-sm font-medium",
          className,
        )}
        title="States appear when published listings include a state or region."
      >
        States
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        closeDelay={180}
        className={cn(triggerClass, className)}
      >
        <span className="inline-flex items-center gap-1">
          States
          <ChevronDown className="size-4 opacity-60" aria-hidden />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-72 min-w-[12rem] overflow-y-auto ring-0 shadow-lg"
      >
        {states.map((label) => (
          <DropdownMenuItem
            key={label}
            className="cursor-pointer"
            onClick={() => {
              router.push(`/states/${stateSlugFromLabel(label)}`);
            }}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
