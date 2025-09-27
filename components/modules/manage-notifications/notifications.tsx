"use client";
import {
  useDeleteNotification,
  useGetUserNotifications,
} from "@/data/notifications";
import { CustomDialog } from "@/components/custom/custom-dialog";
import NotificationPagination from "../notifications/notification-pagination";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationResponse } from "@/types/notifications";
import moment from "moment";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import NotificationForm from "./notification-form";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IoIosAttach } from "react-icons/io";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/custom/spinner";

const Notifications = () => {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetUserNotifications() as {
    data: NotificationResponse[];
    isLoading: boolean;
    isError: boolean;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Number of notifications per page
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] =
    useState<NotificationResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutateAsync: deleteNotification } = useDeleteNotification();

  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return notifications?.slice(startIndex, startIndex + itemsPerPage) || [];
  }, [notifications, currentPage, itemsPerPage]);

  const handleDeleteClick = (
    e: React.MouseEvent,
    notification: NotificationResponse
  ) => {
    e.stopPropagation(); // Prevent opening the edit modal
    setNotificationToDelete(notification);
    setShowDeleteDialog(true);
  };

  const handleEditClick = (
    e: React.MouseEvent,
    notification: NotificationResponse
  ) => {
    e.stopPropagation();
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) return;

    setIsDeleting(true);
    try {
      await deleteNotification(notificationToDelete.id);
      toast.success("Notification deleted successfully");
      setShowDeleteDialog(false);
      setNotificationToDelete(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Notifications</h1>
        <p className="text-sm">
          list of all your sent notifications will be displayed here.
        </p>
      </div>
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="p-4 mb-4 w-full h-[77px] rounded-lg" />
        ))
      ) : isError ? (
        <div className="text-center text-red-500">
          Error loading notifications.
        </div>
      ) : paginatedNotifications && paginatedNotifications.length > 0 ? (
        <div className="space-y-4">
          <div className="flex md:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedNotification(null);
                setShowModal(true);
              }}
              className="mb-4 w-full md:max-w-[150px]"
            >
              Create Notification
            </Button>
          </div>
          {paginatedNotifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 mb-4 border rounded-lg cursor-pointer group hover:bg-muted"
              onClick={() => {
                setSelectedNotification(notification);
                setShowModal(true);
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start md:items-center flex-1 gap-3">
                  {notification.image && (
                    <div className="hidden md:block rounded-lg overflow-hidden w-14 h-14 shrink-0">
                      <Image
                        src={notification.image}
                        alt="Notification Image"
                        height={50}
                        width={50}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-primary dark:text-white mb-1 truncate">
                      {notification.title}
                    </h2>
                    <p className="text-sm line-clamp-2 mb-2 text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{moment(notification.created_at).fromNow()}</span>
                      {notification.link && (
                        <span className="text-blue-500 bg-blue-600/20 px-2 py-1 rounded inline-flex items-center gap-1">
                          <IoIosAttach className="rotate-45" />
                          Has Link
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Always visible on mobile, hover on desktop */}
                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEditClick(e, notification)}
                    className="h-8 px-3 md:h-8 md:w-8 md:p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="ml-1 md:hidden">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleDeleteClick(e, notification)}
                    className="h-8 px-3 md:h-8 md:w-8 md:p-0 hover:bg-red-600/20 hover:border-red-600/20 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-1 md:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
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
          <Button
            variant="outline"
            onClick={() => {
              setSelectedNotification(null);
              setShowModal(true);
            }}
            className="my-4 w-full md:max-w-[150px]"
          >
            Create Notification
          </Button>
        </div>
      )}

      {/* Create and Send Notification Form */}
      <CustomDialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) setSelectedNotification(null);
        }}
        title="Notification Form"
        showFooter={false}
      >
        <NotificationForm
          notification={selectedNotification}
          onClose={() => setShowModal(false)}
        />
      </CustomDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {notificationToDelete?.title}&quot;? This action cannot be undone
              and will permanently remove the notification from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <ButtonSpinner label="Deleting..." className="text-white" />
              ) : (
                "Delete Notification"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;
