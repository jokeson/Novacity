import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { stateLabelFromSlug } from "@/features/search/utils/stateSlug";
import { buildPropertySearchQuery } from "@/features/search/utils/buildPropertySearchQuery";
import { propertySearchParamsSchema } from "@/features/search/validators/propertySearchParams";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StateListingsRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const label = stateLabelFromSlug(decodeURIComponent(slug));
  const base = propertySearchParamsSchema.parse({});
  const qs = buildPropertySearchQuery(base, { state: label });
  redirect(`${ROUTES.properties}${qs}`);
}
