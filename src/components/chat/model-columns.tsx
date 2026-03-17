import type { ColumnDef } from "@tanstack/react-table";

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
};

const formatBytes = (value?: number) => {
  if (value == null || Number.isNaN(value)) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }

  const decimals = size >= 10 ? 1 : 2;
  return `${size.toFixed(decimals)} ${units[unit]}`;
};

const formatContext = (value?: number) => {
  if (value == null || Number.isNaN(value)) return "-";
  return `${value.toLocaleString()} tokens`;
};

const formatCapability = (value?: boolean) => (value ? "Yes" : "No");

export const modelColumns: ColumnDef<ModelRow>[] = [
  {
    accessorKey: "displayName",
    header: "Model",
    cell: ({ row }) => row.original.displayName ?? "-",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.original.type ?? "-",
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
  {
    accessorKey: "architecture",
    header: "Architecture",
    cell: ({ row }) => row.original.architecture ?? "-",
  },
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
  {
    accessorKey: "vision",
    header: "Vision",
    cell: ({ row }) => formatCapability(row.original.vision),
  },
  {
    accessorKey: "trainedForToolUse",
    header: "Tool Use",
    cell: ({ row }) => formatCapability(row.original.trainedForToolUse),
  },
  {
    accessorKey: "modelKey",
    header: "Model Key",
    cell: ({ row }) => row.original.modelKey ?? "-",
  },
  {
    accessorKey: "path",
    header: "Path",
    cell: ({ row }) => row.original.path ?? "-",
  },
];
