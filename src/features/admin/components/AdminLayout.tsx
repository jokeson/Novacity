import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { cn } from "@/lib/utils";

export type AdminLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const AdminLayout = ({ children, className }: AdminLayoutProps) => {
  return (
    <div
      className={cn(
        "bg-muted/30 flex min-h-full flex-1 flex-col md:flex-row md:items-start",
        className,
      )}
    >
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
};
