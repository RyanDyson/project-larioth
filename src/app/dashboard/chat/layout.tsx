"use client";

import {
  ChatIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  GearIcon,
  TrashIcon,
  DotsThreeIcon,
  PencilSimpleLineIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { ModelDialog } from "@/components/chat/model-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatSettingsDialog } from "@/components/chat/chat-settings-dialog";
import { ChatDeleteDialog } from "@/components/chat/chat-delete-dialog";

export default function Layout({ children }: { children: React.ReactElement }) {
  const [query, setQuery] = useState("");
  const [selectedChatUuid, setSelectedChatUuid] = useState<string | null>(null);
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const router = useRouter();
  const { data: chats, isPending, refetch } = api.chat.getChats.useQuery();
  const {
    data: createChatData,
    mutateAsync: createChatAsync,
    isPending: isCreatingChat,
  } = api.chat.createChat.useMutation();

  const filteredChats = useMemo(() => {
    const allChats = chats ?? [];
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return allChats;
    }

    return allChats.filter((chat) =>
      chat.title.toLowerCase().includes(normalizedQuery),
    );
  }, [chats, query]);

  const handleCreateChat = async () => {
    await createChatAsync();
    setSelectedChatUuid(createChatData?.uuid ?? "");
    router.push(`/dashboard/chat/${createChatData?.uuid}`);
    await refetch();
  };

  return (
    <>
      <ModelDialog
        open={openModelDialog}
        onOpenChangeAction={setOpenModelDialog}
      />
      <ChatDeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        chatUuid={selectedChatUuid ?? ""}
        refetch={refetch}
      />
      <ChatSettingsDialog
        open={openSettingsDialog}
        setOpen={setOpenSettingsDialog}
        chatUuid={selectedChatUuid ?? ""}
        refetch={refetch}
      />
      <div className="flex h-full max-h-full overflow-hidden">
        <aside className="border-border/70 flex w-80 shrink-0 flex-col border-r">
          <div className="border-border/60 space-y-3 border-b p-4">
            <Button
              type="button"
              variant="gradient"
              className="flex w-full items-center gap-2 px-4 py-4"
              onClick={handleCreateChat}
              disabled={isCreatingChat}
            >
              {isCreatingChat ? (
                <>
                  <SpinnerIcon className="size-4 animate-spin" />
                  Creating chat...
                </>
              ) : (
                <>
                  <PlusIcon className="size-4" />
                  New Chat
                </>
              )}
            </Button>

            <div className="relative flex items-center justify-between gap-2">
              <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations"
                className="h-8 pl-7"
              />
              <Button
                size="icon-lg"
                variant="outline"
                onClick={() => setOpenModelDialog(true)}
              >
                <GearIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {isPending &&
              Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-card space-y-2 rounded-lg border p-3"
                >
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}

            {!isPending && filteredChats.length === 0 && (
              <div className="text-muted-foreground flex h-full min-h-44 flex-col items-center justify-center gap-2 p-4 text-center">
                <ChatIcon className="size-4" />
                <p className="text-xs">No chats found</p>
                <p className="text-[11px] opacity-70">
                  Start a new conversation to see it here.
                </p>
              </div>
            )}

            {!isPending &&
              filteredChats.map((chat) => {
                const isActive = selectedChatUuid === chat.uuid;

                return (
                  <Button
                    key={chat.uuid}
                    type="button"
                    onClick={() => {
                      setSelectedChatUuid(chat.uuid);
                      router.push(`/dashboard/chat/${chat?.uuid}`);
                    }}
                    className={`min-h-8 w-full cursor-pointer items-center justify-between rounded-lg border text-left transition-colors ${
                      isActive ? "border-primary/40 bg-primary/8" : "bg-card"
                    }`}
                  >
                    <p className="line-clamp-1 text-xs font-medium">
                      {chat.title}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon-xs">
                          <DotsThreeIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        onClick={(e) => e.stopPropagation()}
                        className="w-36"
                      >
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => {
                            setSelectedChatUuid(chat.uuid);
                            setOpenSettingsDialog(true);
                          }}
                        >
                          <PencilSimpleLineIcon className="h-4 w-4" />
                          Edit Chat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          className="gap-2"
                          onClick={() => {
                            setSelectedChatUuid(chat.uuid);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Button>
                );
              })}
          </div>
        </aside>

        <main className="bg-background min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
