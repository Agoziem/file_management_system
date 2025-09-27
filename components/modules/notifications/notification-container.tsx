"use client";
import {
  useGetAllNotifications,
  useMarkNotificationAsRead,
  useRemoveUserasRecipient,
} from "@/data/notifications";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  NotificationResponse,
} from "@/types/notifications";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import NotificationCard from "./notification-card";
import NotificationPagination from "./notification-pagination";
import { CustomDialog } from "@/components/custom/custom-dialog";
import { useGetCurrentUserProfile } from "@/data/user";

const NotificationContainer = () => {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetAllNotifications() as {
    data: NotificationResponse[];
    isLoading: boolean;
    isError: boolean;
  };
  const { mutateAsync: removeUserasRecipient } = useRemoveUserasRecipient();
  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationResponse | null>(null);
  const { data: userProfile } = useGetCurrentUserProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Number of reviews per page

  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return notifications?.slice(startIndex, startIndex + itemsPerPage) || [];
  }, [notifications, currentPage, itemsPerPage]);

  // safe extract userProfile id
  const userId = useMemo(() => {
    return userProfile?.id || "";
  }, [userProfile]);

  const handleNotificationClick = async (
    notification: NotificationResponse
  ) => {
    try {
      // Mark the notification as read if it is not already read
      if (!checkIfNotificationIsRead(notification)) {
        await markAsRead(notification.id);
      }
      setSelectedNotification(notification);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const checkIfNotificationIsRead = (
    notification: NotificationResponse
  ): boolean => {
    return notification.recipients.some(
      (recipient) => recipient.id === userId && recipient.has_read === true
    );
  };

  const handleRemoveUserAsRecipient = async (
    notification: NotificationResponse
  ) => {
    const toastId = toast.loading("Removing you as a recipient...");
    try {
      await removeUserasRecipient(notification.id);
      toast.success("notification removed successfully", {
        id: toastId,
      });
    } catch (error) {
      console.error("Failed to remove user as recipient:", error);
      toast.error("Failed to remove notification", {
        id: toastId,
      });
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">
          Notifications
        </h2>
        <p className="text-muted-foreground">
          Manage and organize your notifications efficiently
        </p>
      </div>
      <div className="pt-6 md:p-8 ">
        <div className="max-w-3xl bg-card mx-auto rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Here you can view all your notifications. Click on a notification
              to see more details.
            </p>
          </div>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="p-4 mb-4 w-full h-[77px] rounded-lg"
              />
            ))
          ) : isError ? (
            <div className="text-center text-destructive">
              Error loading notifications.
            </div>
          ) : paginatedNotifications && paginatedNotifications.length > 0 ? (
            <div className="space-y-4">
              {paginatedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  userProfile={userProfile}
                  onClick={handleNotificationClick}
                  onRemove={handleRemoveUserAsRecipient}
                />
              ))}
              <div className="mt-6">
                {notifications && notifications.length > itemsPerPage && (
                  <NotificationPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(notifications.length / itemsPerPage)}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Image
                src="/images/no_messages_found.webp"
                alt="No Notifications"
                height={200}
                width={200}
                className="mx-auto mb-4"
              />
              <p className="text-muted-foreground">
                You have no notifications at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* view notification modal */}
      <CustomDialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) setSelectedNotification(null);
        }}
        title="Notification Details"
        showFooter={false}

      >
        <div className="p-2 pt-0 space-y-4">
          <h2 className="text-lg font-semibold text-primary">
            {selectedNotification?.title || "Notification Title"}
          </h2>

          {selectedNotification?.image && (
            <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
              <Image
                src={selectedNotification.image}
                alt="Notification Image"
                height={500}
                width={500}
                className="rounded-lg object-cover w-full h-full"
                quality={100}
              />
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">
              {selectedNotification?.message ||
                "This is the notification message."}
            </p>
            <span className="text-xs text-muted-foreground">
              {selectedNotification
                ? moment(selectedNotification.created_at).fromNow()
                : "Just now"}
            </span>
          </div>
          {selectedNotification?.link && (
            <Button className="mt-4 w-full" asChild>
              <Link href={selectedNotification?.link || "#"}>View Details</Link>
            </Button>
          )}
        </div>
      </CustomDialog>
    </div>
  );
};

export default NotificationContainer;
