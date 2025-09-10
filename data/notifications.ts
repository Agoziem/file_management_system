import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosInstanceWithToken } from "@/data/instance";
import { 
  NotificationResponse, 
  NotificationList,
  UserNotificationList,
  NotificationActionResponse,
  BulkReadUpdateResponse,
  NotificationDeleteResponse
} from "@/types/notifications";
import { 
  NotificationCreateType, 
  NotificationUpdateType 
} from "@/schemas/notifications";

// -----------------------------------------------
// Notification Management
// -------------------------------------------------

// Get unread notifications
export const useGetUnreadNotifications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async (): Promise<UserNotificationList> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/notifications/user/unread");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get all notifications
export const useGetAllNotifications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["notifications", "all"],
    queryFn: async (): Promise<UserNotificationList> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/notifications/all");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get notification by ID
export const useGetNotificationById = (notificationId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["notifications", "detail", notificationId],
    queryFn: async (): Promise<NotificationResponse> => {
      const response = await AxiosInstanceWithToken.get(`/api/v1/notifications/${notificationId}`);
      return response.data;
    },
    enabled: enabled && !!notificationId,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get user sent notifications
export const useGetUserSentNotifications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["notifications", "user-sent"],
    queryFn: async (): Promise<NotificationList> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/notifications/user_sent");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Create notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NotificationCreateType): Promise<NotificationResponse> => {
      const response = await AxiosInstanceWithToken.post("/api/v1/notifications/send_notification", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", "all"]);
      queryClient.invalidateQueries(["notifications", "user-sent"]);
      queryClient.invalidateQueries(["notifications", "unread"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Mark notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string): Promise<NotificationActionResponse> => {
      const response = await AxiosInstanceWithToken.get(`/api/v1/notifications/${notificationId}/mark-as-read`);
      return response.data;
    },
    onSuccess: (_, notificationId) => {
      queryClient.invalidateQueries(["notifications", "unread"]);
      queryClient.invalidateQueries(["notifications", "all"]);
      queryClient.invalidateQueries(["notifications", "detail", notificationId]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Update and resend notification
export const useUpdateAndResendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ notificationId, data }: { notificationId: string; data: NotificationUpdateType }): Promise<NotificationResponse> => {
      const response = await AxiosInstanceWithToken.patch(`/api/v1/notifications/update_and_resend/${notificationId}`, data);
      return response.data;
    },
    onSuccess: (data, { notificationId }) => {
      queryClient.setQueryData(["notifications", "detail", notificationId], data);
      queryClient.invalidateQueries(["notifications", "all"]);
      queryClient.invalidateQueries(["notifications", "user-sent"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Remove user from notification
export const useRemoveUserFromNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string): Promise<NotificationActionResponse> => {
      const response = await AxiosInstanceWithToken.get(`/api/v1/notifications/${notificationId}/remove_user_from_notification`);
      return response.data;
    },
    onSuccess: (_, notificationId) => {
      queryClient.invalidateQueries(["notifications", "all"]);
      queryClient.invalidateQueries(["notifications", "unread"]);
      queryClient.removeQueries(["notifications", "detail", notificationId]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// -----------------------------------------------
// Combined Notification Hooks
// -------------------------------------------------

// Get comprehensive notification dashboard data
export const useNotificationDashboard = (enabled: boolean = true) => {
  const allNotifications = useGetAllNotifications(enabled);
  const unreadNotifications = useGetUnreadNotifications(enabled);
  const userSentNotifications = useGetUserSentNotifications(enabled);

  return {
    allNotifications: allNotifications.data,
    unreadNotifications: unreadNotifications.data,
    userSentNotifications: userSentNotifications.data,
    isLoading: allNotifications.isLoading || unreadNotifications.isLoading || userSentNotifications.isLoading,
    error: allNotifications.error || unreadNotifications.error || userSentNotifications.error,
    isError: allNotifications.isError || unreadNotifications.isError || userSentNotifications.isError,
    refetch: () => {
      allNotifications.refetch();
      unreadNotifications.refetch();
      userSentNotifications.refetch();
    },
  };
};

// Notification management hook with common operations
export const useNotificationManagement = () => {
  const createNotification = useCreateNotification();
  const markAsRead = useMarkAsRead();
  const updateAndResend = useUpdateAndResendNotification();
  const removeUser = useRemoveUserFromNotification();

  const handleCreateNotification = async (data: NotificationCreateType) => {
    return createNotification.mutateAsync(data);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    return markAsRead.mutateAsync(notificationId);
  };

  const handleUpdateAndResend = async (notificationId: string, data: NotificationUpdateType) => {
    return updateAndResend.mutateAsync({ notificationId, data });
  };

  const handleRemoveUser = async (notificationId: string) => {
    return removeUser.mutateAsync(notificationId);
  };

  const handleMarkMultipleAsRead = async (notificationIds: string[]) => {
    const promises = notificationIds.map((id) => markAsRead.mutateAsync(id));
    return Promise.all(promises);
  };

  return {
    createNotification: handleCreateNotification,
    markAsRead: handleMarkAsRead,
    updateAndResend: handleUpdateAndResend,
    removeUser: handleRemoveUser,
    markMultipleAsRead: handleMarkMultipleAsRead,
    isCreatingNotification: createNotification.isLoading,
    isMarkingAsRead: markAsRead.isLoading,
    isUpdatingAndResending: updateAndResend.isLoading,
    isRemovingUser: removeUser.isLoading,
  };
};

// Notification inbox hook for user interface
export const useNotificationInbox = () => {
  const allNotifications = useGetAllNotifications();
  const unreadNotifications = useGetUnreadNotifications();
  const markAsRead = useMarkAsRead();
  const removeUser = useRemoveUserFromNotification();

  const handleMarkAsRead = async (notificationId: string) => {
    return markAsRead.mutateAsync(notificationId);
  };

  const handleRemoveNotification = async (notificationId: string) => {
    return removeUser.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadNotifications.data?.items) {
      const unreadIds = unreadNotifications.data.items.map((n: any) => n.id);
      const promises = unreadIds.map((id: string) => markAsRead.mutateAsync(id));
      return Promise.all(promises);
    }
  };

  return {
    notifications: allNotifications.data?.items || [],
    unreadNotifications: unreadNotifications.data?.items || [],
    unreadCount: unreadNotifications.data?.items?.length || 0,
    isLoading: allNotifications.isLoading || unreadNotifications.isLoading,
    error: allNotifications.error || unreadNotifications.error,
    markAsRead: handleMarkAsRead,
    removeNotification: handleRemoveNotification,
    markAllAsRead: handleMarkAllAsRead,
    isMarkingAsRead: markAsRead.isLoading,
    isRemovingNotification: removeUser.isLoading,
    refetch: () => {
      allNotifications.refetch();
      unreadNotifications.refetch();
    },
  };
};



// DELETE
// /api/v1/notifications/{notification_id}/delete
// Remove Notification