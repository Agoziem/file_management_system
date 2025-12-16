"use client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoragePanelContent } from "./storage-panel";
import QuickActions from "./quick-action";
import FilesDataTable from "../../custom/datatable";
import Link from "next/link";
import UploadDropdown from "@/components/custom/upload-dropdown";
import { useGetCurrentUserProfile } from "@/data/user";
import { useGetAllFiles, useGetRecentActivity } from "@/data/files";
import {
  CheckIcon,
  FileText,
  Image,
  Video,
  Music,
  FileIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFileSize } from "@/utils/utility";

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "image":
      return Image;
    case "video":
      return Video;
    case "audio":
      return Music;
    case "document":
      return FileText;
    default:
      return FileIcon;
  }
};

export default function FileManagerDashboard() {
  const { data: userProfile, isLoading: isLoadingUser } =
    useGetCurrentUserProfile();
  const { data: recentActivities, isLoading: isLoadingRecent } =
    useGetRecentActivity();
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles();
  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-4 sm:gap-6">
      <div className="p-3 sm:p-4 xl:col-span-7 ">
        {/* All files header */}
        <div className="mb-4 sm:mb-6 flex flex-row items-end sm:items-center justify-between gap-3">
          <div>
            <h1 className="mb-1 text-xl lg:text-2xl font-semibold dark:text-white">
              Welcome, {userProfile?.first_name || "User"}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
              All of your files are displayed here
            </p>
          </div>

          <UploadDropdown
            component={
              <Button className="bg-primary md:hidden" size="sm">
                <Upload className="h-4 w-4 lg:mr-2" />
                <span className="hidden sm:inline">Upload file</span>
              </Button>
            }
          />
        </div>

        {/* Quick actions */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold">
              Quick Actions
            </h2>
          </div>
          <QuickActions />
        </div>

        {/* Recently modified */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold">
              Recently modified
            </h2>
            <Button variant="ghost" className="text-sm text-primary" asChild>
              <Link href="/recent">View all →</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingRecent ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-3 w-full bg-muted" />
                        <Skeleton className="h-3 w-full bg-muted" />
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              recentActivities?.recent_activity
                .slice(0, 3)
                .map((activity, index) => {
                  const FileIconComponent = getFileIcon(activity.file_type);
                  return (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-lg">
                          <FileIconComponent className="text-primary h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {activity.file_name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatFileSize(activity.file_size)} •{" "}
                            {activity.file_type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })
            )}
          </div>
        </div>

        {/* All files section */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold">
              All Files
            </h2>
          </div>
        </div>
        <FilesDataTable data={userFiles?.items} loading={isLoadingFiles} />
      </div>

      <div className="hidden xl:block xl:col-span-3 pt-3 sm:pt-4">
        <StoragePanelContent />
      </div>
    </div>
  );
}
