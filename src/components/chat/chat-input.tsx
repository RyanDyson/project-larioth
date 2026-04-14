"use client";

import { useChat } from "@/hooks/use-chat";
import { api } from "@/trpc/react";
import { getModelIcon } from "@/lib/icons";
import { mapResponseToRow } from "./model-columns";
import { ModelDialog } from "./model-dialog";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import {
  CircleNotchIcon,
  TrashIcon,
  PaperPlaneTiltIcon,
  EyeIcon,
  PaperclipIcon,
  ToolboxIcon,
  GearIcon,
  XIcon,
  FileTextIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CircularProgressbar } from "react-circular-progressbar";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

type AttachedFile = {
  id: string;
  file: File;
  previewUrl: string | null;
};

function getPreviewForFile(file: File) {
  if (file.type.startsWith("image/")) {
    return URL.createObjectURL(file);
  }
  return null;
}

function isDropFileEvent(event: React.DragEvent) {
  return Array.from(event.dataTransfer.types).includes("Files");
}

function getFileIcon() {
  return <FileTextIcon className="size-4" />;
}

export function ChatInput({ uuid }: { uuid: string }) {
  const { input, setInput, sendMessage, isSendingMessage, model, setModel } =
    useChat(uuid);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [openModelDialog, setOpenModelDialog] = useState<boolean>(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const dragCounterRef = useRef(0);

  const { data: models } = api.model.listYourModels.useQuery();

  const rows = mapResponseToRow(models?.models ?? []).filter(
    (row) => row.isLoaded,
  );

  const handleFilesSelected = (files: FileList | File[]) => {
    if (!files.length) return;

    const nextFiles: AttachedFile[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID?.() ?? Math.random()}`,
      file,
      previewUrl: getPreviewForFile(file),
    }));

    setAttachedFiles((current) => [...current, ...nextFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const clearAttachments = () => {
    setAttachedFiles((current) => {
      current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      return [];
    });
  };

  const handleSend = () => {
    sendMessage();
    clearAttachments();
  };

  useEffect(() => {
    return () => {
      attachedFiles.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [attachedFiles]);

  const showDropOverlay = isDraggingFiles;

  return (
    <>
      <ModelDialog
        open={openModelDialog}
        onOpenChangeAction={setOpenModelDialog}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files ?? [])}
      />

      <motion.div
        ref={dropZoneRef}
        layout
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onDragEnter={(e) => {
          if (!isDropFileEvent(e)) return;
          e.preventDefault();
          e.stopPropagation();
          dragCounterRef.current += 1;
          setIsDraggingFiles(true);
        }}
        onDragOver={(e) => {
          if (!isDropFileEvent(e)) return;
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "copy";
          if (!isDraggingFiles) setIsDraggingFiles(true);
        }}
        onDragLeave={(e) => {
          if (!isDropFileEvent(e)) return;
          e.preventDefault();
          e.stopPropagation();
          dragCounterRef.current = Math.max(dragCounterRef.current - 1, 0);
          if (dragCounterRef.current === 0) {
            requestAnimationFrame(() => setIsDraggingFiles(false));
          }
        }}
        onDrop={(e) => {
          if (!isDropFileEvent(e)) return;
          e.preventDefault();
          e.stopPropagation();
          dragCounterRef.current = 0;
          setIsDraggingFiles(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
        onDragEnd={() => {
          dragCounterRef.current = 0;
          setIsDraggingFiles(false);
        }}
        className={cn(
          "from-card/70 to-card/80 border-border absolute right-0 bottom-0 left-0 z-30 mx-auto flex h-fit w-full max-w-xl grow flex-col rounded-t-xl border border-b-0 bg-linear-to-b p-4 backdrop-blur-md transition-all duration-300",
        )}
      >
        <AnimatePresence initial={false}>
          {attachedFiles.length > 0 ? (
            <motion.div
              key="attachments"
              layout
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {attachedFiles.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="border-border bg-background/70 relative h-12 w-12 overflow-hidden rounded-xl border will-change-transform"
                  >
                    {item.previewUrl ? (
                      <Image
                        src={item.previewUrl}
                        alt={item.file.name}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {getFileIcon()}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(item.id)}
                      className="bg-background/80 text-foreground hover:text-destructive absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full shadow-sm backdrop-blur transition-transform duration-200 hover:scale-110"
                    >
                      <XIcon className="size-2.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {!showDropOverlay ? (
            <motion.div
              key="textarea"
              initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Textarea
                placeholder="Type your message here..."
                onFocus={(e) => {
                  e.target.placeholder = "Type your message...";
                }}
                onBlur={(e) => {
                  e.target.placeholder = "Type your message here...";
                }}
                value={input}
                ref={inputRef}
                rows={1}
                disabled={isSendingMessage}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.target === inputRef.current &&
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="field-sizing-content max-h-64 min-h-8 resize-none overflow-auto overflow-y-auto border-none py-2.5 leading-relaxed shadow-none outline-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent dark:bg-none"
              />
            </motion.div>
          ) : (
            <motion.div
              key="drop-zone-placeholder"
              initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="border-border text-muted-foreground flex min-h-20 items-center justify-center rounded-lg border border-dashed px-4 py-5 text-sm"
            >
              Drop files here to attach
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="group h-8 rounded-full px-3 text-xs font-normal transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
              >
                <CaretDownIcon className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                {model ? (
                  <div className="flex items-center gap-1">
                    {getModelIcon(model.key)}
                    {model.display_name}
                  </div>
                ) : (
                  "Select Model"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex min-w-fit flex-col">
              <div className="flex w-full items-center justify-between px-2 py-1">
                <span className="text-muted-foreground font-mono text-xs font-medium tracking-wide">
                  Models
                </span>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setOpenModelDialog(true)}
                  className="text-muted-foreground hover:text-foreground transition-transform duration-200 hover:scale-105"
                >
                  <GearIcon className="size-3.5" />
                </Button>
              </div>
              <DropdownMenuSeparator />
              <div className="p-1">
                {rows.length > 0 ? (
                  rows.map((row) => {
                    const Icon = getModelIcon(row.details?.modelKey ?? "");
                    const isSelected = model?.key === row.details?.modelKey;
                    return (
                      <DropdownMenuItem
                        key={row.instanceId ?? row.details?.modelKey}
                        className={cn(
                          "flex w-full min-w-64 items-center justify-between gap-1 transition-colors duration-150",
                          isSelected &&
                            "bg-emerald-500/20 focus:bg-emerald-500/30",
                        )}
                        onClick={() => {
                          const selectedModel = models?.models.find(
                            (m) => m.key === row.details?.modelKey,
                          );
                          if (selectedModel) {
                            setModel(selectedModel);
                          }
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {Icon && (
                            <span className="text-muted-foreground flex size-4 shrink-0 items-center justify-center transition-transform duration-200">
                              {Icon}
                            </span>
                          )}
                          {row.displayName}
                        </span>
                        <div className="flex items-center gap-1">
                          {row.details?.vision && (
                            <Badge variant="blue">
                              <EyeIcon className="size-3.5" />
                            </Badge>
                          )}
                          {row.details?.trainedForToolUse && (
                            <Badge variant="violet">
                              <ToolboxIcon className="size-3.5" />
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground min-w-fit p-4 text-xs text-nowrap whitespace-nowrap">
                    Load models into LMStudio to start.
                  </span>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-full px-3 text-xs font-normal transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSendingMessage}
          >
            <PaperclipIcon className="size-3.5 transition-transform duration-200" />
            Attach
          </Button>

          <Tooltip>
            <TooltipTrigger className="ml-1 size-4">
              <CircularProgressbar value={32} strokeWidth={12} />
            </TooltipTrigger>
            <TooltipContent>Context 200/300M</TooltipContent>
          </Tooltip>

          <div className="flex-1" />

          <Button
            size="icon"
            variant="gradientDestructive"
            disabled={isSendingMessage || input.trim() === ""}
            className="rounded-full"
            onClick={() => {
              setInput("");
            }}
          >
            <TrashIcon className="size-3.5" />
          </Button>

          <Button
            size="icon"
            onClick={handleSend}
            disabled={isSendingMessage || input.trim() === "" || !model}
            className="border-primary/30 hover:bg-primary/30 from-primary/10 to-primary/20 size-8 shrink-0 cursor-pointer rounded-full border bg-transparent bg-linear-to-b transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {isSendingMessage ? (
              <CircleNotchIcon className="text-primary size-4 animate-spin" />
            ) : (
              <PaperPlaneTiltIcon className="size-4 transition-transform duration-200" />
            )}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
