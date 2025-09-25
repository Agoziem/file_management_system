"use client";
import Backbutton from "@/components/custom/backbutton";
import React from "react";
import VideoUploader from "./video-uploader";
import { useUploadMultipleFiles } from "@/data/files";
import { toast } from "sonner";

export const UploadVideos = () => {
  const [uploading, setUploading] = React.useState(false);
  const { mutateAsync: uploadFiles } = useUploadMultipleFiles();

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    toast.loading("Uploading videos...", { id: "upload_video" });
    try {
      const formData = new FormData();
      const keys = files.map((file) => file.name);
      files.forEach((file, index) => {
        formData.append("files", file); // backend will treat as list[UploadFile]
        formData.append("keys", keys[index]); // backend will treat as list[str]
      });
      await uploadFiles(formData);
      toast.success("Videos uploaded successfully!", { id: "upload_video" });
    } catch (error) {
      console.error("Error uploading videos:", error);
      toast.error("Error uploading videos. Please try again.", {
        id: "upload_video",
      });
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto mt-3 my-10">
      <Backbutton className="mb-3" />
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">
          Upload Videos
        </h2>
        <p className="text-muted-foreground">
          Upload and manage your videos easily
        </p>
      </div>
      <VideoUploader onUpload={handleUpload} uploading={uploading} />
    </div>
  );
};
