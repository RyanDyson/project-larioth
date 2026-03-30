import { ChatInput } from "@/components/chat/chat-input";

export default function Page({ params }: { params: { chatUuid: string } }) {
  return (
    <div className="relative h-full w-full">
      <ChatInput uuid={params.chatUuid} />
    </div>
  );
}
