"use client";

import React, { useState } from "react";
import { Folder, LogOut, LucideGem, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarItems } from "../modules/dashboard/dummy-data";
import LogoutModal from "../modules/auth/logout-modal";

const AppSidebar = () => {
  const pathname = usePathname();
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="border-0">
        <SidebarHeader>
          <div className="flex items-center gap-2 py-3 px-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Folder className="size-4 text-white" />
            </div>
            {state === "expanded" && (
              <span className="text-lg font-semibold">File Manager</span>
            )}
          </div>
        </SidebarHeader>

        <ScrollArea className="h-screen">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className={state === "collapsed" ? "" : "px-3"}>
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.label}
                          className="h-[36px]"
                        >
                          <Link href={item.href}>
                            {item.icon && <item.icon size={18} />}
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Logout" className="mt-4" onClick={() => setShowLogoutModal(true)}>
                      <LogOut size={20} />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </ScrollArea>

        <SidebarFooter className="px-3">
          {state === "expanded" && (
            <Card className="p-3 bg-card border border-border shadow-none">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <Star size={20} className="text-primary" />
                  <span className="text-sm text-primary">
                    Upgrade to unlock full access
                  </span>
                </div>
                <Button
                  variant={"secondary"}
                  className="w-full text-sm text-primary"
                >
                  <LucideGem />
                  Upgrade now
                </Button>
              </div>
            </Card>
          )}
        </SidebarFooter>
      </Sidebar>
      <LogoutModal
        open={showLogoutModal}
        handleToggle={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default AppSidebar;
