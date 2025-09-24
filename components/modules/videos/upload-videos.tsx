"use client";
import Backbutton from '@/components/custom/backbutton';
import React from 'react'
import VideoUploader from './video-uploader';

export const UploadVideos = () => {
  const [uploading, setUploading] = React.useState(false);
  const handleUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
  };
  return (
    <div className="max-w-3xl mx-auto mt-3 my-10">
      <Backbutton className="mb-3" />
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Upload Videos</h2>
        <p className="text-muted-foreground">
          Upload and manage your videos easily
        </p>
      </div>
      <VideoUploader onUpload={handleUpload} uploading={uploading}/>
    </div>
  );
};