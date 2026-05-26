import { cn } from "@/lib/utils";

export const authModalDialogClassName = cn(
  "z-[60] grid w-[min(100vw-1.25rem,24rem)] max-w-md gap-0 overflow-hidden rounded-2xl border-2 border-border bg-card p-0 shadow-lg sm:w-full sm:max-w-md",
  "[&_[data-slot=dialog-close]]:top-2.5 [&_[data-slot=dialog-close]]:right-2.5",
  "[&_[data-slot=dialog-close]]:text-primary-foreground [&_[data-slot=dialog-close]]:hover:bg-primary-foreground/10 [&_[data-slot=dialog-close]]:hover:text-gold",
);

export const authModalOverlayClassName = "z-[55] bg-primary/40 backdrop-blur-sm";

export const authModalFormClassName = cn(
  "flex flex-col gap-2.5 sm:gap-3",
  "[&_label]:text-xs [&_label]:font-medium",
  "[&_[data-slot=input]]:h-9 [&_[data-slot=input]]:rounded-xl [&_[data-slot=input]]:text-sm",
  "[&_[data-slot=input]]:focus-visible:border-gold/50 [&_[data-slot=input]]:focus-visible:ring-gold/25",
  "[&_.text-destructive]:text-xs",
);

export const authModalSubmitClassName =
  "flex h-10 w-full cursor-pointer items-center justify-center rounded-xl text-sm font-semibold sm:h-11";
