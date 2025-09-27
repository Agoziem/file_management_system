"use client";
import FilesDataTable from "@/components/custom/datatable";
import { useDeleteFile, useGetAllFiles } from "@/data/files";
import React from "react";
import { toast } from "sonner";

const ImagesContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
    file_type: "image",
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
          Images
        </h2>
        <p className="text-muted-foreground">
          Manage and organize your images efficiently
        </p>
      </div>
      <div>
        <FilesDataTable
          data={userFiles ? userFiles.items : []}
          uploadlink="/images/upload"
          buttonText="Upload Image"
          loading={isLoadingFiles}
          onDeleteFiles={handleDelete}
        />
      </div>
    </div>
  );
};

export default ImagesContainer;
