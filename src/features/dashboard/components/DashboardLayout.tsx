import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { uiDashboardMainColumn } from "@/lib/responsiveLayout";
import { cn } from "@/lib/utils";

export type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
  unreadNotificationCount: number;
  /** Shown below the mobile notification strip (e.g. PassKey publish reminder for `user`). */
  topSlot?: React.ReactNode;
};

export const DashboardLayout = ({
  children,
  className,
  unreadNotificationCount,
  topSlot,
}: DashboardLayoutProps) => {
  return (
    <div
      className={cn(
        "bg-muted/20 flex min-h-0 min-w-0 w-full flex-1 flex-col md:flex-row md:items-start",
        className,
      )}
    >
      <DashboardSidebar unreadNotificationCount={unreadNotificationCount} />
      <div className={uiDashboardMainColumn}>
        <div className="border-border flex justify-end border-b bg-background px-4 py-3 md:hidden">
          <NotificationBell initialUnreadCount={unreadNotificationCount} />
        </div>
        {topSlot ? <div className="min-h-0 shrink-0">{topSlot}</div> : null}
        {children}
      </div>
    </div>
  );
};
