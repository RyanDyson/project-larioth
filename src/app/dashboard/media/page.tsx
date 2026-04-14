"use client";

import * as React from "react";
import { AppSidebar } from "@/components/global/app-sidebar";
import { SiteHeader } from "@/components/global/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  FolderIcon,
  FilmStripIcon,
  MusicNoteIcon,
  ImageIcon,
  FileIcon,
  ListIcon,
  SquaresFourIcon,
  UploadSimpleIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
  DownloadSimpleIcon,
  ShareNetworkIcon,
  FolderPlusIcon,
  ArrowsOutSimpleIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

type FileType = "folder" | "video" | "music" | "image" | "file";
type MediaItem = {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  duration?: string;
  modifiedAt: string;
  thumbnail?: string;
  items?: number;
};

const rootItems: MediaItem[] = [
  {
    id: "f1",
    name: "Movies",
    type: "folder",
    modifiedAt: "2026-03-10",
    items: 12,
  },
  {
    id: "f2",
    name: "TV Shows",
    type: "folder",
    modifiedAt: "2026-03-09",
    items: 8,
  },
  {
    id: "f3",
    name: "Music",
    type: "folder",
    modifiedAt: "2026-03-08",
    items: 240,
  },
  {
    id: "f4",
    name: "Photos",
    type: "folder",
    modifiedAt: "2026-03-05",
    items: 1423,
  },
  {
    id: "v1",
    name: "The Dark Knight.mkv",
    type: "video",
    size: "14.2 GB",
    duration: "2h 32m",
    modifiedAt: "2026-02-20",
  },
  {
    id: "v2",
    name: "Inception.mkv",
    type: "video",
    size: "12.8 GB",
    duration: "2h 28m",
    modifiedAt: "2026-02-18",
  },
  {
    id: "v3",
    name: "Dune Part Two.mkv",
    type: "video",
    size: "18.4 GB",
    duration: "2h 46m",
    modifiedAt: "2026-03-01",
  },
  {
    id: "i1",
    name: "wallpaper_mountains.jpg",
    type: "image",
    size: "4.2 MB",
    modifiedAt: "2026-01-15",
  },
  {
    id: "i2",
    name: "vacation_2025.jpg",
    type: "image",
    size: "8.1 MB",
    modifiedAt: "2025-08-20",
  },
  {
    id: "a1",
    name: "Ambient Mix Vol.3.mp3",
    type: "music",
    size: "128 MB",
    duration: "1h 12m",
    modifiedAt: "2026-02-10",
  },
  {
    id: "x1",
    name: "reading_list.txt",
    type: "file",
    size: "2 KB",
    modifiedAt: "2026-03-11",
  },
];

const FILE_ICONS: Record<FileType, React.ReactNode> = {
  folder: <FolderIcon weight="fill" className="size-10 text-blue-400" />,
  video: <FilmStripIcon weight="fill" className="size-10 text-purple-400" />,
  music: <MusicNoteIcon weight="fill" className="size-10 text-green-400" />,
  image: <ImageIcon weight="fill" className="size-10 text-orange-400" />,
  file: <FileIcon weight="fill" className="text-muted-foreground size-10" />,
};
const FILE_ICONS_SM: Record<FileType, React.ReactNode> = {
  folder: <FolderIcon weight="fill" className="size-4 text-blue-400" />,
  video: <FilmStripIcon weight="fill" className="size-4 text-purple-400" />,
  music: <MusicNoteIcon weight="fill" className="size-4 text-green-400" />,
  image: <ImageIcon weight="fill" className="size-4 text-orange-400" />,
  file: <FileIcon weight="fill" className="text-muted-foreground size-4" />,
};

