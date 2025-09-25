import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaRegFileImage } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";
import { MdOutlineArticle } from "react-icons/md";
import { toast } from "sonner";

/**
 * Props for the ImageUploader component.
 */
interface ImageUploaderProps {
  name: string;
  value: File | string | null;
  onChange: (value: File | string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ name = "image", value, onChange }) => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("No Selected file");
  const [image, setImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (value instanceof File) {
      setFileName(value.name);
      const imageUrl = URL.createObjectURL(value);
      setImage(imageUrl);
    } else if (typeof value === "string") {
      setFileName("No Selected file");
      setImage(value);
    }
    // Clear the input field when value changes (e.g., on reset)
    if (fileInput.current) {
      fileInput.current.value = "";
    }

    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Invalid file type. Only .jpg, .jpeg, .png files are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setFileName(file.name);
    setImage(imageUrl);
    onChange(file);
  };

  const handleRemoveFile = () => {
    if (!value) return;
    setFileName("No Selected file");
    setImage(null);
    onChange("");
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center">
        {/* Hidden File Input */}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          name={name}
        />

        {/* Image Display */}
        <div className="shrink-0">
          {image ? (
            <Image
              src={image}
              className="rounded-lg object-cover object-top w-[90px] h-[90px] mr-3"
              alt="Uploaded Image"
              height={150}
              width={150}
            />
          ) : (
            <div className="flex justify-center items-center mr-3 rounded-lg w-[90px] h-[90px] text-4xl border border-dashed border-zinc-400 text-zinc-400">
              <MdOutlineArticle />
            </div>
          )}
        </div>

        {/* Selection or Update button */}
        <div>
          <p className="mb-0">Image Selection</p>
          <div className="mb-3 text-xs text-zinc-400">
            Only .jpg, .jpeg, .png files are allowed
          </div>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={(e) => {
              e.preventDefault();
              fileInput.current?.click();
            }}
          >
            <LuUpload className="text-lg" />
            {image ? "Change Image" : "Upload Image"}
          </Button>
        </div>
      </div>

      {/* File Name and Remove button */}
      <div className="flex items-center w-full max-w-[200px] rounded-lg py-2">
        <FaRegFileImage className="h4 text-primary" />
        <div className="flex-1 overflow-hidden">
          <p className="font-medium text-sm mt-2 mx-3 mb-2 truncate text-wrap text-ellipsis">
            {fileName}
          </p>
        </div>
        {value && (
          <FaTimes
            className="text-lg text-red-600 ml-2"
            onClick={handleRemoveFile}
          />
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
