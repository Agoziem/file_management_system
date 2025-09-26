"use client";

import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetUserUnreadNotifications } from "@/data/notifications";
import { useHasChecked } from "@/providers/context/NotificationChecked";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function NotificationBtn() {
  const { data: unreadNotifications } = useGetUserUnreadNotifications();
  const { hasChecked, setHasChecked } = useHasChecked();
  const router = useRouter();

  const count = useMemo(() => {
    return unreadNotifications?.items?.length ?? 0;
  }, [unreadNotifications]);

  // keep hasChecked in sync with new data
  useEffect(() => {
    setHasChecked(count === 0);
  }, [count, setHasChecked]);

  const handleClick = () => {
    setHasChecked(true);
    router.push("/notifications");
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
