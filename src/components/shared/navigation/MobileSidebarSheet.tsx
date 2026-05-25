"use client";

import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  sidebarSheetBodyClassName,
  sidebarSheetFooterClassName,
  sidebarSheetHeaderClassName,
  sidebarSheetScrollClassName,
  sidebarSheetSurfaceClassName,
  sidebarSheetTitleClassName,
  sidebarSheetWidthClassName,
} from "@/components/shared/navigation/sidebarNavStyles";
import { cn } from "@/lib/utils";

export type MobileSidebarSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerLabel: string;
  trigger: ReactNode;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
};

export const MobileSidebarSheet = ({
  open,
  onOpenChange,
  triggerLabel,
  trigger,
  title,
  children,
  footer,
  triggerClassName,
  contentClassName,
}: MobileSidebarSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger
      aria-label={triggerLabel}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), triggerClassName)}
    >
      {trigger}
    </SheetTrigger>
    <SheetContent
      side="left"
      className={cn(
        sidebarSheetSurfaceClassName,
        sidebarSheetWidthClassName,
        contentClassName,
      )}
    >
      <SheetHeader className={sidebarSheetHeaderClassName}>
        <SheetTitle className={sidebarSheetTitleClassName}>{title}</SheetTitle>
      </SheetHeader>
      <div className={sidebarSheetBodyClassName}>
        <div className={sidebarSheetScrollClassName}>{children}</div>
        {footer ? <div className={sidebarSheetFooterClassName}>{footer}</div> : null}
      </div>
    </SheetContent>
  </Sheet>
);
