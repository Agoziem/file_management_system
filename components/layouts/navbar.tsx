"use client";

import React, { useState, useEffect } from "react";
import { Menu, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import SearchInputComponent from "../custom/navbar/search-input";
import ThemeSwitcherComponent from "../custom/navbar/theme-switcher";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "../ui/sheet";
import AvatarDropdownComponent from "../custom/navbar/avatar-dropdown";
import { StoragePanelContent } from "../modules/dashboard/storage-panel";
import NotificationBtn from "../custom/navbar/notification-btn";
import Link from "next/link";
import UploadDropdown from "../custom/upload-dropdown";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useSidebar();
  const [isStoragePanelOpen, setIsStoragePanelOpen] = useState(false);
  

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
        <Sheet open={isStoragePanelOpen} onOpenChange={setIsStoragePanelOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="xl:hidden">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-6">
            <SheetHeader className="sr-only">
              <SheetTitle>Storage Panel</SheetTitle>
              <SheetDescription>
                Displays storage usage and details.
              </SheetDescription>
            </SheetHeader>
            <StoragePanelContent />
          </SheetContent>
        </Sheet>

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
    </header>
  );
};

export default Navbar;
