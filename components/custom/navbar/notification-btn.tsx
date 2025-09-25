"use client";

import { useEffect, useMemo, useState } from "react";
import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetUnreadNotifications } from "@/data/notifications";

export default function NotificationBtn() {
  const [count, setCount] = useState(0);
  const { data: unreadNotifications } = useGetUnreadNotifications();

  useEffect(() => {
    if (unreadNotifications && unreadNotifications.items) {
      setCount(unreadNotifications.items.length || 0);
    }
  }, [unreadNotifications]);

  const handleClick = () => {
    setCount(0);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={handleClick}
      aria-label="Notifications"
    >
      <BellIcon size={16} aria-hidden="true" />
      {count > 0 && (
        <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Button>
  );
}
