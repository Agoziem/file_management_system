"use client";
import React from "react";
import ImagesUploader from "./images-uploader";

const UploadImages = () => {
  const [uploading, setUploading] = React.useState(false);
  const handleUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
  };
  return (
    <div className="max-w-3xl mx-auto mt-6 my-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Upload Images</h2>
        <p className="text-muted-foreground">
          Upload and manage your images easily
        </p>
      </div>
      <ImagesUploader onUpload={handleUpload} uploading={uploading}/>
    </div>
  );
};

export default UploadImages;
