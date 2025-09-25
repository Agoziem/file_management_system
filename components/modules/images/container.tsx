"use client";
import FilesDataTable from "@/components/custom/datatable";
import { useGetAllFiles } from "@/data/files";
import React from "react";

const ImagesContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
      file_type: "image",
    });

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
        />
      </div>
    </div>
  );
};

export default ImagesContainer;
