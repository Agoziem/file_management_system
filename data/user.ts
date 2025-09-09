import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosInstanceWithToken } from "@/data/instance";
import { toast } from "sonner";
import { ChangeRoleSchema, UpdateFcmTokenSchema } from "@/schemas/auth";
import { UserUpdateSchema } from "@/schemas/users";
import {
  UserModel,
  UserResponseModel,
  ActivityResponse,
} from "@/types/user";
import { z } from "zod";

// -----------------------------------------------
// User Management
// -------------------------------------------------

// Get all users
export const useGetAllUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "all"],
    queryFn: async (): Promise<UserResponseModel[]> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/all");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error
    },
  });
};

// Get current user profile
export const useGetCurrentUserProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async (): Promise<UserModel> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/profile");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof UserUpdateSchema>) => {
      const validatedData = UserUpdateSchema.parse(data);
      const response = await AxiosInstanceWithToken.put(
        "/api/v1/user/update-user",
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
      queryClient.invalidateQueries(["user", "all"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await AxiosInstanceWithToken.delete(`/api/v1/user/delete_user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "all"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// Change user role
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof ChangeRoleSchema>) => {
      const validatedData = ChangeRoleSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/user/change-role",
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "all"]);
      queryClient.invalidateQueries(["user", "profile"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// Update FCM token
export const useUpdateFcmToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fcmToken: string) => {
      const validatedData = UpdateFcmTokenSchema.parse({ fcmtoken: fcmToken });
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/user/update-fcm-token",
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
      queryClient.invalidateQueries(["user", "fcm-token"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// Get FCM token
export const useGetFcmToken = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "fcm-token"],
    queryFn: async (): Promise<{ fcmtoken: string | null }> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/fcm-token");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error
    },
  });
};

// Get user activity
export const useGetUserActivity = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "activity"],
    queryFn: async (): Promise<ActivityResponse[]> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/activity");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error
    },
  });
};

// -----------------------------------------------
// Combined User Hooks
// -------------------------------------------------

// Get comprehensive user dashboard data
export const useUserDashboard = (enabled: boolean = true) => {
  const profile = useGetCurrentUserProfile(enabled);
  const activity = useGetUserActivity(enabled);
  const fcmToken = useGetFcmToken(enabled);

  return {
    profile: profile.data,
    activity: activity.data,
    fcmToken: fcmToken.data?.fcmtoken,
    isLoading: profile.isLoading || activity.isLoading || fcmToken.isLoading,
    error: profile.error || activity.error || fcmToken.error,
    isError: profile.isError || activity.isError || fcmToken.isError,
    refetch: () => {
      profile.refetch();
      activity.refetch();
      fcmToken.refetch();
    },
  };
};

// Admin user management hook
export const useAdminUserManagement = () => {
  const allUsers = useGetAllUsers();
  const deleteUser = useDeleteUser();
  const changeRole = useChangeUserRole();

  const handleDeleteUser = async (userId: string) => {
    return deleteUser.mutateAsync(userId);
  };

  const handleChangeUserRole = async (userId: string, newRole: "super_admin" | "admin" | "business_user" | "standard_user") => {
    return changeRole.mutateAsync({ user_id: userId, new_role: newRole });
  };

  return {
    users: allUsers.data || [],
    isLoading: allUsers.isLoading,
    error: allUsers.error,
    deleteUser: handleDeleteUser,
    changeUserRole: handleChangeUserRole,
    isDeletingUser: deleteUser.isLoading,
    isChangingRole: changeRole.isLoading,
    refetch: allUsers.refetch,
  };
};

// User profile management hook
export const useProfileManagement = () => {
  const profile = useGetCurrentUserProfile();
  const updateUser = useUpdateUser();
  const updateFcmToken = useUpdateFcmToken();

  const handleUpdateProfile = async (data: z.infer<typeof UserUpdateSchema>) => {
    return updateUser.mutateAsync(data);
  };

  const handleUpdateFcmToken = async (fcmToken: string) => {
    return updateFcmToken.mutateAsync(fcmToken);
  };

  return {
    profile: profile.data,
    isLoading: profile.isLoading,
    error: profile.error,
    updateProfile: handleUpdateProfile,
    updateFcmToken: handleUpdateFcmToken,
    isUpdatingProfile: updateUser.isLoading,
    isUpdatingFcmToken: updateFcmToken.isLoading,
    refetch: profile.refetch,
  };
};