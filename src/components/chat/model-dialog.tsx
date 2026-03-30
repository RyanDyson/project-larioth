"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowElbowDownLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { DataTable } from "../global/data-table";
import { modelColumns, mapResponseToRow, type ModelRow } from "./model-columns";
import { KeyboardIcon } from "../global/keyboard-icon";
import { Switch } from "../ui/switch";

type ModelDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSelectAction?: (model: ModelRow) => void;
};

export function ModelDialog({
  open,
  onOpenChangeAction,
  onSelectAction,
}: ModelDialogProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeRowKey, setActiveRowKey] = useState<string | null>(null);
  const [rows, setRows] = useState<ModelRow[]>([]);

  // const {
  //   handleLoadUnload,
  //   loadingModel,
  //   loadingAction,
  //   progress,
  //   localLoadedState,
  // } = useLoadUnload();

  const { data: models, isLoading: isLoadingModels } =
    api.model.listYourModels.useQuery();

  useEffect(() => {
    if (models && !isLoadingModels) {
      setRows(mapResponseToRow(models.models));
    }
  }, [models, isLoadingModels]);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const lowerQuery = query.toLowerCase();
    return rows.filter(
      (row) =>
        row.displayName?.toLowerCase().includes(lowerQuery) ||
        row.details?.modelKey?.toLowerCase().includes(lowerQuery),
    );
  }, [rows, query]);

  useEffect(() => {
    setActiveIndex((current) =>
      filteredRows.length === 0
        ? 0
        : Math.min(current, filteredRows.length - 1),
    );
  }, [filteredRows.length, query]);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      setActiveRowKey(null);
    }
  }, [open]);

  // Keep stable refs so the keyboard handler closure never goes stale
  const filteredRowsRef = useRef(filteredRows);
  filteredRowsRef.current = filteredRows;
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  // const handleLoadUnloadRef = useRef(handleLoadUnload);
  // handleLoadUnloadRef.current = handleLoadUnload;
  // const localLoadedStateRef = useRef(localLoadedState);
  // localLoadedStateRef.current = localLoadedState;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) =>
          Math.min(i + 1, filteredRowsRef.current.length - 1),
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const activeRow = filteredRowsRef.current[activeIndexRef.current];
        if (!activeRow?.details?.modelKey) return;
      }
    },
    [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-160 w-fit min-w-xl flex-col gap-0 overflow-hidden p-0"
      >
        {/* header */}
        <div className="border-border flex w-full items-center justify-between gap-2 border-b px-2 py-2">
          <span className="font-mono text-sm font-medium">Models</span>
          <div className="flex items-center gap-2">
            <Switch />
            Advance Settings
          </div>
        </div>

        {/* search */}
        <div className="border-border relative flex items-center gap-2 border-b px-2 py-2">
          <MagnifyingGlassIcon className="text-muted-foreground absolute right-4 size-4" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to filter models..."
          />
        </div>

        {/* table */}
        <DataTable
          columns={modelColumns}
          data={filteredRows}
          isLoading={isLoadingModels}
          className="rounded-none border-none"
          activeIndex={activeIndex}
          activeRowKey={activeRowKey}
          getRowKey={(row) => row.details?.modelKey}
          onRowActivate={(index) => {
            setActiveIndex(index);
            setActiveRowKey(filteredRows[index]?.details?.modelKey ?? null);
          }}
        />

        {/* footer - kbd shortcuts */}
        <div className="text-muted-foreground border-t p-2 text-[11px]">
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

        {/* loading progress */}
        {/*<motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: loadingModel ? "auto" : 0,
            opacity: loadingModel ? 1 : 0,
            marginTop: loadingModel ? undefined : 0,
            padding: loadingModel ? undefined : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border-border flex flex-col gap-2 overflow-hidden border-t"
        >
          <div className="p-2">
            <Progress value={progress} className="h-1.5" />
            <div className="flex items-center justify-center gap-x-2 pt-2">
              <span className="text-muted-foreground text-xs">
                {loadingAction === "load" ? "Loading" : "Ejecting"}{" "}
                <span className="text-foreground font-medium">
                  {filteredRows.find(
                    (r) => r.details?.modelKey === loadingModel,
                  )?.displayName ?? loadingModel}
                </span>
              </span>
            </div>
          </div>
        </motion.div>*/}
      </DialogContent>
    </Dialog>
  );
}
