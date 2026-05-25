import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ListingStatusCount } from "@/server/queries/admin.queries";

export type AnalyticsCardsProps = {
  totalUsers: number;
  totalListings: number;
  byStatus: ListingStatusCount[];
};

export const AnalyticsCards = ({
  totalUsers,
  totalListings,
  byStatus,
}: AnalyticsCardsProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Marketplace scale</CardTitle>
          <CardDescription>High-level counts from the database.</CardDescription>
        </CardHeader>
        <div className="text-muted-foreground space-y-2 px-6 pb-6 text-sm">
          <p>
            <span className="text-foreground font-semibold">{totalUsers}</span> registered
            users
          </p>
          <p>
            <span className="text-foreground font-semibold">{totalListings}</span> property
            records
          </p>
        </div>
      </Card>
      <Card className="border-border rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Listings by status</CardTitle>
          <CardDescription>Distribution of property status values.</CardDescription>
        </CardHeader>
        <ul className="text-muted-foreground space-y-2 px-6 pb-6 text-sm">
          {byStatus.length === 0 ? (
            <li>No listing data.</li>
          ) : (
            byStatus.map((row) => (
              <li key={row.status} className="flex justify-between gap-4">
                <span className="text-foreground capitalize">{row.status}</span>
                <span className="font-mono tabular-nums">{row.count}</span>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
};
