"use client";
import Navbar from "@/components/layouts/navbar";
import AppSidebar from "@/components/layouts/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";
import useFcmToken from "@/hooks/useFcmToken";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { token, notificationPermissionStatus } = useFcmToken();
  return (
    <div>
      <SidebarProvider>
        {/* Sidebar Component goes here */}
        <AppSidebar />

        {/* Main Component goes here */}
        <main className="grid w-full h-screen overflow-hidden">
          <Navbar />
          <ScrollArea className="h-[calc(100vh-56px)]">
            <div className="p-2 pt-0 md:p-4 md:pr-6 md:pt-0 pb-24">
              {children}
            </div>
          </ScrollArea>
        </main>
      </SidebarProvider>
      
    </div>
  );
};

export default DashboardLayout;
