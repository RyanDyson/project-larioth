"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
  activeIndex?: number;
  activeRowKey?: string | null;
  getRowKey?: (row: TData) => string | undefined | null;
  onRowActivate?: (index: number) => void;
}

const SKELETON_ROW_COUNT = 5;

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  className,
  activeIndex,
  activeRowKey,
  getRowKey,
  onRowActivate,
}: DataTableProps<TData, TValue>) {
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const lastActiveRowKeyRef = useRef<string | null | undefined>(activeRowKey);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const resolvedActiveIndex = useMemo(() => {
    if (!rows.length) return undefined;

    if (activeRowKey && getRowKey) {
      const index = rows.findIndex(
        (row) => getRowKey(row.original) === activeRowKey,
      );
      if (index >= 0) return index;
    }

    if (activeIndex != null) {
      return Math.min(Math.max(activeIndex, 0), rows.length - 1);
    }

    return undefined;
  }, [activeIndex, activeRowKey, getRowKey, rows]);

  useEffect(() => {
    if (resolvedActiveIndex != null) {
      rowRefs.current[resolvedActiveIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [resolvedActiveIndex]);

  useEffect(() => {
    if (!activeRowKey || !getRowKey) return;

    if (lastActiveRowKeyRef.current === activeRowKey) return;
    lastActiveRowKeyRef.current = activeRowKey;

    const index = rows.findIndex(
      (row) => getRowKey(row.original) === activeRowKey,
    );
    if (index >= 0) {
      onRowActivate?.(index);
    }
  }, [activeRowKey, getRowKey, onRowActivate, rows]);

  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="pointer-events-none" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((_, colIndex) => (
                  <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length ? (
            rows.map((row, index) => {
              const isActive = index === resolvedActiveIndex;

              return (
                <TableRow
                  key={row.id}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  data-state={row.getIsSelected() && "selected"}
                  data-active={isActive ? "true" : undefined}
                  className={cn("cursor-pointer", isActive && "bg-accent/20")}
                  onClick={() => onRowActivate?.(index)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
