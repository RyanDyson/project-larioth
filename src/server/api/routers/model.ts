import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const modelRouter = createTRPCRouter({
  listDownloadedModels: protectedProcedure.query(async ({ ctx }) => {
    const models = await ctx.lmStudioClient.system.listDownloadedModels();
    return models;
  }),

  loadModel: protectedProcedure
    .input(z.object({ modelKey: z.string() }))
    .mutation(async ({ input }) => {
      // Mock: simulate model loading latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, modelKey: input.modelKey };
    }),

  ejectModel: protectedProcedure
    .input(z.object({ modelKey: z.string() }))
    .mutation(async ({ input }) => {
      // Mock: simulate model ejection latency
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, modelKey: input.modelKey };
    }),
});
