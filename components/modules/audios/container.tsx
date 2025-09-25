"use client";
import FilesDataTable from "@/components/custom/datatable";
import React from "react";
import { useGetAllFiles } from "@/data/files";

const AudioContainer = () => {
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles({
    file_type: "audio",
  });
  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">
          Audio
        </h2>
        <p className="text-muted-foreground">
          Manage and organize your audio files efficiently
        </p>
      </div>
      <div>
        <FilesDataTable
          data={userFiles ? userFiles.items : []}
          uploadlink="/audios/upload"
          buttonText="Upload Audio"
          loading={isLoadingFiles}
        />
      </div>
    </div>
  );
};

export default AudioContainer;
