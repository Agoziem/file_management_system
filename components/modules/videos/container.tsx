"use client";
import FilesDataTable from "@/components/custom/datatable";
import { useDeleteFile, useGetAllFiles } from "@/data/files";
import React from "react";
import { toast } from "sonner";

const VideosContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
    file_type: "video",
  });
  const { mutateAsync: removeFile } = useDeleteFile();

  const handleDelete = async (fileIds: string[]) => {
    // Show one loading toast before starting deletion
    toast.loading("Deleting files...", { id: "delete-files" });
    try {
      await Promise.all(
        fileIds.map(async (fileId) => {
          await removeFile(fileId);
        })
      );
      toast.success(`${fileIds.length} file(s) deleted successfully`, {
        id: "delete-files",
      });
    } catch (error) {
      console.error("Error deleting files:", error);
      toast.error("Some files could not be deleted", { id: "delete-files" });
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">
          Videos
        </h2>
        <p className="text-muted-foreground">
          Manage and organize your videos efficiently
        </p>
      </div>
      <div>
        <FilesDataTable
          data={userFiles ? userFiles.items : []}
          uploadlink="/videos/upload"
          buttonText="Upload Video"
          loading={isLoadingFiles}
          onDeleteFiles={handleDelete}
        />
      </div>
    </div>
  );
};

export default VideosContainer;
