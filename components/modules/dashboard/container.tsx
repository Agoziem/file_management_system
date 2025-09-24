"use client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { recentFiles, sampleData } from "./dummy-data";
import { StoragePanelContent } from "./storage-panel";
import QuickActions from "./quick-action";
import DataTable from "../../custom/datatable";
import FilesDataTable from "../../custom/datatable";
import { FileResponse } from "@/types/files";
import Link from "next/link";
import UploadDropdown from "@/components/custom/upload-dropdown";
import { useGetCurrentUserProfile } from "@/data/user";

export default function FileManagerDashboard() {
  const { data:userProfile} = useGetCurrentUserProfile();
  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
      <div className="p-4 xl:col-span-7 ">
        {/* All files header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-xl font-semibold lg:text-2xl dark:text-white">
              Welcome, {userProfile?.first_name || 'User'}
            </h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              All of your files are displayed here
            </p>
          </div>

          <UploadDropdown
            component={
              <Button className="bg-primary md:hidden" size="sm">
                <Upload className="h-4 w-4 lg:mr-2" />
                <span className="">Upload file</span>
              </Button>
            }
          />
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base lg:text-lg">Quick Actions</h2>
          </div>
          <QuickActions />
        </div>

        {/* Recently modified */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base lg:text-lg">Recently modified</h2>
            <Button variant="ghost" className="text-sm text-primary" asChild>
              <Link href="/recent">View all →</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentFiles.map((file, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-lg">
                    <file.icon className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {file.size} • {file.type}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All files section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base lg:text-lg">All Files</h2>
          </div>
        </div>
        <FilesDataTable data={sampleData} />
      </div>

      <div className="hidden xl:block xl:col-span-3 pt-4">
        <StoragePanelContent />
      </div>
    </div>
  );
}
