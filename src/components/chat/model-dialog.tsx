"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowElbowDownLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { modelColumns, type ModelRow } from "./model-columns";
import { KeyboardIcon } from "../global/keyboard-icon";

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

const mockModels: ModelRow[] = [
  {
    type: "llm",
    modelKey: "qwen2.5-7b-instruct",
    format: "gguf",
    displayName: "Qwen2.5 7B Instruct",
    path: "/Users/ryandarmawan/.cache/lm-studio/models/qwen/qwen2.5-7b-instruct.gguf",
    sizeBytes: 4_520_345_600,
    paramsString: "7B",
    architecture: "Qwen2",
    vision: false,
    trainedForToolUse: true,
    maxContextLength: 32768,
    isLoaded: true,
  },
  {
    type: "llm",
    modelKey: "llama-3.1-8b-instruct",
    format: "gguf",
    displayName: "Llama 3.1 8B Instruct",
    path: "/Users/ryandarmawan/.cache/lm-studio/models/meta-llama/llama-3.1-8b-instruct.gguf",
    sizeBytes: 4_920_123_392,
    paramsString: "8B",
    architecture: "Llama",
    vision: false,
    trainedForToolUse: true,
    maxContextLength: 131072,
    isLoaded: false,
  },
  {
    type: "vlm",
    modelKey: "qwen2-vl-7b-instruct",
    format: "gguf",
    displayName: "Qwen2 VL 7B Instruct",
    path: "/Users/ryandarmawan/.cache/lm-studio/models/qwen/qwen2-vl-7b-instruct.gguf",
    sizeBytes: 5_684_341_760,
    paramsString: "7B",
    architecture: "Qwen2-VL",
    vision: true,
    trainedForToolUse: true,
    maxContextLength: 32768,
    isLoaded: false,
  },
  {
    type: "embedding",
    modelKey: "nomic-embed-text-v1.5",
    format: "gguf",
    displayName: "Nomic Embed Text v1.5",
    path: "/Users/ryandarmawan/.cache/lm-studio/models/nomic/nomic-embed-text-v1.5.gguf",
    sizeBytes: 274_726_912,
    paramsString: "137M",
    architecture: "BERT",
    vision: false,
    trainedForToolUse: false,
    maxContextLength: 8192,
    isLoaded: true,
  },
  {
    type: "llm",
    modelKey: "deepseek-r1-distill-qwen-14b",
    format: "gguf",
    displayName: "DeepSeek R1 Distill Qwen 14B",
    path: "/Users/ryandarmawan/.cache/lm-studio/models/deepseek/deepseek-r1-distill-qwen-14b.gguf",
    sizeBytes: 9_663_676_416,
    paramsString: "14B",
    architecture: "Qwen2",
    vision: false,
    trainedForToolUse: true,
    maxContextLength: 65536,
    isLoaded: false,
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [localLoadedState, setLocalLoadedState] = useState<
    Record<string, boolean>
  >({});

  const { data: models, isPending } = api.model.listDownloadedModels.useQuery();
  const loadModel = api.model.loadModel.useMutation() as {
    mutate: (input: { modelKey: string }) => void;
  };
  const ejectModel = api.model.ejectModel.useMutation() as {
    mutate: (input: { modelKey: string }) => void;
  };

  // Merge server data with optimistic local loaded-state overrides.
  // Cast API response to ModelRow[] — the SDK shape is compatible with our type.
  const rows = useMemo<ModelRow[]>(
    () =>
      ((models as ModelRow[] | undefined) ?? mockModels).map((m) => ({
        ...m,
        isLoaded:
          m.modelKey && m.modelKey in localLoadedState
            ? localLoadedState[m.modelKey]
            : m.isLoaded,
      })),
    [models, localLoadedState],
  );

  // Reset cursor when dialog opens
  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const activeRow = rows[activeIndex];
        if (!activeRow?.modelKey) return;
        const key = activeRow.modelKey;
        if (activeRow.isLoaded) {
          ejectModel.mutate({ modelKey: key });
          setLocalLoadedState((prev) => ({ ...prev, [key]: false }));
        } else {
          loadModel.mutate({ modelKey: key });
          setLocalLoadedState((prev) => ({ ...prev, [key]: true }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, rows, activeIndex, loadModel, ejectModel]);

  return (
    <Dialog open={true} onOpenChange={onOpenChangeAction}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-160 w-full flex-col gap-0 overflow-hidden p-0"
      >
        {/* Search bar */}
        <div className="border-border relative flex items-center gap-2 border-b px-2 py-2">
          <MagnifyingGlassIcon className="text-muted-foreground absolute right-4 size-4" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter models..."
          />
        </div>

        {/* Toolbar */}
        {/*<div className="border-border flex items-center justify-between border-b px-2 py-2"></div>*/}

        {/* Model list */}
        <DataTable
          columns={modelColumns}
          data={rows}
          // isLoading={isPending}
          className="rounded-none border-none"
          activeIndex={activeIndex}
          onRowActivate={setActiveIndex}
        />

        <div className="text-muted-foreground border-t px-3 py-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <KeyboardIcon text={<ArrowDownIcon />} />
              <KeyboardIcon text={<ArrowUpIcon />} /> to navigate
            </span>
            <span className="flex items-center gap-1">
              Press
              <KeyboardIcon text={<ArrowElbowDownLeftIcon />} /> to eject/load
              model
            </span>
          </div>
        </div>

        {/* Footer - on click load or eject, show progress bar */}
        {/*<div className="border-border flex items-center gap-3 border-t px-4 py-3">
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
        </div>*/}
      </DialogContent>
    </Dialog>
  );
}
