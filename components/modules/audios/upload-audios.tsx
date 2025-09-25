"use client";
import Backbutton from '@/components/custom/backbutton';
import React from 'react'
import AudioUploader from './audio-uploader';
import { toast } from 'sonner';
import { useUploadMultipleFiles } from '@/data/files';

export const UploadAudios = () => {
  const [uploading, setUploading] = React.useState(false);
    const { mutateAsync: uploadFiles } = useUploadMultipleFiles();
  
    const handleUpload = async (files: File[]) => {
      setUploading(true);
      toast.loading("Uploading audio...", { id: "upload_audio" });
      try {
        const formData = new FormData();
        const keys = files.map((file) => file.name);
        files.forEach((file, index) => {
          formData.append("files", file); // backend will treat as list[UploadFile]
          formData.append("keys", keys[index]); // backend will treat as list[str]
        });
        await uploadFiles(formData);
        toast.success("Audios uploaded successfully!", { id: "upload_audio" });
      } catch (error) {
        console.error("Error uploading audios:", error);
        toast.error("Error uploading audios. Please try again.", {
          id: "upload_audio",
        });
      } finally {
        setUploading(false);
      }
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