"use client";

import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { markNotificationReadAction } from "@/features/notifications/actions/notificationActions";
import type { NotificationListItem } from "@/features/notifications/types";

export type NotificationItemProps = {
  item: NotificationListItem;
  onMarkedRead?: () => void;
};

export const NotificationItem = ({ item, onMarkedRead }: NotificationItemProps) => {
  const [pending, startTransition] = useTransition();

  const handleMarkRead = () => {
    if (item.isRead) {
      return;
    }
    startTransition(async () => {
      const res = await markNotificationReadAction(item.id);
      if (res.ok) {
        onMarkedRead?.();
      }
    });
  };

  return (
    <Card className="border-border rounded-2xl border shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-heading text-base">{item.title}</CardTitle>
              {!item.isRead ? (
                <Badge className="rounded-lg text-[0.65rem] uppercase">Unread</Badge>
              ) : null}
              <Badge variant="outline" className="rounded-lg capitalize">
                {item.type}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {new Date(item.createdAt).toLocaleString()}
            </CardDescription>
          </div>
          {!item.isRead ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-lg"
              disabled={pending}
              aria-busy={pending || undefined}
              onClick={handleMarkRead}
            >
              Mark read
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm leading-relaxed">
        {item.message}
      </CardContent>
    </Card>
  );
};
