"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  DownloadIcon,
  EllipsisIcon,
  FileIcon,
  FilterIcon,
  LinkIcon,
  ListFilterIcon,
  PlusIcon,
  Share2Icon,
  TrashIcon,
  Upload,
  XIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileResponse } from "@/types/files";
import SocialShare from "@/components/custom/social-share";
import moment from "moment";
import Link from "next/link";
import UploadDropdown from "./upload-dropdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Item = FileResponse;

// File type colors for badges
const getFileTypeColor = (fileType: string) => {
  switch (fileType) {
    case "image":
      return "bg-blue-500";
    case "document":
      return "bg-green-500";
    case "video":
      return "bg-purple-500";
    case "audio":
      return "bg-orange-500";
    case "other":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to format date with moment
const formatDate = (dateString: string) => {
  return moment(dateString).format("MMM D, YYYY, h:mm A");
};

// Row Actions Component
function RowActions({ row }: { row: Row<Item> }) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const fileUrl = row.original.file_url;
    navigator.clipboard.writeText(fileUrl);
    setLinkCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownload = () => {
    try {
      // Create a temporary anchor element to trigger download
      // This bypasses CORS restrictions for direct downloads
      const link = document.createElement("a");
      link.href = row.original.file_url;
      link.download = row.original.file_name;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open menu</span>
          <EllipsisIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownload}>
          <DownloadIcon className="h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {linkCopied ? (
            <CheckIcon className="h-4 w-4 text-emerald-500" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
          Copy link
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Share2Icon className="h-4 w-4" />
              Share
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="sr-only">
                Share file
              </AlertDialogTitle>
            </AlertDialogHeader>
            <SocialShare fileUrl={row.original.file_url} />
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-primary text-white">
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              variant="destructive"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <CircleAlertIcon className="opacity-80" size={16} />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete file?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  &ldquo;
                  {row.original.file_name}&rdquo; and remove it from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FilesDataTable({
  data = [],
  uploadlink,
  buttonText,
  onDeleteFiles,
  loading,
}: {
  data?: Item[];
  uploadlink?: string;
  buttonText?: string;
  onDeleteFiles?: (fileIds: string[]) => void;
  loading?: boolean;
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "file_name", desc: false },
  ]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<Item | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Listen for file preview events
  useEffect(() => {
    const handlePreview = (event: Event) => {
      const customEvent = event as CustomEvent<Item>;
      setPreviewFile(customEvent.detail);
      setShowPreview(true);
    };

    window.addEventListener("openFilePreview", handlePreview);
    return () => window.removeEventListener("openFilePreview", handlePreview);
  }, []);

  const displayData = data && data.length > 0 ? data : [];

  // Filter data based on search query and file type
  const filteredData = useMemo(() => {
    return displayData.filter((item) => {
      // Filter by file type
      const matchesFileType =
        !selectedFileTypes?.length ||
        selectedFileTypes.includes(item.file_type);

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.file_name.toLowerCase().includes(searchLower) ||
        item.file_type.toLowerCase().includes(searchLower);

      return matchesFileType && matchesSearch;
    });
  }, [searchQuery, selectedFileTypes, displayData]);

  // Count file types for filter badges
  const fileTypeCounts = useMemo(() => {
    return displayData.reduce((acc, item) => {
      acc[item.file_type] = (acc[item.file_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [displayData]);

  // Get unique file types
  const uniqueFileTypes = useMemo(() => {
    return Object.keys(fileTypeCounts).sort();
  }, [fileTypeCounts]);

  const handleFileTypeChange = (checked: boolean, value: string) => {
    setSelectedFileTypes((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  // Handle delete selected rows
  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const fileIds = selectedRows.map((row) => row.original.id);

    if (onDeleteFiles) {
      onDeleteFiles(fileIds);
    }

    table.resetRowSelection();
  };

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 35,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "file_name",
        id: "file_name",
        header: ({ column }) => (
          <DataGridColumnHeader title="File Name" column={column} />
        ),
        cell: ({ row }) => {
          const fileType = row.original.file_type;
          const isPreviewable = ["image", "video", "audio"].includes(fileType);

          return (
            <div
              className={`font-medium whitespace-nowrap truncate ${
                isPreviewable
                  ? "cursor-pointer hover:text-primary hover:underline"
                  : ""
              }`}
              title={row.getValue("file_name")}
              onClick={() => {
                if (isPreviewable) {
                  const event = new CustomEvent("openFilePreview", {
                    detail: row.original,
                  });
                  window.dispatchEvent(event);
                }
              }}
            >
              {row.getValue("file_name")}
            </div>
          );
        },
        size: 300,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "file_type",
        id: "file_type",
        header: ({ column }) => (
          <DataGridColumnHeader title="Type" column={column} />
        ),
        cell: ({ row }) => {
          const fileType = row.getValue("file_type") as string;
          return (
            <Badge
              variant="outline"
              className="gap-1.5 capitalize whitespace-nowrap"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  getFileTypeColor(fileType)
                )}
                aria-hidden="true"
              />
              {fileType}
            </Badge>
          );
        },
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "file_size",
        id: "file_size",
        header: ({ column }) => (
          <DataGridColumnHeader title="Size" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {formatFileSize(row.getValue("file_size"))}
          </div>
        ),
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "created_at",
        id: "created_at",
        header: ({ column }) => (
          <DataGridColumnHeader title="Created" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {formatDate(row.getValue("created_at"))}
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "updated_at",
        id: "updated_at",
        header: ({ column }) => (
          <DataGridColumnHeader title="Modified" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {formatDate(row.getValue("updated_at"))}
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <RowActions row={row} />,
        size: 80,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    []
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: Item) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFileTypes([]);
  };

  const hasActiveFilters = searchQuery !== "" || selectedFileTypes.length > 0;

  // Loading state
  if (loading) {
    return (
      <Card className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    );
  }

  // Empty state
  if (!filteredData || filteredData.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <FileIcon className="w-12 h-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {hasActiveFilters ? "No files found" : "No files available"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your filters to find what you're looking for."
                : "No files have been uploaded yet."}
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <XIcon className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        {/* DataTable Filters */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <ListFilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <CircleXIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* File Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">File Type</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-between"
                  >
                    <span>
                      {selectedFileTypes.length === 0
                        ? "All Types"
                        : `${selectedFileTypes.length} selected`}
                    </span>
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Filter by Type
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {uniqueFileTypes.map((fileType) => (
                        <div
                          key={fileType}
                          className="flex items-center gap-2.5"
                        >
                          <Checkbox
                            id={fileType}
                            checked={selectedFileTypes.includes(fileType)}
                            onCheckedChange={(checked) =>
                              handleFileTypeChange(checked === true, fileType)
                            }
                          />
                          <Label
                            htmlFor={fileType}
                            className="flex grow items-center justify-between gap-2 font-normal cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "size-2 rounded-full",
                                  getFileTypeColor(fileType)
                                )}
                              />
                              {fileType}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {fileTypeCounts[fileType]}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            {/* Column Visibility */}
            <div className="space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-[200px] justify-between"
                  >
                    Toggle Columns
                    <Columns3Icon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        onSelect={(e) => e.preventDefault()}
                        className="capitalize"
                      >
                        {column.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Delete Selected */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="min-w-[180px]"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete ({table.getSelectedRowModel().rows.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete selected files?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "file"
                        : "files"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRows}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {filteredData.length} of {displayData.length} files
              </Badge>

              {selectedFileTypes.length > 0 && (
                <Badge variant="outline">
                  Types:{" "}
                  {selectedFileTypes
                    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                    .join(", ")}
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <XIcon className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Data Grid */}
        <DataGrid
          table={table}
          recordCount={filteredData?.length || 0}
          tableLayout={{
            columnsMovable: true,
          }}
        >
          <div className="w-full space-y-2.5">
            <DataGridContainer>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
            <DataGridPagination />
          </div>
        </DataGrid>
      </Card>

      {/* File Preview Modal */}
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="text-lg font-semibold line-clamp-2">
                {previewFile?.file_name}
              </AlertDialogTitle>
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </AlertDialogHeader>
          <ScrollArea className="mt-4 max-h-[60vh]">
            {previewFile?.file_type === "image" && (
              <img
                src={previewFile.file_url}
                alt={previewFile.file_name}
                className="w-full h-auto rounded-lg"
              />
            )}
            {previewFile?.file_type === "video" && (
              <video
                src={previewFile.file_url}
                controls
                className="w-full h-auto rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            )}
            {previewFile?.file_type === "audio" && (
              <div className="flex flex-col items-center justify-center p-8">
                <audio
                  src={previewFile.file_url}
                  controls
                  className="w-full max-w-md"
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            )}
          </ScrollArea>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
