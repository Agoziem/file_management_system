import {
  CheckIcon,
  FileText,
  Image,
  Video,
  Music,
  FileIcon,
} from "lucide-react";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  FileActivityWithFileDetails,
  FileActivityActions,
} from "@/types/files";
import { Card } from "@/components/ui/card";
import { useGetRecentActivity } from "@/data/files";
import { formatDate, formatFileSize } from "@/utils/utility";

// Helper function to get file icon based on type
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

// Helper function to get action color
const getActionColor = (action: FileActivityActions): string => {
  switch (action) {
    case "uploaded":
      return "text-green-600";
    case "modified":
      return "text-blue-600";
    case "shared":
      return "text-purple-600";
    case "archived":
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};

export default function RecentFilesList() {
  const { data: recentActivities } = useGetRecentActivity();
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">
          Recent Activity
        </h2>
        <p className="text-sm text-muted-foreground">
          Your latest file operations and updates
        </p>
      </div>

      <Timeline
        defaultValue={recentActivities?.recent_activity.length}
        value={recentActivities?.recent_activity.length}
      >
        {recentActivities?.recent_activity.map((activity, index) => {
          const FileIconComponent = getFileIcon(activity.file_type);

          return (
            <TimelineItem
              key={activity.id}
              step={index + 1}
              className="group-data-[orientation=vertical]/timeline:ms-10"
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineDate className="text-sm text-muted-foreground">
                  {formatDate(activity.timestamp)}
                </TimelineDate>
                <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-8 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7 border-2">
                  <FileIconComponent size={16} />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                      <FileIconComponent className="text-primary h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="truncate text-sm font-medium">
                          {activity.file_name}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-opacity-10 ${getActionColor(
                            activity.action
                          )}`}
                        >
                          {activity.action}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {formatFileSize(activity.file_size)} •{" "}
                        {activity.file_type.toUpperCase()}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Created: {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          Complete
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>

      {recentActivities?.recent_activity.length === 0 && (
        <div className="text-center py-8">
          <FileIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No recent activity found</p>
        </div>
      )}
    </div>
  );
}
