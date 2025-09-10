import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  AxiosInstanceWithToken,
  AxiosInstancemultipartWithToken,
} from "@/data/instance";
import {
  FileResponse,
  FileList,
  StorageResponse,
  FileUploadResponse,
  MultipleFileUploadResponse,
  FileDeleteResponse,
  FileTypeDistribution,
  StorageUsageTrend,
  RecentActivityResponse,
  LargeFilesResponse,
  FileAnalyticsDashboard,
  CreateFileActivity,
  FileActivityResponse,
} from "@/types/files";
import { FileUpdateType, StorageUpdateType } from "@/schemas/files";

// -----------------------------------------------
// File Management
// -------------------------------------------------

// Get all files
export const useGetAllFiles = (
  params?: Record<string, any>,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["files", "all", params],
    queryFn: async (): Promise<FileList> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/files/", {
        params,
      });
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get file by ID
export const useGetFileById = (fileId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "detail", fileId],
    queryFn: async (): Promise<FileResponse> => {
      const response = await AxiosInstanceWithToken.get(
        `/api/v1/files/${fileId}`
      );
      return response.data;
    },
    enabled: enabled && !!fileId,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get storage info
export const useGetStorageInfo = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "storage", "info"],
    queryFn: async (): Promise<StorageResponse> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/files/storage/info"
      );
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get file type distribution
export const useGetFileTypeDistribution = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "analytics", "type-distribution"],
    queryFn: async (): Promise<FileTypeDistribution> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/files/analytics/type-distribution"
      );
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get storage usage trends
export const useGetStorageUsageTrends = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "analytics", "storage-trends"],
    queryFn: async (): Promise<StorageUsageTrend> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/files/analytics/storage-trends"
      );
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get recent activity
export const useGetRecentActivity = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "analytics", "recent-activity"],
    queryFn: async (): Promise<RecentActivityResponse> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/files/analytics/recent-activity"
      );
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get large files
export const useGetLargeFiles = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "analytics", "large-files"],
    queryFn: async (): Promise<LargeFilesResponse> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/files/analytics/large-files"
      );
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get analytics dashboard
export const useGetAnalyticsDashboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "analytics", "dashboard"],
    queryFn: async (): Promise<FileAnalyticsDashboard> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/files/analytics/dashboard"
      );
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// Upload file
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData): Promise<FileUploadResponse> => {
      const response = await AxiosInstancemultipartWithToken.post(
        "/api/v1/files/upload",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["files", "all"]);
      queryClient.invalidateQueries(["files", "storage"]);
      queryClient.invalidateQueries(["files", "analytics"]);
      queryClient.invalidateQueries(["files", "activities"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Upload multiple files
export const useUploadMultipleFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: FormData
    ): Promise<MultipleFileUploadResponse> => {
      const response = await AxiosInstancemultipartWithToken.post(
        "/api/v1/files/upload_multiple",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["files", "all"]);
      queryClient.invalidateQueries(["files", "storage"]);
      queryClient.invalidateQueries(["files", "analytics"]);
      queryClient.invalidateQueries(["files", "activities"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Update file
export const useUpdateFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      data,
    }: {
      fileId: string;
      data: FileUpdateType;
    }): Promise<FileResponse> => {
      const response = await AxiosInstanceWithToken.put(
        `/api/v1/files/${fileId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data, { fileId }) => {
      queryClient.setQueryData(["files", "detail", fileId], data);
      queryClient.invalidateQueries(["files", "all"]);
      queryClient.invalidateQueries(["files", "activities"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Delete file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string): Promise<FileDeleteResponse> => {
      const response = await AxiosInstanceWithToken.delete(
        `/api/v1/files/${fileId}`
      );
      return response.data;
    },
    onSuccess: (_, fileId) => {
      queryClient.removeQueries(["files", "detail", fileId]);
      queryClient.invalidateQueries(["files", "all"]);
      queryClient.invalidateQueries(["files", "storage"]);
      queryClient.invalidateQueries(["files", "analytics"]);
      queryClient.invalidateQueries(["files", "activities"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Create Activity
export const useCreateFileActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateFileActivity
    ): Promise<FileActivityResponse> => {
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/files/activities",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["files", "activities"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// Get Activities
export const useGetFileActivities = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["files", "activities"],
    queryFn: async (): Promise<RecentActivityResponse> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/files/activities"
      );
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      console.error("Error fetching file activities:", error);
    },
  });
};

// Delete Activity
export const useDeleteFileActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityId: string): Promise<void> => {
      await AxiosInstanceWithToken.delete(
        `/api/v1/files/activities/${activityId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["files", "activities"]);
    },
  });
};

// Extend storage
export const useExtendStorage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StorageUpdateType): Promise<StorageResponse> => {
      const response = await AxiosInstanceWithToken.put(
        "/api/v1/files/storage/extend",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["files", "storage"]);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// -----------------------------------------------
// Combined File Hooks
// -------------------------------------------------

// Get comprehensive file dashboard data
export const useFileDashboard = (enabled: boolean = true) => {
  const files = useGetAllFiles({}, enabled);
  const storage = useGetStorageInfo(enabled);
  const analytics = useGetAnalyticsDashboard(enabled);

  return {
    files: files.data,
    storage: storage.data,
    analytics: analytics.data,
    isLoading: files.isLoading || storage.isLoading || analytics.isLoading,
    error: files.error || storage.error || analytics.error,
    isError: files.isError || storage.isError || analytics.isError,
    refetch: () => {
      files.refetch();
      storage.refetch();
      analytics.refetch();
    },
  };
};

// File management hook with common operations
export const useFileManagement = () => {
  const uploadFile = useUploadFile();
  const uploadMultiple = useUploadMultipleFiles();
  const updateFile = useUpdateFile();
  const deleteFile = useDeleteFile();

  const handleUploadFile = async (formData: FormData) => {
    return uploadFile.mutateAsync(formData);
  };

  const handleUploadMultiple = async (formData: FormData) => {
    return uploadMultiple.mutateAsync(formData);
  };

  const handleUpdateFile = async (fileId: string, data: FileUpdateType) => {
    return updateFile.mutateAsync({ fileId, data });
  };

  const handleDeleteFile = async (fileId: string) => {
    return deleteFile.mutateAsync(fileId);
  };

  const handleDeleteFiles = async (fileIds: string[]) => {
    const promises = fileIds.map((id) => deleteFile.mutateAsync(id));
    return Promise.all(promises);
  };

  return {
    uploadFile: handleUploadFile,
    uploadMultiple: handleUploadMultiple,
    updateFile: handleUpdateFile,
    deleteFile: handleDeleteFile,
    deleteFiles: handleDeleteFiles,
    isUploadingFile: uploadFile.isLoading,
    isUploadingMultiple: uploadMultiple.isLoading,
    isUpdatingFile: updateFile.isLoading,
    isDeletingFile: deleteFile.isLoading,
  };
};

// Storage management hook
export const useStorageManagement = () => {
  const storageInfo = useGetStorageInfo();
  const extendStorage = useExtendStorage();

  const handleExtendStorage = async (data: StorageUpdateType) => {
    return extendStorage.mutateAsync(data);
  };

  return {
    storage: storageInfo.data,
    isLoading: storageInfo.isLoading,
    error: storageInfo.error,
    extendStorage: handleExtendStorage,
    isExtendingStorage: extendStorage.isLoading,
    refetch: storageInfo.refetch,
  };
};
