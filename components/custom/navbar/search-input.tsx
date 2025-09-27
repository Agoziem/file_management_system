"use client";

import * as React from "react";
import {
  ArrowUpRightIcon,
  CircleFadingPlusIcon,
  FileInputIcon,
  FileText,
  FolderPlusIcon,
  ImageIcon,
  SearchIcon,
  VideoIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchInputComponent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] hidden md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal">Search</span>
        </span>
        <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </button>
      {/* button for small screen */}
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background p-2 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring  md:hidden"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick start">
            <CommandItem asChild>
              <Link href="/documents/upload">
                <FileText
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>New File</span>
                <CommandShortcut className="justify-center">⌘F</CommandShortcut>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/documents/upload">
                <CircleFadingPlusIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Upload Document</span>
                <CommandShortcut className="justify-center">⌘D</CommandShortcut>
              </Link>
            </CommandItem>

            <CommandItem asChild>
              <Link href="/images/upload">
                <ImageIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Upload Image</span>
                <CommandShortcut className="justify-center">⌘I</CommandShortcut>
              </Link>
            </CommandItem>

            <CommandItem asChild>
              <Link href="/videos/upload">
                <VideoIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Upload Video</span>
                <CommandShortcut className="justify-center">⌘V</CommandShortcut>
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem asChild>
              <Link href="/dashboard">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to dashboard</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/images">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to images</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/videos">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Videos</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/audios">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Audios</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/profile">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Profile</span>
              </Link>
            </CommandItem>

            <CommandItem asChild>
              <Link href="/recents">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Recents</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
