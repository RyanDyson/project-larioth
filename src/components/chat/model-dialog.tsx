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

const MOCK_MODELS: Model[] = [
  {
    id: "qwen3.5-9b",
    name: "Qwen3.5 9B",
    quantization: "Q4_K_M",
    publisher: "qwen",
    params: "9B",
    tag: "qwen35",
    format: "GGUF",
    size: "6.10 GB",
  },
  {
    id: "llama3.1-8b",
    name: "Llama 3.1 8B",
    quantization: "Q5_K_M",
    publisher: "meta",
    params: "8B",
    tag: "llama3",
    format: "GGUF",
    size: "5.73 GB",
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    quantization: "Q4_K_S",
    publisher: "mistral",
    params: "7B",
    tag: "mistral",
    format: "GGUF",
    size: "4.37 GB",
  },
  {
    id: "phi3-mini-4b",
    name: "Phi-3 Mini 4B",
    quantization: "Q8_0",
    publisher: "microsoft",
    params: "4B",
    tag: "phi3",
    format: "GGUF",
    size: "4.06 GB",
  },
];

export function ModelDialog({
  open,
  onOpenChangeAction,
  onSelectAction,
}: ModelDialogProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recency");
  const [manualLoad, setManualLoad] = useState(false);

  const models = MOCK_MODELS.filter((model) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      model.name.toLowerCase().includes(q) ||
      model.publisher.toLowerCase().includes(q) ||
      model.tag.toLowerCase().includes(q)
    );
  });

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
        <div className="max-h-105 overflow-y-auto">
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelectAction?.(model)}
              className="border-border hover:bg-muted/50 grid w-full grid-cols-[minmax(0,1.6fr)_auto_auto_auto_auto_auto_auto_auto] items-center gap-2 border-b px-4 py-3 text-left"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{model.name}</p>
                <Badge variant="outline" className="mt-1 font-mono text-[10px]">
                  {model.quantization}
                </Badge>
              </div>

              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <EyeIcon className="size-3" />
                <LightningIcon className="size-3" />
                <TreeStructureIcon className="size-3" />
              </div>

              <span className="text-muted-foreground text-xs">
                {model.params}
              </span>

              <Badge variant="secondary" className="font-mono text-[10px]">
                {model.tag}
              </Badge>

              <Badge className="border-yellow-500/30 bg-yellow-500/15 font-mono text-[10px] text-yellow-500">
                {model.format}
              </Badge>

              <span className="text-muted-foreground text-right text-xs">
                {model.size}
              </span>
            </button>
          ))}

          {models.length === 0 && (
            <div className="text-muted-foreground px-4 py-8 text-center text-xs">
              No models match your search.
            </div>
          )}
        </div>

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
