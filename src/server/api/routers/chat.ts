import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chats, messages, MessageRole } from "@/server/db/schema";
import { eq } from "drizzle-orm";

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
      where: (chats, { eq }) => eq(chats.user_id, ctx.session.user.id),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
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
        where: (chats, { eq }) => eq(chats.uuid, input.chatUuid),
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
        where: (messages, { eq }) => eq(messages.chat_uuid, input.chatUuid),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
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
});
