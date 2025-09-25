"use client";
import React, { useState } from "react";
import DocumentsUploader from "./documents-uploader";
import Backbutton from "@/components/custom/backbutton";
import { useUploadMultipleFiles } from "@/data/files";
import { toast } from "sonner";

const UploadDocument = () => {
  const [uploading, setUploading] = useState(false);
  const { mutateAsync: uploadFiles } = useUploadMultipleFiles();

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    toast.loading("Uploading documents...", { id: "upload_document" });
    try {
      const formData = new FormData();
      const keys = files.map((file) => file.name);
      files.forEach((file, index) => {
        formData.append("files", file); // backend will treat as list[UploadFile]
        formData.append("keys", keys[index]); // backend will treat as list[str]
      });
      await uploadFiles(formData);
      toast.success("Documents uploaded successfully!", { id: "upload_document" });
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Error uploading documents. Please try again.", { id: "upload_document" });
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-3 my-10">
      <Backbutton className="mb-3" />
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">
          Upload Documents
        </h2>
        <p className="text-muted-foreground">
          Upload and manage your documents easily
        </p>
      </div>
      <DocumentsUploader onUpload={handleUpload} uploading={uploading} />
    </div>
  );
};

export default UploadDocument;
