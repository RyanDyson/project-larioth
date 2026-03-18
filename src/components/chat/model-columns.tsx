import type { ColumnDef } from "@tanstack/react-table";
import { formatBytes, formatContext, formatCapability } from "@/lib/formatters";
import { InfoIcon } from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";
import { DataTable } from "../global/data-table";

export type ModelRow = {
  type?: string;
  modelKey?: string;
  format?: string;
  displayName?: string;
  path?: string;
  sizeBytes?: number;
  paramsString?: string;
  architecture?: string;
  vision?: boolean;
  trainedForToolUse?: boolean;
  maxContextLength?: number;
  isLoaded?: boolean;
  details?: DetailsRow[];
};

type DetailsRow = Omit<
  ModelRow,
  | "displayName"
  | "type"
  | "sizeBytes"
  | "maxContextLength"
  | "trainedForToolUse"
>;

const modelDetailsColumns: ColumnDef<DetailsRow>[] = [
  {
    accessorKey: "architecture",
    header: "Architecture",
    cell: ({ row }) => row.original.architecture ?? "-",
  },
  {
    accessorKey: "format",
    header: "Format",
    cell: ({ row }) => row.original.format ?? "-",
  },
  {
    accessorKey: "paramsString",
    header: "Params",
    cell: ({ row }) => row.original.paramsString ?? "-",
  },
];

export const modelColumns: ColumnDef<ModelRow>[] = [
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        {row.original.isLoaded ? (
          <Button variant="destructive">Eject</Button>
        ) : (
          <Button variant="gradient">Load</Button>
        )}
      </div>
    ),
  },
  {
    accessorKey: "displayName",
    header: "Model",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger>
          <span className="flex cursor-pointer items-center gap-1">
            {row.original.displayName ?? "-"}{" "}
            <InfoIcon className="text-muted-foreground ml-1 h-4 w-4" />
          </span>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <DataTable
            columns={modelDetailsColumns}
            data={row.original.details ?? []}
          />
        </PopoverContent>
      </Popover>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.original.type ?? "-",
  },
  // {
  //   accessorKey: "format",
  //   header: "Format",
  //   cell: ({ row }) => row.original.format ?? "-",
  // },
  // {
  //   accessorKey: "paramsString",
  //   header: "Params",
  //   cell: ({ row }) => row.original.paramsString ?? "-",
  // },
  // {
  //   accessorKey: "architecture",
  //   header: "Architecture",
  //   cell: ({ row }) => row.original.architecture ?? "-",
  // },
  {
    accessorKey: "sizeBytes",
    header: "Size",
    cell: ({ row }) => formatBytes(row.original.sizeBytes),
  },
  {
    accessorKey: "maxContextLength",
    header: "Max Context",
    cell: ({ row }) => formatContext(row.original.maxContextLength),
  },
  // {
  //   accessorKey: "vision",
  //   header: "Vision",
  //   cell: ({ row }) => formatCapability(row.original.vision),
  // },
  {
    accessorKey: "trainedForToolUse",
    header: "Tool Use",
    cell: ({ row }) => formatCapability(row.original.trainedForToolUse),
  },
  // {
  //   accessorKey: "modelKey",
  //   header: "Model Key",
  //   cell: ({ row }) => row.original.modelKey ?? "-",
  // },
  // {
  //   accessorKey: "path",
  //   header: "Path",
  //   cell: ({ row }) => row.original.path ?? "-",
  // },
];
