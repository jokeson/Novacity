import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { RevenueSummary } from "@/features/admin/components/RevenueSummary";
import {
  getTotalPriceVolume,
  getTotalSspNonRentalMarketValue,
  getTotalSspPriceVolume,
} from "@/server/queries/admin.queries";

export const metadata = {
  title: "Revenue — Admin",
};

export default async function AdminRevenuePage() {
  const [totalPriceVolume, sspPriceVolume, sspNonRentalMarketValue] =
    await Promise.all([
      getTotalPriceVolume(),
      getTotalSspPriceVolume(),
      getTotalSspNonRentalMarketValue(),
    ]);

  return (
    <>
      <AdminHeader
        title="Revenue"
        description="Non-transactional estimates based on listing prices. Replace with real payouts when billing is integrated."
        backLink={{ href: ROUTES.admin, label: "Overview" }}
      />
      <Container className="py-8 md:py-10">
        <RevenueSummary
          totalPriceVolume={totalPriceVolume}
          sspPriceVolume={sspPriceVolume}
          sspNonRentalMarketValue={sspNonRentalMarketValue}
        />
      </Container>
    </>
  );
}
