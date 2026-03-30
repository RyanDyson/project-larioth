"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatBytes, formatContext } from "@/lib/formatters";
import { InfoIcon } from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ModelDetailsTable } from "./model-details-table";
import type { Model } from "@/server/api/routers/model";
import type { LoadAction } from "@/hooks/use-load-unload";

import { LoadUnloadButton } from "./load-unload-button";
import { getModelIcon } from "@/lib/icons";

export type ModelRow = {
  type?: string;
  displayName?: string;
  sizeBytes?: number;
  maxContextLength?: number;
  isLoaded?: boolean;
  instanceId?: string;
  details?: DetailsRow;
  loadingAction?: LoadAction;
};

export type DetailsRow = {
  modelKey?: string;
  format?: string;
  vision?: boolean;
  paramsString?: string;
  architecture?: string;
  trainedForToolUse?: boolean;
  path?: string;
};

export function mapResponseToRow(res: Model[]): ModelRow[] {
  return res.map((m) => ({
    type: m.type,
    displayName: m.display_name,
    sizeBytes: m.size_bytes,
    maxContextLength: m.max_context_length,
    isLoaded: (m.loaded_instances?.length ?? 0) > 0,
    instanceId: m.loaded_instances?.[0]?.id,
    details: {
      modelKey: m.key,
      format: m.format ?? undefined,
      vision: m.capabilities?.vision,
      paramsString: m.params_string,
      architecture: m.architecture,
      trainedForToolUse: m.capabilities?.trained_for_tool_use,
    },
  }));
}

export const modelColumns: ColumnDef<ModelRow>[] = [
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <LoadUnloadButton
        model={row?.original.details?.modelKey ?? ""}
        instanceId={row?.original?.instanceId ?? ""}
        isLoaded={row?.original?.isLoaded}
      />
    ),
  },
  {
    accessorKey: "displayName",
    header: "Model",
    cell: ({ row }) => {
      const Icon = getModelIcon(row.original.details?.modelKey ?? "");
      return (
        <Popover>
          <PopoverTrigger>
            <span className="flex cursor-pointer items-center gap-1">
              {row.original.displayName ?? "-"}{" "}
              {Icon && (
                <span className="text-muted-foreground ml-1 flex size-4 shrink-0 items-center justify-center">
                  {Icon}
                </span>
              )}
              <InfoIcon className="text-muted-foreground ml-1 h-4 w-4" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <ModelDetailsTable details={row.original.details ?? {}} />
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.original.type ?? "-",
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
];
