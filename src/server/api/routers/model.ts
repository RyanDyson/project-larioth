import { createTRPCRouter, protectedProcedure } from "../trpc";

export const modelRouter = createTRPCRouter({
  listDownloadedModels: protectedProcedure.query(async ({ ctx }) => {
    const models = await ctx.lmStudioClient.system.listDownloadedModels();
    return models;
  }),
});
