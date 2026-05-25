import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex max-w-md flex-col gap-2">
        <p className={uiTypography.eyebrow}>404</p>
        <h1 className={uiTypography.sectionTitle}>Page not found</h1>
        <p className={uiTypography.body}>
          The page you requested does not exist or may have been removed. Try
          the homepage or browse live listings.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={ROUTES.home} className={cn(buttonVariants())}>
          Back to home
        </Link>
        <Link
          href={ROUTES.properties}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Browse properties
        </Link>
      </div>
    </div>
  );
}
