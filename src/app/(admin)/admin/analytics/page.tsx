import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { AnalyticsCards } from "@/features/admin/components/AnalyticsCards";
import {
  countAllProperties,
  countAllUsers,
  getListingStatusBreakdown,
} from "@/server/queries/admin.queries";

export const metadata = {
  title: "Analytics — Admin",
};

export default async function AdminAnalyticsPage() {
  const [totalUsers, totalListings, byStatus] = await Promise.all([
    countAllUsers(),
    countAllProperties(),
    getListingStatusBreakdown(),
  ]);

  return (
    <>
      <AdminHeader
        title="Analytics"
        description="Snapshot metrics derived from MongoDB. Funnel and cohort analytics can layer on later."
        backLink={{ href: ROUTES.admin, label: "Overview" }}
      />
      <Container className="py-8 md:py-10">
        <AnalyticsCards
          totalUsers={totalUsers}
          totalListings={totalListings}
          byStatus={byStatus}
        />
      </Container>
    </>
  );
}
