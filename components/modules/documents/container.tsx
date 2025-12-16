"use client";
import FilesDataTable from "@/components/custom/datatable";
import UploadDropdown from "@/components/custom/upload-dropdown";
import { Button } from "@/components/ui/button";
import { useDeleteFile, useGetAllFiles } from "@/data/files";
import { Upload } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const DocumentsContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
    file_type: "document",
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
    <div className="w-full p-3 sm:p-4 md:p-6 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Documents
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and organize your documents efficiently
          </p>
        </div>
        <Button className="" asChild>
          <Link href="/documents/upload">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Link>
        </Button>
      </div>

      <div>
        <FilesDataTable
          data={userFiles ? userFiles.items : []}
          uploadlink="/documents/upload"
          buttonText="Upload Document"
          loading={isLoadingFiles}
          onDeleteFiles={handleDelete}
        />
      </div>
    </div>
  );
};

export default DocumentsContainer;
