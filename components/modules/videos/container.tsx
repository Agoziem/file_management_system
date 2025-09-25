"use client";
import FilesDataTable from "@/components/custom/datatable";
import { useGetAllFiles } from "@/data/files";
import React from "react";

const VideosContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
    file_type: "video",
  });
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
        />
      </div>
    </div>
  );
};

export default VideosContainer;
