"use client";
import React from "react";
import ImagesUploader from "./images-uploader";
import Backbutton from "@/components/custom/backbutton";
import { useUploadMultipleFiles } from "@/data/files";
import { toast } from "sonner";

const UploadImages = () => {
  const [uploading, setUploading] = React.useState(false);
  const { mutateAsync: uploadFiles } = useUploadMultipleFiles();
  
    const handleUpload = async (files: File[]) => {
      setUploading(true);
      toast.loading("Uploading images...", { id: "upload_image" });
      try {
        const formData = new FormData();
        const keys = files.map((file) => file.name);
        files.forEach((file, index) => {
          formData.append("files", file); // backend will treat as list[UploadFile]
          formData.append("keys", keys[index]); // backend will treat as list[str]
        });
        await uploadFiles(formData);
        toast.success("Images uploaded successfully!", { id: "upload_image" });
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Error uploading images. Please try again.", { id: "upload_image" });
      } finally {
        setUploading(false);
      }
    };
  return (
    <div className="max-w-3xl mx-auto mt-3 my-10">
      <Backbutton className="mb-3" />
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Upload Images</h2>
        <p className="text-muted-foreground">
          Upload and manage your images easily
        </p>
      </div>
      <ImagesUploader onUpload={handleUpload} uploading={uploading} />
    </div>
  );
};

export default UploadImages;
