import { Container } from "@/components/shared/Container";
import { DashboardQuickNavTabs } from "@/features/dashboard/components/DashboardQuickNavTabs";
import { DashboardStatsCards } from "@/features/dashboard/components/DashboardStatsCards";
import { RecentListings } from "@/features/dashboard/components/RecentListings";
import { RecentNotifications } from "@/features/dashboard/components/RecentNotifications";
import type {
  DashboardRecentListing,
  DashboardRecentNotification,
  DashboardStatsSummary,
} from "@/features/dashboard/types";

export type DashboardPageViewProps = {
  displayName: string;
  isAdmin: boolean;
  canCreateListings?: boolean;
  stats: DashboardStatsSummary;
  recentListings: DashboardRecentListing[];
  recentNotifications: DashboardRecentNotification[];
};

export const DashboardPageView = ({
  displayName,
  isAdmin,
  canCreateListings = true,
  stats,
  recentListings,
  recentNotifications,
}: DashboardPageViewProps) => {
  const welcomeName = displayName.trim() || "there";

  return (
    <Container className="space-y-8 pb-12 pt-4 md:space-y-10 md:pb-14 md:pt-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="min-w-0 space-y-2">
          <h2 className="font-heading text-foreground text-3xl font-semibold tracking-tight">
            Overview
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Snapshot of your listings, visibility, and alerts.
          </p>
        </div>
        <p className="text-foreground font-heading shrink-0 text-xl font-semibold tracking-tight md:text-right md:text-2xl">
          Welcome back, {welcomeName}
        </p>
      </section>

      <DashboardQuickNavTabs isAdmin={isAdmin} canCreateListings={canCreateListings} />

      <DashboardStatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentListings
          listings={recentListings}
          canCreateListings={canCreateListings}
        />
        <RecentNotifications notifications={recentNotifications} />
      </div>
    </Container>
  );
};
