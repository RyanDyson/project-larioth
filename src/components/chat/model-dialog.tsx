"use client";

import { useState } from "react";
import {
  EyeIcon,
  LightningIcon,
  TreeStructureIcon,
  HardDrivesIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { DataTable } from "../global/data-table";

type Model = {
  id: string;
  name: string;
  quantization: string;
  publisher: string;
  params: string;
  tag: string;
  format: string;
  size: string;
};

type SortKey = "recency" | "size" | "downloaded";

type ModelDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSelectAction?: (model: Model) => void;
};

export function ModelDialog({
  open,
  onOpenChangeAction,
  onSelectAction,
}: ModelDialogProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recency");
  const [manualLoad, setManualLoad] = useState(false);

  const { data: models, isPending } = api.model.listDownloadedModels.useQuery();
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-160 w-full flex-col gap-0 overflow-hidden p-0"
      >
        {/* Search bar */}
        <div className="border-border flex items-center gap-2 border-b px-4 py-3">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter models..."
            className="h-8 flex-1 border-none bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onOpenChangeAction(false)}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Toolbar */}
        <div className="border-border flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Your Models</span>
            <Select defaultValue="all">
              <SelectTrigger size="sm" className="h-6 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="downloaded">Downloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            {(["recency", "size", "downloaded"] as SortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-xs capitalize transition-colors",
                  sort === key
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {key === "recency" && sort === "recency"
                  ? "Recency ↓"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Model list */}

        {/* Footer */}
        <div className="border-border flex items-center gap-3 border-t px-4 py-3">
          <button
            type="button"
            role="switch"
            aria-checked={manualLoad}
            onClick={() => setManualLoad((v) => !v)}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none",
              manualLoad ? "bg-primary" : "bg-muted-foreground/30",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
                manualLoad ? "translate-x-4" : "translate-x-0",
              )}
            />
          </button>
          <span className="text-muted-foreground text-xs">
            Manually choose model load parameters{" "}
            <kbd className="bg-muted text-foreground rounded border px-1.5 py-0.5 font-mono text-[10px]">
              ⌥ option
            </kbd>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
