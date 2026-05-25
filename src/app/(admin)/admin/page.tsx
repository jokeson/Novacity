import { AdminHomePageView } from "@/features/admin/components/AdminHomePageView";
import { requireSessionForAdmin } from "@/server/auth/session";
import { getUserByIdLean } from "@/server/queries/user.queries";
import {
  countAllPassKeys,
  countAllProperties,
  countAllUsers,
  countCompanyUsers,
  countFeaturedProperties,
  countMarketingListings,
  countNonMarketingListings,
  countRentalPipelineListings,
  countSalePipelineListings,
  countSuspendedUsers,
  getTotalPriceVolume,
} from "@/server/queries/admin.queries";

export const metadata = {
  title: "Admin",
};

export default async function AdminHomePage() {
  const session = await requireSessionForAdmin();
  const [
    user,
    totalUsers,
    suspendedUsers,
    totalListings,
    featuredListings,
    companyAccounts,
    passKeysTotal,
    rentalListings,
    saleListings,
    activeMarketingListings,
    inactiveListings,
    grossVolume,
  ] = await Promise.all([
    getUserByIdLean(session.sub),
    countAllUsers(),
    countSuspendedUsers(),
    countAllProperties(),
    countFeaturedProperties(),
    countCompanyUsers(),
    countAllPassKeys(),
    countRentalPipelineListings(),
    countSalePipelineListings(),
    countMarketingListings(),
    countNonMarketingListings(),
    getTotalPriceVolume(),
  ]);

  const displayName = typeof user?.name === "string" ? user.name : "";

  const stats = {
    totalUsers,
    suspendedUsers,
    totalListings,
    featuredListings,
    companyAccounts,
    passKeysTotal,
    rentalListings,
    saleListings,
    activeMarketingListings,
    inactiveListings,
    grossVolume,
  };

  return <AdminHomePageView displayName={displayName} stats={stats} />;
}
