"use client";

import { AlertCircleIcon, FileUpIcon, XIcon } from "lucide-react";

import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/custom/spinner";
import { getFileIcon } from "./fileicon";

export default function DocumentsUploader({
  onUpload,
  uploading = false,
}: {
  onUpload?: (files: File[]) => Promise<void>;
  uploading?: boolean;
}) {
  const maxSize = 100 * 1024 * 1024; // 10MB default
  const maxFiles = 10;

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
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border-2 dark:border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FileUpIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="text-muted-foreground mb-2 text-xs">
            Drag & drop or click to browse
          </p>
          <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
            <span>All files</span>
            <span>∙</span>
            <span>Max {maxFiles} files</span>
            <span>∙</span>
            <span>Up to {formatBytes(maxSize)}</span>
          </div>
        </div>
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

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-card flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-secondary text-secondary-foreground flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                  {getFileIcon(file)}
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">
                    {file.file instanceof File
                      ? file.file.name
                      : file.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(
                      file.file instanceof File
                        ? file.file.size
                        : file.file.size
                    )}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}

          {/* Remove all files button */}
          {files.length > 0 && (
            <div className="pt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={clearFiles}>
                {files.length > 1 ? "Remove all files" : "Remove file"}
              </Button>
              {/* to be implemented later */}
              <Button
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
                  files.length > 1 ? "Upload files" : "Upload file"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
