"use client";
import FilesDataTable from "@/components/custom/datatable";
import { useDeleteFile, useGetAllFiles } from "@/data/files";
import React from "react";

const DocumentsContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
    file_type: "document",
  });

  const { mutateAsync: removeFile } = useDeleteFile();

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">
          Documents
        </h2>
        <p className="text-muted-foreground">
          Manage and organize your documents efficiently
        </p>
      </div>
      <div>
        <FilesDataTable
          data={userFiles ? userFiles.items : []}
          uploadlink="/documents/upload"
          buttonText="Upload Document"
          loading={isLoadingFiles}
        />
      </div>
    </div>
  );
};

export default DocumentsContainer;
