"use client";

import {
  ChatIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { ModelDialog } from "@/components/chat/model-dialog";

export default function Layout({ children }: { children: React.ReactElement }) {
  const [query, setQuery] = useState("");
  const [selectedChatUuid, setSelectedChatUuid] = useState<string | null>(null);
  const [openModelDialog, setOpenModelDialog] = useState(false);

  const router = useRouter();
  const { data: chats, isPending } = api.chat.getChats.useQuery();
  const { data: createChatData, mutateAsync: createChatAsync } =
    api.chat.createChat.useMutation();

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
    router.push(`/dashboard/chat/${createChatData?.uuid}`);
  };

  return (
    <>
      <ModelDialog
        open={openModelDialog}
        onOpenChangeAction={setOpenModelDialog}
      />
      <div className="bg-background flex h-[calc(100vh-var(--header-height))] overflow-hidden">
        <aside className="border-border/70 bg-background flex w-80 shrink-0 flex-col border-r">
          <div className="border-border/60 space-y-3 border-b p-4">
            <Button
              type="button"
              variant="gradient"
              className="flex w-full items-center gap-2 px-4 py-4"
            >
              <PlusIcon className="size-4" />
              New Chat
            </Button>

            <div className="relative">
              <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations"
                className="h-8 pl-7"
              />
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setOpenModelDialog(true)}
            >
              <GearIcon className="size-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {isPending &&
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="space-y-2 rounded-lg border p-3">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-2.5 w-1/3" />
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
                  <button
                    key={chat.uuid}
                    type="button"
                    onClick={() => setSelectedChatUuid(chat.uuid)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      isActive
                        ? "border-primary/40 bg-primary/8"
                        : "border-border/70 hover:bg-muted/60"
                    }`}
                  >
                    <p className="line-clamp-1 text-xs font-medium">
                      {chat.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-[11px]">
                      {new Date(chat.updatedAt).toLocaleString()}
                    </p>
                  </button>
                );
              })}
          </div>
        </aside>

        <main className="bg-background min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
