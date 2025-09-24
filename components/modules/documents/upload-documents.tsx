"use client";
import React from "react";
import DocumentsUploader from "./documents-uploader";
import Backbutton from "@/components/custom/backbutton";

const UploadDocument = () => {
  const handleUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
  }
  return (
    <div className="max-w-3xl mx-auto mt-3 my-10">
      <Backbutton className="mb-3" />
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Upload Documents</h2>
        <p className="text-muted-foreground">
          Upload and manage your documents easily
        </p>
      </div>
      <DocumentsUploader onUpload={handleUpload} />
    </div>
  );
};

export default UploadDocument;
