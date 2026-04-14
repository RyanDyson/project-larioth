"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import type { MessageRole } from "@/server/db/schema";

import { useChat } from "@/hooks/use-chat";
import { useRef } from "react";

export function ChatScrollArea({ uuid }: { uuid: string }) {
  const { messages, isSendingMessage } = useChat(uuid);
  const bottomRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSendingMessage]);

  return (
    <ScrollArea className="flex h-full max-h-full flex-col px-8">
      <div className="flex w-full flex-col space-y-4 gap-y-4 overflow-hidden pr-4">
        <div className="h-16 shrink-0" />
        {messages?.map((message, index) => (
          <MessageBubble
            key={message.uuid}
            text={message.content}
            isStreaming={
              isSendingMessage &&
              index === messages.length - 1 &&
              message.role === "assistant"
            }
            modelName={message.model ?? undefined}
            role={message.role as MessageRole}
          />
        ))}
        <div ref={bottomRef} className="h-32 shrink-0" />
      </div>
    </ScrollArea>
  );
}
