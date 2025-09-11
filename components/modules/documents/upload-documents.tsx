"use client";
import React from "react";
import DocumentsUploader from "./documents-uploader";

const UploadDocument = () => {
  const handleUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
  }
  return (
    <div className="max-w-3xl mx-auto mt-6 my-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Upload Documents</h2>
        <p className="text-muted-foreground">
          Upload and manage your documents easily
        </p>
      </div>
      <DocumentsUploader onUpload={handleUpload} />
    </div>
  );
};

export default UploadDocument;
