import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PriceText } from "@/components/shared/PriceText";

export type AdminStatsSummary = {
  totalUsers: number;
  suspendedUsers: number;
  totalListings: number;
  featuredListings: number;
  companyAccounts: number;
  passKeysTotal: number;
  rentalListings: number;
  saleListings: number;
  activeMarketingListings: number;
  inactiveListings: number;
  grossVolume: number;
};

export type AdminStatsCardsProps = {
  stats: AdminStatsSummary;
};

type StatRow =
  | { key: string; label: string; description: string; kind: "count"; value: number }
  | { key: string; label: string; description: string; kind: "money"; value: number };

export const AdminStatsCards = ({ stats }: AdminStatsCardsProps) => {
  const items: StatRow[] = [
    {
      key: "users",
      kind: "count",
      label: "Total users",
      value: stats.totalUsers,
      description: `${stats.suspendedUsers.toLocaleString()} suspended`,
    },
    {
      key: "companies",
      kind: "count",
      label: "Company accounts",
      value: stats.companyAccounts,
      description: "Users with company role.",
    },
    {
      key: "listings",
      kind: "count",
      label: "Total listings",
      value: stats.totalListings,
      description: "All property records.",
    },
    {
      key: "active",
      kind: "count",
      label: "Active on marketplace",
      value: stats.activeMarketingListings,
      description: "Statuses visible in discovery.",
    },
    {
      key: "inactive",
      kind: "count",
      label: "Inactive / off-market",
      value: stats.inactiveListings,
      description: "Draft, sold, rented, and other non-marketing.",
    },
    {
      key: "rentals",
      kind: "count",
      label: "Rental pipeline",
      value: stats.rentalListings,
      description: "For-rent or rented records.",
    },
    {
      key: "sales",
      kind: "count",
      label: "Sale pipeline",
      value: stats.saleListings,
      description: "For-sale or sold records.",
    },
    {
      key: "featured",
      kind: "count",
      label: "Featured",
      value: stats.featuredListings,
      description: "Highlighted on the marketplace.",
    },
    {
      key: "passkeys",
      kind: "count",
      label: "PassKeys issued",
      value: stats.passKeysTotal,
      description: "All-time generated keys.",
    },
    {
      key: "gmv",
      kind: "money",
      label: "Gross listing volume",
      value: stats.grossVolume,
      description: "Sum of stored prices (GMV proxy, not settled revenue).",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.key}
          className="border-border rounded-2xl border shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <CardHeader className="gap-1">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {item.label}
            </CardTitle>
            {item.kind === "count" ? (
              <p className="font-heading text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                {item.value.toLocaleString()}
              </p>
            ) : (
              <PriceText
                amount={item.value}
                className="font-heading text-foreground text-2xl font-semibold tracking-tight sm:text-3xl"
              />
            )}
            <CardDescription className="text-xs leading-relaxed">{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
