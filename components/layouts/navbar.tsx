"use client";

import React, { useState, useEffect } from "react";
import { Menu, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import SearchInputComponent from "../custom/navbar/search-input";
import ThemeSwitcherComponent from "../custom/navbar/theme-switcher";
import AvatarDropdownComponent from "../custom/navbar/avatar-dropdown";
import { StoragePanelContent } from "../modules/dashboard/storage-panel";
import NotificationBtn from "../custom/navbar/notification-btn";
import UploadDropdown from "../custom/upload-dropdown";
import { ScrollableSheet } from "../custom/reusable-sheet";
import { Skeleton } from "../ui/skeleton";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useSidebar();
  const [isStoragePanelOpen, setIsStoragePanelOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="flex h-16 items-center gap-4 bg-card px-4 lg:px-6 border-b border-border">
        <Skeleton className="h-8 w-8 md:h-9 md:w-9" />
        <div className="max-w-sm flex-1">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    );

  return (
    <header className="flex h-16 items-center gap-4 bg-card px-4 lg:px-6 border-b border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8 md:h-9 md:w-9"
      >
        <Menu className="h-4 w-4 md:h-5 md:w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      <div className="max-w-sm flex-1">
        <SearchInputComponent />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden"
          onClick={() => setIsStoragePanelOpen(true)}
        >
          <BarChart3 className="h-4 w-4" />
        </Button>

        <UploadDropdown
          component={
            <Button className="hidden md:inline-flex" size="sm">
              <Upload className="h-4 w-4" />
              <span>Upload file</span>
            </Button>
          }
        />
        <ThemeSwitcherComponent />
        <NotificationBtn />
        <AvatarDropdownComponent />
      </div>

      <ScrollableSheet
        open={isStoragePanelOpen}
        onOpenChange={setIsStoragePanelOpen}
        title="Merchant Details"
        description="Detailed view of merchant information"
        footer={
          <div className="w-full flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsStoragePanelOpen(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        <StoragePanelContent />
      </ScrollableSheet>
    </header>
  );
};

export default Navbar;
