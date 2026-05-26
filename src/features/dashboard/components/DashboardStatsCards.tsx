import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardStatsSummary } from "@/features/dashboard/types";

export type DashboardStatsCardsProps = {
  stats: DashboardStatsSummary;
};

export const DashboardStatsCards = ({ stats }: DashboardStatsCardsProps) => {
  const items = [
    {
      label: "Your listings",
      value: stats.listingCount,
      description: "Properties you own in the workspace.",
    },
    {
      label: "Total views",
      value: stats.totalViews.toLocaleString(),
      description: "Combined views across your listings.",
    },
    {
      label: "Expiring soon",
      value: stats.expiringSoonCount,
      description: "Published listings expiring within 7 days.",
    },
    {
      label: "Unread alerts",
      value: stats.unreadNotifications,
      description: "Notifications you have not opened yet.",
    },
  ] as const;

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className="border-border rounded-2xl border shadow-sm"
        >
          <CardHeader className="gap-1">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {item.label}
            </CardTitle>
            <p className="font-heading text-foreground text-3xl font-semibold tracking-tight">
              {item.value}
            </p>
            <CardDescription className="text-xs leading-relaxed">
              {item.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
