"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronUp,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditBandDialog } from "@/components/ui/edit-band-dialog";
import { Label } from "@/components/ui/label";
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
import { Band } from "@/types";
import { deleteBand } from "@/supabase/manage-band-data";
import { useEffect } from "react";
import { formatShowDate, formatShowTime } from "@/utils/format-date-helper";

export function DataTable({
  data: initialData,
  searchQuery = "",
  onBandUpdated,
}: {
  data: z.infer<typeof Band>[];
  searchQuery?: string;
  onBandUpdated?: () => void;
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [editingBand, setEditingBand] = React.useState<z.infer<
    typeof Band
  > | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [bandToDelete, setBandToDelete] = React.useState<z.infer<
    typeof Band
  > | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEditClick = (band: z.infer<typeof Band>) => {
    setEditingBand(band);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (band: z.infer<typeof Band>) => {
    setBandToDelete(band);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bandToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBand(bandToDelete.id);
      setIsDeleteDialogOpen(false);
      setBandToDelete(null);
      onBandUpdated?.();
    } catch (error) {
      console.error("Error deleting band:", error);
      alert("Failed to delete band. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Update column filters when search query changes
  useEffect(() => {
    if (searchQuery) {
      setColumnFilters([
        {
          id: "name",
          value: searchQuery,
        },
      ]);
    } else {
      setColumnFilters([]);
    }
  }, [searchQuery]);

  const columns: ColumnDef<z.infer<typeof Band>>[] = [
    {
      id: "edit",
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:cursor-pointer"
          onClick={() => handleEditClick(row.original)}
        >
          <IconPencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Band Name
          {column.getIsSorted() === "asc" ? (
            <IconChevronUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <IconChevronDown className="h-3.5 w-3.5" />
          ) : null}
        </button>
      ),
      cell: ({ row }) => row.original.name,
      filterFn: (row, id, value) => {
        return row.original.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "show_date",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Show Date
          {column.getIsSorted() === "asc" ? (
            <IconChevronUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <IconChevronDown className="h-3.5 w-3.5" />
          ) : null}
        </button>
      ),
      cell: ({ row }) => {
        return formatShowDate(row.original.show_date);
      },
    },
    {
      accessorKey: "show_time",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Show Time
          {column.getIsSorted() === "asc" ? (
            <IconChevronUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <IconChevronDown className="h-3.5 w-3.5" />
          ) : null}
        </button>
      ),
      cell: ({ row }) => formatShowTime(row.original.show_time),
    },
    {
      accessorKey: "stage",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stage
          {column.getIsSorted() === "asc" ? (
            <IconChevronUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <IconChevronDown className="h-3.5 w-3.5" />
          ) : null}
        </button>
      ),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`text-muted-foreground px-1.5 ${
            row.original.stage === "lawn"
              ? "bg-neutral-950"
              : row.original.stage === "upstairs"
                ? "bg-stone-900"
                : "bg-slate-950"
          }`}
        >
          {row.original.stage.charAt(0).toUpperCase() +
            row.original.stage.slice(1)}
        </Badge>
      ),
    },
    {
      id: "delete",
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:cursor-pointer"
          onClick={() => handleDeleteClick(row.original)}
        >
          <IconTrash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: initialData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-[#12121a] sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="flex w-full items-center gap-8 lg:w-fit lg:ml-auto">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
      {editingBand && (
        <EditBandDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          band={editingBand}
          onBandUpdated={onBandUpdated}
        />
      )}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Band</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{bandToDelete?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setBandToDelete(null);
                }}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="hover:cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
