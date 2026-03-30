import { api } from "@/trpc/react";
import { useState } from "react";

export function useChat(uuid: string) {
  const [input, setInput] = useState<string>("");

  const {
    data: messages,
    isLoading: isFetchingMessages,
    refetch: fetchMessages,
  } = api.chat.getMessages.useQuery({ chatUuid: uuid });

  const { mutate: sendMessage, isPending: isSendingMessage } =
    api.chat.createChat.useMutation({
      onSuccess: async () => {
        setInput("");
        await fetchMessages();
      },
    });

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
