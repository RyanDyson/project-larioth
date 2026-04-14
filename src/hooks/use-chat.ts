import { api } from "@/trpc/react";
import { useState } from "react";
import { type Model } from "@/server/api/routers/model";
export function useChat(uuid: string) {
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<Model | undefined>(undefined);

  const {
    data: messages,
    isLoading: isFetchingMessages,
    refetch: fetchMessages,
  } = api.chat.getMessages.useQuery({ chatUuid: uuid });

  const { mutate: sendStatefulMessage, isPending: isSendingMessage } =
    api.chat.sendStatefulMessage.useMutation({
      onSuccess: async () => {
        setInput("");
        await fetchMessages();
      },
    });

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!model) return;
    sendStatefulMessage({
      chatUuid: uuid,
      content: input,
      model: model.key, // Fallback, could be dynamically fetched
    });
  };

  const { mutate: deleteChat, isPending: isDeletingChat } =
    api.chat.deleteChat.useMutation({
      onSuccess: async () => {
        await fetchMessages();
      },
    });

  return {
    messages,
    input,
    setInput,
    model,
    setModel,
    fetchMessages,
    sendMessage,
    isSendingMessage,
    isFetchingMessages,
    deleteChat,
    isDeletingChat,
  };
  /*
  return {
    sendMessage:
    fetchMessages:
  }
  */
}
