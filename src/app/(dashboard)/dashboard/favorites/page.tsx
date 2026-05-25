import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { FavoritesPageView } from "@/features/dashboard/components/FavoritesPageView";
import { ROUTES } from "@/constants/routes";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import { listFavoritePropertiesForUser } from "@/server/queries/dashboard.queries";

export const metadata = {
  title: "Favorites",
};

export default async function DashboardFavoritesPage() {
  const session = await requireVerifiedOwnerForDashboard();
  const items = await listFavoritePropertiesForUser(session.sub);

  return (
    <>
      <DashboardHeader
        title="Favorites"
        backLink={{ href: ROUTES.dashboard, label: "Back to overview" }}
        description="Properties you saved from the marketplace. Open a card to view full details."
      />
      <Container className="py-8 md:py-10">
        <FavoritesPageView items={items} />
      </Container>
    </>
  );
}
