"use client";

import { useId, useRef, useState } from "react";
import {
  RiCodeFill,
  RiFacebookFill,
  RiMailLine,
  RiTwitterXFill,
} from "react-icons/ri";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialShareProps {
  fileUrl?: string;
}

export default function SocialShare({
  fileUrl = "https://originui.com/Avx8HD",
}: SocialShareProps) {
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(fileUrl);
    const text = encodeURIComponent("Check out this file");

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${text}&body=${url}`;
        break;
    }
  };

  return (
    <div className="flex flex-col gap-3 text-center p-2">
      <div className="text-sm font-medium">Share file</div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button size="icon" variant="outline" aria-label="Embed">
          <RiCodeFill size={16} aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="Share on Twitter"
          onClick={() => handleShare("twitter")}
        >
          <RiTwitterXFill size={16} aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="Share on Facebook"
          onClick={() => handleShare("facebook")}
        >
          <RiFacebookFill size={16} aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="Share via email"
          onClick={() => handleShare("email")}
        >
          <RiMailLine size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={inputRef}
            id={id}
            className="pe-9"
            type="text"
            defaultValue={fileUrl}
            aria-label="Share link"
            readOnly
          />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopy}
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                  aria-label={copied ? "Copied" : "Copy to clipboard"}
                  disabled={copied}
                >
                  <div
                    className={cn(
                      "transition-all",
                      copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                  >
                    <CheckIcon
                      className="stroke-emerald-500"
                      size={16}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute transition-all",
                      copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                    )}
                  >
                    <CopyIcon size={16} aria-hidden="true" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">
                Copy to clipboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
