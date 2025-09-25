import { useGetAllFiles, useGetStorageInfo } from "@/data/files";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ChartRadialShape } from "./storage-chart";
import { FileIcon, FileText, Image, LucideProps, Music, Video } from "lucide-react";
import { RefAttributes, useMemo } from "react";
import { formatFileSize } from "@/utils/utility";
import { Skeleton } from "@/components/ui/skeleton";

const fileTypes = ["image", "video", "audio", "document", "other"];

type StorageData = {
  type: typeof fileTypes[number];
  files: number;
  size: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

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

export const StoragePanelContent = () => {
  const { data: storageInfo, isLoading, error } = useGetStorageInfo();
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles();

  const storageData: StorageData[] = useMemo(() => {
  const fileTypeMap: { [key: string]: { count: number; totalSize: number } } = {};

  if (userFiles) {
    userFiles.items.forEach(file => {
      const type = file.file_type || "other";
      if (!fileTypeMap[type]) {
        fileTypeMap[type] = { count: 0, totalSize: 0 };
      }
      fileTypeMap[type].count += 1;
      fileTypeMap[type].totalSize += file.file_size;
    });
  }

  return fileTypes.map(type => {
    const { count = 0, totalSize = 0 } = fileTypeMap[type] || {};
    return {
      type,
      files: count,
      size: count === 0 ? "0 MB" : formatFileSize(totalSize),
      icon: getFileIcon(type),
    };
  });
}, [userFiles]);

  if (isLoading || isLoadingFiles) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32 mb-2 bg-muted" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Chart Skeleton */}
            <div className="flex items-center justify-center">
              <Skeleton className="h-32 w-32 rounded-full bg-muted" />
            </div>
            {/* File type breakdown skeletons */}
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg bg-muted" />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <Skeleton className="h-4 w-20 bg-muted" />
                    </div>
                    <Skeleton className="h-3 w-32 bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div>Error loading storage information</div>;
  }

  return (
    <Card className="mb-6 ">
      <CardHeader>
        <CardTitle className="text-lg font-century-gothic">
          Storage usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartRadialShape totalStorage={storageInfo?.total_space || 0} usedStorage={storageInfo?.used_space || 0} />

        <div className="space-y-4 mt-2">
          {storageData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-lg">
                <item.icon className="text-secondary-foreground h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  {item.files} Files | {item.size}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
