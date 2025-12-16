"use client";
import FilesDataTable from "@/components/custom/datatable";
import React from "react";
import { useDeleteFile, useGetAllFiles } from "@/data/files";
import { toast } from "sonner";
import UploadDropdown from "@/components/custom/upload-dropdown";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

const AudioContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
    file_type: "audio",
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
    <div className="w-full p-4 space-y-6 md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Audio
          </h2>
          <p className="text-muted-foreground">
            Manage and organize your audio files efficiently
          </p>
        </div>
        <Button className="" asChild>
          <Link href="/audios/upload">
            <Upload className="h-4 w-4" />
            <span>Upload Audio</span>
          </Link>
        </Button>
      </div>


      <div>
        <FilesDataTable
          data={userFiles ? userFiles.items : []}
          uploadlink="/audios/upload"
          buttonText="Upload Audio"
          loading={isLoadingFiles}
          onDeleteFiles={handleDelete}
        />
      </div>
    </div>
  );
};

export default AudioContainer;
