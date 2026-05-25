import { Container } from "@/components/shared/Container";
import { AdminQuickNavTabs } from "@/features/admin/components/AdminQuickNavTabs";
import { AdminStatsCards, type AdminStatsSummary } from "@/features/admin/components/AdminStatsCards";

export type AdminHomePageViewProps = {
  displayName: string;
  stats: AdminStatsSummary;
};

export const AdminHomePageView = ({ displayName, stats }: AdminHomePageViewProps) => {
  const welcomeName = displayName.trim() || "there";

  return (
    <Container className="space-y-8 py-8 md:space-y-10 md:py-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="min-w-0 space-y-2">
          <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
            Overview
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
            Operate the marketplace: users, listings, PassKeys, and high-level financial signals.
          </p>
        </div>
        <p className="text-foreground font-heading shrink-0 text-xl font-semibold tracking-tight md:text-right md:text-2xl">
          Welcome back, {welcomeName}
        </p>
      </section>

      <AdminQuickNavTabs />

      <AdminStatsCards stats={stats} />
    </Container>
  );
};
