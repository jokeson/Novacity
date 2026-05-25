"use client";

import { useRouter } from "next/navigation";

import type { NotificationListItem } from "@/features/notifications/types";

import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationItem } from "./NotificationItem";

export type NotificationListProps = {
  items: NotificationListItem[];
};

export const NotificationList = ({ items }: NotificationListProps) => {
  const router = useRouter();

  if (items.length === 0) {
    return <NotificationEmptyState />;
  }

  const handleMarkedRead = () => {
    router.refresh();
  };

  return (
    <ul className="flex flex-col gap-4" aria-label="Notifications">
      {items.map((item) => (
        <li key={item.id}>
          <NotificationItem item={item} onMarkedRead={handleMarkedRead} />
        </li>
      ))}
    </ul>
  );
};
