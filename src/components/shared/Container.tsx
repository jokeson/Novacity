import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export type ContainerProps = ComponentPropsWithoutRef<"div">;

export const Container = ({
  className,
  ...props
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto min-w-0 w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
};