function ContextMenu({
  item,
  onRename,
  onDelete,
}: {
  item: MediaItem;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenuContent className="w-44">
      {item.type !== "folder" && (
        <DropdownMenuItem>
          <ArrowsOutSimpleIcon className="mr-2 size-3.5" />
          Open
        </DropdownMenuItem>
      )}
      <DropdownMenuItem>
        <DownloadSimpleIcon className="mr-2 size-3.5" />
        Download
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ShareNetworkIcon className="mr-2 size-3.5" />
        Share
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onRename}>
        <PencilSimpleIcon className="mr-2 size-3.5" />
        Rename
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onClick={onDelete}
      >
        <TrashIcon className="mr-2 size-3.5" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export default function MediaPage() {
  const [view, setView] = React.useState<"list" | "grid">("grid");
  const [items, setItems] = React.useState<MediaItem[]>(rootItems);
  const [search, setSearch] = React.useState("");
  const [path, setPath] = React.useState<string[]>([]);
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [previewItem, setPreviewItem] = React.useState<MediaItem | null>(null);

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startRename(item: MediaItem) {
    setRenamingId(item.id);
    setRenameValue(item.name);
  }

  function commitRename(id: string) {
    if (!renameValue.trim()) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, name: renameValue } : i)),
    );
    setRenamingId(null);
  }

  function handleItemDoubleClick(item: MediaItem) {
    if (item.type === "folder") {
      setPath((prev) => [...prev, item.name]);
    } else {
      setPreviewItem(item);
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b px-4 py-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => setPath([])}
              className={cn(
                "hover:text-primary font-medium transition-colors",
                path.length === 0 ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Media
            </button>
            {path.map((segment, i) => (
              <React.Fragment key={i}>
                <CaretRightIcon className="text-muted-foreground size-3.5" />
                <button
                  onClick={() => setPath(path.slice(0, i + 1))}
                  className={cn(
                    "hover:text-primary transition-colors",
                    i === path.length - 1
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {segment}
                </button>
              </React.Fragment>
            ))}
          </div>
          {path.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => setPath((p) => p.slice(0, -1))}
            >
              <ArrowLeftIcon className="size-3.5" />
            </Button>
          )}

          <div className="flex-1" />

          <div className="relative">
            <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-48 pl-8 text-sm"
            />
          </div>
          <Separator orientation="vertical" className="h-6" />
          <Button size="sm" variant="outline" className="h-8">
            <FolderPlusIcon className="mr-1.5 size-3.5" />
            New Folder
          </Button>
          <Button size="sm" variant="outline" className="h-8">
            <UploadSimpleIcon className="mr-1.5 size-3.5" />
            Upload
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            size="sm"
            variant={view === "list" ? "default" : "ghost"}
            className="h-8 w-8 p-0"
            onClick={() => setView("list")}
          >
            <ListIcon className="size-4" />
          </Button>
          <Button
            size="sm"
            variant={view === "grid" ? "default" : "ghost"}
            className="h-8 w-8 p-0"
            onClick={() => setView("grid")}
          >
            <SquaresFourIcon className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Grid View */}
          {view === "grid" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredItems.map((item) => (
                <DropdownMenu key={item.id}>
                  <div
                    className="group hover:bg-accent relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 transition-colors select-none"
                    onDoubleClick={() => handleItemDoubleClick(item)}
                  >
                    {/* Thumbnail area */}
                    <div className="bg-muted/50 flex size-16 items-center justify-center rounded-lg">
                      {FILE_ICONS[item.type]}
                    </div>
                    {/* Name */}
                    {renamingId === item.id ? (
                      <Input
                        autoFocus
                        value={renameValue}
                        className="h-6 px-1 text-center text-xs"
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => commitRename(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename(item.id);
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="line-clamp-2 w-full text-center text-xs leading-tight">
                        {item.name}
                      </span>
                    )}
                    {item.type === "folder" && item.items != null && (
                      <span className="text-muted-foreground text-xs">
                        {item.items} items
                      </span>
                    )}
                    {item.size && (
                      <Badge
                        variant="secondary"
                        className="px-1.5 py-0 text-xs"
                      >
                        {item.size}
                      </Badge>
                    )}
                    {/* Context menu trigger */}
                    <DropdownMenuTrigger
                      className="hover:bg-accent absolute top-1.5 right-1.5 inline-flex size-5 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DotsThreeVerticalIcon className="size-3.5" />
                    </DropdownMenuTrigger>
                  </div>
                  <ContextMenu
                    item={item}
                    onRename={() => startRename(item)}
                    onDelete={() => deleteItem(item.id)}
                  />
                </DropdownMenu>
              ))}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="flex flex-col gap-px">
              <div className="text-muted-foreground grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-3 py-1.5 text-xs font-medium">
                <span>Name</span>
                <span>Size</span>
                <span>Duration</span>
                <span>Modified</span>
                <span />
              </div>
              <Separator />
              {filteredItems.map((item) => (
                <DropdownMenu key={item.id}>
                  <div
                    className="group hover:bg-accent grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr_40px] items-center gap-4 rounded-lg px-3 py-2 transition-colors"
                    onDoubleClick={() => handleItemDoubleClick(item)}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {FILE_ICONS_SM[item.type]}
                      {renamingId === item.id ? (
                        <Input
                          autoFocus
                          value={renameValue}
                          className="h-6 flex-1 px-1 text-xs"
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => commitRename(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(item.id);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="truncate text-sm">{item.name}</span>
                      )}
                      {item.type === "folder" && item.items != null && (
                        <span className="text-muted-foreground shrink-0 text-xs">
                          {item.items} items
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {item.size ?? "—"}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {item.duration ?? "—"}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {new Date(item.modifiedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <DropdownMenuTrigger
                      className="hover:bg-accent inline-flex size-7 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DotsThreeVerticalIcon className="size-4" />
                    </DropdownMenuTrigger>
                  </div>
                  <ContextMenu
                    item={item}
                    onRename={() => startRename(item)}
                    onDelete={() => deleteItem(item.id)}
                  />
                </DropdownMenu>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-24">
              <FolderIcon className="size-12" />
              <p className="text-sm">No files found</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-medium">
              {previewItem && FILE_ICONS_SM[previewItem.type]}
              {previewItem?.name}
            </DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="flex flex-col gap-3">
              <div className="bg-muted flex h-48 items-center justify-center rounded-xl">
                {previewItem.type === "video" && (
                  <FilmStripIcon className="size-16 text-purple-400" />
                )}
                {previewItem.type === "image" && (
                  <ImageIcon className="size-16 text-orange-400" />
                )}
                {previewItem.type === "music" && (
                  <MusicNoteIcon className="size-16 text-green-400" />
                )}
                {previewItem.type === "file" && (
                  <FileIcon className="text-muted-foreground size-16" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {previewItem.size && (
                  <>
                    <span className="text-muted-foreground">Size</span>
                    <span>{previewItem.size}</span>
                  </>
                )}
                {previewItem.duration && (
                  <>
                    <span className="text-muted-foreground">Duration</span>
                    <span>{previewItem.duration}</span>
                  </>
                )}
                <span className="text-muted-foreground">Modified</span>
                <span>
                  {new Date(previewItem.modifiedAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button className="flex-1">
                  <ArrowsOutSimpleIcon className="mr-1.5 size-4" />
                  Play / Open
                </Button>
                <Button variant="outline">
                  <DownloadSimpleIcon className="mr-1.5 size-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
