import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardRecentNotification } from "@/features/dashboard/types";

export type RecentNotificationsProps = {
  notifications: DashboardRecentNotification[];
};

export const RecentNotifications = ({
  notifications,
}: RecentNotificationsProps) => {
  return (
    <Card className="border-border rounded-2xl border shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="font-heading text-lg">Recent notifications</CardTitle>
          <CardDescription>Latest updates for your account.</CardDescription>
        </div>
        <Link
          href={ROUTES.dashboardNotifications}
          className="text-primary shrink-0 text-sm font-medium underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            You are all caught up. We will surface listing and lead alerts here.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="border-border space-y-1 rounded-xl border bg-background/60 px-3 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-foreground text-sm font-medium">{n.title}</p>
                  {!n.isRead ? (
                    <Badge className="rounded-lg text-[0.65rem] uppercase">
                      New
                    </Badge>
                  ) : null}
                  <Badge variant="outline" className="rounded-lg capitalize">
                    {n.type}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  {n.message}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
