"use client";

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";

import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/custom/spinner";

// Create some dummy initial video files
const initialFiles = [
  {
    name: "presentation_demo.mp4",
    size: 52428800, // ~50MB
    type: "video/mp4",
    url: "https://example.com/presentation_demo.mp4",
    id: "presentation_demo-1744638436563-8u5xuls",
  },
  {
    name: "tutorial_intro.mov",
    size: 104857600, // ~100MB
    type: "video/quicktime",
    url: "https://example.com/tutorial_intro.mov",
    id: "tutorial_intro-123456789",
  },
  {
    name: "conference_recording.webm",
    size: 78643200, // ~75MB
    type: "video/webm",
    url: "https://example.com/conference_recording.webm",
    id: "conference_recording-987654321",
  },
];

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx"),
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar"),
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx"),
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes("video/"),
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes("audio/"),
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith("image/"),
    },
  };

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-9 opacity-60" />;
    }
  }

  return <FileIcon className="size-9 opacity-60" />;
};

const getFilePreview = (file: {
  file: File | { type: string; name: string; url?: string };
}) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const renderImage = (src: string) => (
    <img
      src={src}
      alt={fileName}
      className="size-full rounded-t-[inherit] object-cover"
    />
  );

  const renderVideo = (src: string) => (
    <video
      src={src}
      className="size-full rounded-t-[inherit] object-cover"
      controls={false}
      muted
      preload="metadata"
      onMouseEnter={(e) => {
        e.currentTarget.currentTime = 1; // Show frame at 1 second
      }}
    />
  );

  return (
    <div className="bg-secondary flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit] relative">
      {fileType.startsWith("image/") ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file);
            return renderImage(previewUrl);
          })()
        ) : file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className="size-12 opacity-60 text-primary" />
        )
      ) : fileType.startsWith("video/") ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file);
            return (
              <div className="relative size-full">
                {renderVideo(previewUrl)}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                  <VideoIcon className="size-8 text-primary drop-shadow-lg" />
                </div>
              </div>
            );
          })()
        ) : file.file.url ? (
          <div className="relative size-full">
            {renderVideo(file.file.url)}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <VideoIcon className="size-8 text-primary drop-shadow-lg" />
            </div>
          </div>
        ) : (
          <VideoIcon className="size-5 text-primary" />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  );
};

export default function VideoUploader({
  onUpload,
  uploading,
}: {
  onUpload?: (files: File[]) => Promise<void>;
  uploading?: boolean;
}) {
  const maxSizeMB = 500; // 500MB for video files
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 5; // Fewer video files due to larger size
  const accept = "video/*";

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    initialFiles,
    accept,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload video file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Videos ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={openFileDialog}>
                  <UploadIcon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Add videos
                </Button>
                <Button variant="outline" size="sm" onClick={clearFiles}>
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Remove all
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={async () => {
                    if (onUpload) {
                      const uploadFiles = files
                        .map((f) => (f.file instanceof File ? f.file : null))
                        .filter((f): f is File => f !== null);
                      await onUpload(uploadFiles);
                    }
                    clearFiles();
                  }}
                >
                  {uploading ? (
                    <ButtonSpinner label="Uploading..." />
                  ) : (
                    "Upload Videos"
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-background relative flex flex-col rounded-md border"
                >
                  {getFilePreview(file)}
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove video file"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                  <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                    <p className="truncate text-[13px] font-medium">
                      {file.file.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {formatBytes(file.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <VideoIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              Drop your video files here
            </p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} video files ∙ Up to {maxSizeMB}MB each
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select video files
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
