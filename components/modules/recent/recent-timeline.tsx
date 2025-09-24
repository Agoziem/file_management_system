import { CheckIcon, FileText, Image, Video, Music, FileIcon } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"
import { FileActivityWithFileDetails, FileActivityActions } from "@/types/files"
import { Card } from "@/components/ui/card"
import moment from "moment"

const recentFiles: FileActivityWithFileDetails[] = [
  {
    id: "1",
    file_name: "Project_Proposal.pdf",
    file_type: "document",
    file_size: 2048576, // 2MB
    file_id: "f1",
    timestamp: "2025-09-10T08:30:00Z",
    action: "uploaded"
  },
  {
    id: "2",
    file_name: "presentation_slides.pptx",
    file_type: "document",
    file_size: 15728640, // 15MB
    file_id: "f2",
    timestamp: "2025-09-10T07:45:00Z",
    action: "modified"
  },
  {
    id: "3",
    file_name: "team_photo.jpg",
    file_type: "image",
    file_size: 5242880, // 5MB
    file_id: "f3",
    timestamp: "2025-09-10T06:20:00Z",
    action: "uploaded"
  },
  {
    id: "4",
    file_name: "demo_video.mp4",
    file_type: "video",
    file_size: 52428800, // 50MB
    file_id: "f4",
    timestamp: "2025-09-09T16:30:00Z",
    action: "uploaded"
  },
  {
    id: "5",
    file_name: "background_music.mp3",
    file_type: "audio",
    file_size: 8388608, // 8MB
    file_id: "f5",
    timestamp: "2025-09-09T14:15:00Z",
    action: "shared"
  },
  {
    id: "6",
    file_name: "database_backup.sql",
    file_type: "other",
    file_size: 104857600, // 100MB
    file_id: "f6",
    timestamp: "2025-09-09T12:00:00Z",
    action: "archived"
  }
]

// Helper function to get file icon based on type
const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'image':
      return Image
    case 'video':
      return Video
    case 'audio':
      return Music
    case 'document':
      return FileText
    default:
      return FileIcon
  }
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  return moment(dateString).format('MMM D, YYYY h:mm A')
}

// Helper function to get action color
const getActionColor = (action: FileActivityActions): string => {
  switch (action) {
    case 'uploaded':
      return 'text-green-600'
    case 'modified':
      return 'text-blue-600'
    case 'shared':
      return 'text-purple-600'
    case 'archived':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
}


export default function RecentFilesList() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Recent Activity</h2>
        <p className="text-muted-foreground">Your latest file operations and updates</p>
      </div>
      
      <Timeline defaultValue={recentFiles.length}>
        {recentFiles.map((file, index) => {
          const FileIconComponent = getFileIcon(file.file_type)
          
          return (
            <TimelineItem
              key={file.id}
              step={index + 1}
              className="group-data-[orientation=vertical]/timeline:ms-10"
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineDate className="text-sm text-muted-foreground">
                  {formatDate(file.timestamp)}
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
                        <p className="truncate text-sm font-medium">{file.file_name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full bg-opacity-10 ${getActionColor(file.action)}`}>
                          {file.action}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {formatFileSize(file.file_size)} • {file.file_type.toUpperCase()}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Created: {new Date(file.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-muted-foreground">Complete</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
      
      {recentFiles.length === 0 && (
        <div className="text-center py-8">
          <FileIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No recent activity found</p>
        </div>
      )}
    </div>
  )
}
