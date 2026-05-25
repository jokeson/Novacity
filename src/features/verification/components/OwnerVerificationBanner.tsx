import Link from "next/link";

import { ROUTES } from "@/constants/routes";

export const OwnerVerificationBanner = () => {
  return (
    <div className="border-gold/40 bg-gold/10 text-foreground px-4 py-3 text-sm shadow-sm md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          <span className="font-semibold">Owner verification required.</span> Submit your application
          to unlock listing creation and publishing.
        </p>
        <Link
          href={ROUTES.dashboardVerification}
          className="text-primary shrink-0 font-medium underline-offset-4 hover:underline"
        >
          Open verification
        </Link>
      </div>
    </div>
  );
};
