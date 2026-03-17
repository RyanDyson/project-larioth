import { LMStudioClient } from "@lmstudio/sdk";
import { env } from "@/env";

export const lmStudioClient = new LMStudioClient({
  baseUrl: env.LM_BASE_URL,
});
