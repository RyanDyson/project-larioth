import { z } from "zod";
import { eq, desc, asc } from "drizzle-orm";
import { EventEmitter, on } from "node:events";

import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chats, messages, MessageRole } from "@/server/db/schema";

type ChatMessageInput = {
  role: MessageRole;
  content: string;
};

export enum MessageType {
  MESSAGE = "message",
  REASONING = "reasoning",
  TOOL_CALL = "tool_call",
}

type LmStudioChatOutputItem =
  | {
      type: MessageType.MESSAGE;
      content: string;
    }
  | {
      type: MessageType.REASONING;
      content: string;
    }
  | {
      type: MessageType.TOOL_CALL;
      tool: string;
      arguments?: Record<string, unknown>;
      output?: string;
      provider_info?: Record<string, unknown>;
    };

type LmStudioChatResponse = {
  model_instance_id?: string;
  output?: LmStudioChatOutputItem[];
  response_id?: string;
  stats?: {
    input_tokens?: number;
    total_output_tokens?: number;
    reasoning_output_tokens?: number;
    tokens_per_second?: number;
    time_to_first_token_seconds?: number;
  };
};

class IterableEventEmitter extends EventEmitter {
  toIterable(eventName: string, opts?: { signal?: AbortSignal }) {
    return on(this, eventName, opts);
  }
}

const ee = new IterableEventEmitter();

function getLmStudioHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.LM_API_TOKEN}`,
  };
}

async function chatWithLmStudio(input: {
  model: string;
  message: string;
  previous_response_id?: string | null;
  store?: boolean;
}) {
  const res = await fetch(`${env.LM_BASE_URL}/api/v1/chat`, {
    method: "POST",
    headers: getLmStudioHeaders(),
    body: JSON.stringify({
      model: input.model,
      input: input.message,
      previous_response_id: input.previous_response_id ?? undefined,
      store: input.store ?? true,
      stream: true,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(
      `LM Studio chat request failed: ${res.status} ${res.statusText}${errorText ? ` - ${errorText}` : ""}`,
    );
  }

  return (await res.json()) as LmStudioChatResponse;
}

export const chatRouter = createTRPCRouter({
  createChat: protectedProcedure.mutation(async ({ ctx }) => {
    const [newChat] = await ctx.db
      .insert(chats)
      .values({
        user_id: ctx.session.user.id,
        title: "New Chat",
      })
      .returning();

    return newChat;
  }),

  getChats: protectedProcedure.query(async ({ ctx }) => {
    const userChats = await ctx.db.query.chats.findMany({
      where: (chatTable, { eq }) => eq(chatTable.user_id, ctx.session.user.id),
      orderBy: (chatTable, { desc }) => [desc(chatTable.createdAt)],
    });

    return userChats;
  }),

  getChatDetails: protectedProcedure
    .input(
      z.object({
        chatUuid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.query.chats.findFirst({
        where: (chatTable, { eq }) => eq(chatTable.uuid, input.chatUuid),
      });

      return chat;
    }),

  deleteChat: protectedProcedure
    .input(
      z.object({
        chatUuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(chats).where(eq(chats.uuid, input.chatUuid));
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        chatUuid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const chatMessages = await ctx.db.query.messages.findMany({
        where: (messageTable, { eq }) =>
          eq(messageTable.chat_uuid, input.chatUuid),
        orderBy: (messageTable, { asc }) => [asc(messageTable.createdAt)],
      });

      return chatMessages;
    }),

  sendMessages: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        role: z.enum([
          MessageRole.USER,
          MessageRole.ASSISTANT,
          MessageRole.SYSTEM,
        ]),
        model: z.string(),
        chatUuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(messages).values({
        content: input.content,
        role: input.role,
        model: input.model,
        chat_uuid: input.chatUuid,
      });
    }),

  /**
   * Stateful LM Studio chat.
   *
   * Uses LM Studio's `previous_response_id` to continue a conversation without
   * resending the full transcript every time. We persist the returned response id
   * on the chat record so the next request can continue from the same state.
   */
  sendStatefulMessage: protectedProcedure
    .input(
      z.object({
        chatUuid: z.string(),
        model: z.string(),
        content: z.string().min(1),
        store: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.query.chats.findFirst({
        where: (chatTable, { eq }) => eq(chatTable.uuid, input.chatUuid),
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      if (chat.user_id !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      const history = await ctx.db.query.messages.findMany({
        where: (messageTable, { eq }) =>
          eq(messageTable.chat_uuid, input.chatUuid),
        orderBy: (messageTable, { asc }) => [asc(messageTable.createdAt)],
      });

      const previousAssistantMessage = [...history]
        .reverse()
        .find((message) => message.role === MessageRole.ASSISTANT);

      const response = await chatWithLmStudio({
        model: input.model,
        message: input.content,
        previous_response_id: previousAssistantMessage?.content?.startsWith(
          "response_id:",
        )
          ? previousAssistantMessage.content.slice("response_id:".length).trim()
          : null,
        store: input.store ?? true,
      });

      const assistantText =
        response.output
          ?.filter((item) => item.type === MessageType.MESSAGE)
          .map((item) => item.content)
          .join("\n") ?? "";

      await ctx.db.insert(messages).values([
        {
          content: input.content,
          role: MessageRole.USER,
          model: input.model,
          chat_uuid: input.chatUuid,
        },
        {
          content: assistantText || "No response generated.",
          role: MessageRole.ASSISTANT,
          model: input.model,
          chat_uuid: input.chatUuid,
        },
      ]);

      if (response.response_id) {
        await ctx.db
          .update(chats)
          .set({
            updatedAt: new Date(),
            title:
              chat.title === "New Chat" && input.content.trim()
                ? input.content.trim().slice(0, 48)
                : chat.title,
          })
          .where(eq(chats.uuid, input.chatUuid));

        ee.emit("message", {
          chatUuid: input.chatUuid,
          responseId: response.response_id,
          modelInstanceId: response.model_instance_id ?? null,
          output: response.output ?? [],
          stats: response.stats ?? null,
        });
      }

      return {
        responseId: response.response_id ?? null,
        modelInstanceId: response.model_instance_id ?? null,
        assistantText,
        stats: response.stats ?? null,
      };
    }),
});
