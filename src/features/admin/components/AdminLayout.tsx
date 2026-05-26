import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { uiDashboardMainColumn } from "@/lib/responsiveLayout";
import { cn } from "@/lib/utils";

export type AdminLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const AdminLayout = ({ children, className }: AdminLayoutProps) => {
  return (
    <div
      className={cn(
        "bg-muted/30 flex min-h-0 min-w-0 w-full flex-1 flex-col md:flex-row md:items-start",
        className,
      )}
    >
      <AdminSidebar />
      <div className={uiDashboardMainColumn}>{children}</div>
    </div>
  );
};
