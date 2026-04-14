"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatScrollArea } from "@/components/chat/chat-scroll-area";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ chatUuid: string }>;
}) {
  const { chatUuid } = use(params);
  return (
    <div className="relative h-[calc(98.3vh)] max-h-full grow">
      <ChatScrollArea uuid={chatUuid} />
      <ChatInput uuid={chatUuid} />
      <div className="to-background absolute bottom-0 left-0 h-16 w-full bg-linear-to-b from-transparent" />
    </div>
  );
}
