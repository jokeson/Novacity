import { listHomepageStateHighlights } from "@/server/queries/propertySearch.queries";

import { StatesHomeSection } from "./StatesHomeSection";

export const StatesHomeRail = async () => {
  const { items, error } = await listHomepageStateHighlights(5);

  return (
    <StatesHomeSection
      states={items}
      fetchFailed={Boolean(error)}
      fetchErrorMessage={error}
    />
  );
};
