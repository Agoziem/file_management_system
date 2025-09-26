import { NotificationCreate, NotificationReadUpdate, NotificationUpdate } from "@/types/notifications";
import { AxiosInstanceWithToken } from "./instance";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Get User Unread Notifications
export const useGetUserUnreadNotifications = () => {
  return useQuery("userUnreadNotifications", async () => {
    const response = await AxiosInstanceWithToken.get("/api/v1/notifications/user/unread");
    return response.data;
  });
};

// get all notifications
export const useGetAllNotifications = () => {
  return useQuery("notifications", async () => {
    const response = await AxiosInstanceWithToken.get("/api/v1/notifications/all");
    return response.data;
  });
};

// get all user notifications
export const useGetUserNotifications = () => {
  return useQuery("userNotifications", async () => {
    const response = await AxiosInstanceWithToken.get("/api/v1/notifications/user_sent");
    return response.data;
  });
}

// Mark Notification as Read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (notificationId: string) => {
      const response = await AxiosInstanceWithToken.get(
        `/api/v1/notifications/${notificationId}/mark-as-read`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userUnreadNotifications");
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("userNotifications");
      },
    }
  );
};

// create notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (notification: NotificationCreate) => {
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/notifications/send_notification/",
        notification
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("userUnreadNotifications");
        queryClient.invalidateQueries("userNotifications");
      },
    }
  );
}

// update notification
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (notification: Partial<NotificationUpdate>) => {
      const response = await AxiosInstanceWithToken.patch(
        `/api/v1/notifications/update_and_resend/${notification.id}`,
        notification
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("userUnreadNotifications");
        queryClient.invalidateQueries("userNotifications");
      },
    }
  );
}

// delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (notificationId: string) => {
      const response = await AxiosInstanceWithToken.delete(`/api/v1/notifications/${notificationId}/delete`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("userUnreadNotifications");
        queryClient.invalidateQueries("userNotifications");
      },
    }
  );
}


export const useRemoveUserasRecipient = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (notificationId: string) => {
      const response = await AxiosInstanceWithToken.get(
        `/api/v1/notifications/${notificationId}/remove_user_from_notification`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("userUnreadNotifications");
        queryClient.invalidateQueries("userNotifications");
      },
    }
  );
}