import { Bell } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";

export type NotificationEmptyStateProps = {
  className?: string;
};

export const NotificationEmptyState = ({ className }: NotificationEmptyStateProps) => {
  return (
    <EmptyState
      className={className}
      icon={Bell}
      title="No notifications yet"
      description="When something important happens with your listings, PassKeys, or leads, it will appear here."
    />
  );
};
