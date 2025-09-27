"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArchiveIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  CopyIcon,
  EditIcon,
  EllipsisIcon,
  FileIcon,
  FilterIcon,
  LinkIcon,
  ListFilterIcon,
  PlusIcon,
  Share2Icon,
  TrashIcon,
  Upload,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "../ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileResponse } from "@/types/files";
import SocialShare from "@/components/custom/social-share";
import moment from "moment";
import Link from "next/link";
import UploadDropdown from "./upload-dropdown";
import { toast } from "sonner";

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

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.file_name}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

// Custom filter function for file type filtering
const fileTypeFilterFn: FilterFn<Item> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const fileType = row.getValue(columnId) as string;
  return filterValue.includes(fileType);
};

// Column definitions
const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "File Name",
    accessorKey: "file_name",
    cell: ({ row }) => (
      <div
        className="font-medium max-w-[200px] truncate"
        title={row.getValue("file_name")}
      >
        {row.getValue("file_name")}
      </div>
    ),
    size: 200,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Type",
    accessorKey: "file_type",
    cell: ({ row }) => {
      const fileType = row.getValue("file_type") as string;
      return (
        <Badge
          variant="outline"
          className="gap-1.5 capitalize dark:border-input"
        >
          <span
            className={cn("size-1.5 rounded-full", getFileTypeColor(fileType))}
            aria-hidden="true"
          />
          {fileType}
        </Badge>
      );
    },
    size: 100,
    filterFn: fileTypeFilterFn,
  },
  {
    header: "Size",
    accessorKey: "file_size",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatFileSize(row.getValue("file_size"))}
      </div>
    ),
    size: 100,
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("created_at"))}
      </div>
    ),
    size: 150,
  },
  {
    header: "Modified",
    accessorKey: "updated_at",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("updated_at"))}
      </div>
    ),
    size: 150,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

// ====================================================
// The Main Table Component
// ====================================================
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
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "file_name",
      desc: false,
    },
  ]);

  // Handle delete rows
  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const fileIds = selectedRows.map((row) => row.original.id);

    if (onDeleteFiles) {
      onDeleteFiles(fileIds);
    }

    table.resetRowSelection();
  };

  // Initialize the table
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Get unique file type values
  const uniqueFileTypeValues = useMemo(() => {
    if (!data || data.length === 0) return [];

    const fileTypeColumn = table.getColumn("file_type");
    if (!fileTypeColumn) return [];

    const values = Array.from(fileTypeColumn.getFacetedUniqueValues().keys());
    return values.sort();
  }, [data, table]);

  // Get counts for each file type
  const fileTypeCounts = useMemo(() => {
    if (!data || data.length === 0) return new Map();

    const fileTypeColumn = table.getColumn("file_type");
    if (!fileTypeColumn) return new Map();
    return fileTypeColumn.getFacetedUniqueValues();
  }, [data, table]);

  // Get selected file types
  const selectedFileTypes = useMemo(() => {
    const filterValue = table
      .getColumn("file_type")
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [columnFilters]);

  // Handle file type filter change
  const handleFileTypeChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("file_type")
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("file_type")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Search files */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getColumn("file_name")?.getFilterValue()) &&
                  "pe-9"
              )}
              value={
                (table.getColumn("file_name")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("file_name")?.setFilterValue(e.target.value)
              }
              placeholder="Search files..."
              type="text"
              aria-label="Search files"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("file_name")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("file_name")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {/* Filter by file type */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                File Type
                {selectedFileTypes.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedFileTypes.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  File Types
                </div>
                <div className="space-y-3">
                  {uniqueFileTypeValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedFileTypes.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleFileTypeChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal capitalize"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              getFileTypeColor(value)
                            )}
                            aria-hidden="true"
                          />
                          {value}
                        </div>
                        <span className="text-muted-foreground ms-2 text-xs">
                          {fileTypeCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Upload file button */}
          {uploadlink ? (
            <Button asChild>
              <Link href={uploadlink || "/upload"}>
                <PlusIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                {buttonText || "Upload File"}
              </Link>
            </Button>
          ) : (
            <UploadDropdown
              component={
                <Button className="bg-primary" size="sm">
                  <Upload className="h-4 w-4" />
                  <span className="">Upload file</span>
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card overflow-hidden rounded-md border">
        <ScrollArea className="py-4">
          {loading ? (
            <div className="w-full px-4 py-8">
              {/* Table header skeleton */}
              <div className="flex mb-2">
                {[...Array(columns.length)].map((_, idx) => (
                  <Skeleton key={idx} className="h-6 flex-1 mx-1 bg-muted" />
                ))}
              </div>
              {/* Table rows skeleton */}
              {[...Array(6)].map((_, rowIdx) => (
                <div key={rowIdx} className="flex mb-2">
                  {[...Array(columns.length)].map((_, colIdx) => (
                    <Skeleton
                      key={colIdx}
                      className="h-6 flex-1 mx-1 bg-muted"
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <Table className="table-fixed">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{ width: `${header.getSize()}px` }}
                          className="h-11"
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <div
                              className={cn(
                                header.column.getCanSort() &&
                                  "flex h-full cursor-pointer items-center justify-between gap-2 select-none dark:text-primary"
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                              onKeyDown={(e) => {
                                // Enhanced keyboard handling for sorting
                                if (
                                  header.column.getCanSort() &&
                                  (e.key === "Enter" || e.key === " ")
                                ) {
                                  e.preventDefault();
                                  header.column.getToggleSortingHandler()?.(e);
                                }
                              }}
                              tabIndex={
                                header.column.getCanSort() ? 0 : undefined
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: (
                                  <ChevronUpIcon
                                    className="shrink-0 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                ),
                                desc: (
                                  <ChevronDownIcon
                                    className="shrink-0 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="last:py-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <span className="inline-flex flex-col items-center gap-2 text-sm text-muted-foreground">
                        <FileIcon className="size-8" />
                        <span>No results.</span>
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({ row }: { row: Row<Item> }) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const fileUrl = row.original.file_url;
    navigator.clipboard.writeText(fileUrl);
    setLinkCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="File actions"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <EditIcon
              size={16}
              className="opacity-60 hover:text-primary focus:text-primary"
              aria-hidden="true"
            />
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            {linkCopied ? (
              <CheckIcon
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <LinkIcon
                size={16}
                className="opacity-60 hover:text-primary focus:text-primary"
                aria-hidden="true"
              />
            )}
            <span>Copy link</span>
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Share2Icon
                  size={16}
                  className="opacity-60 hover:text-primary focus:text-primary"
                  aria-hidden="true"
                />
                <span>Share</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="sr-only">
                  Share file
                </AlertDialogTitle>
              </AlertDialogHeader>
              <SocialShare
                fileUrl={row.original.file_url}
              />
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-primary text-white">
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
              <TrashIcon size={16} aria-hidden="true" />
              <span>Delete</span>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
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
                  This action cannot be undone. This will permanently delete "
                  {row.original.file_name}" and remove it from our servers.
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
