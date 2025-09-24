"use client";
import Backbutton from '@/components/custom/backbutton';
import React from 'react'
import AudioUploader from './audio-uploader';

export const UploadAudios = () => {
  const [uploading, setUploading] = React.useState(false);
  const handleUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
  };
  return (
    <div className="max-w-3xl mx-auto mt-3 my-10">
      <Backbutton className="mb-3" />
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Upload Audios</h2>
        <p className="text-muted-foreground">
          Upload and manage your audios easily
        </p>
      </div>
      <AudioUploader onUpload={handleUpload} uploading={uploading}/>
    </div>
  );
};