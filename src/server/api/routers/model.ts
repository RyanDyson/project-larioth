import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "@/env";
import { z } from "zod";

export enum ModelType {
  LLM = "llm",
  EMBEDDING = "embedding",
}

export enum ModelFormat {
  GGUF = "gguf",
  MLX = "mlx",
}

export enum ModelDownloadStatus {
  DOWNLOADING = "downloading",
  PAUSED = "paused",
  COMPLETED = "completed",
  FAILED = "failed",
  ALREADY_DOWNLOADED = "already_downloaded",
}

export type Model = {
  type: ModelType;
  publisher: string;
  key: string;
  display_name: string;
  architecture?: string;
  context_window?: number;
  token_limit?: number;
  quantization?: {
    name?: string;
    bits_per_weight?: number;
  };
  size_bytes?: number;
  params_string?: string;
  loaded_instances?: {
    id: string;
    config: {
      context_length?: number;
      eval_batch_size?: number;
      flash_attention?: boolean;
      num_expers?: number;
      offload_kv_cache_to_gpu?: boolean;
    };
  }[];
  max_context_length: number;
  format: ModelFormat | null;
  capabilities?: {
    vision?: boolean;
    trained_for_tool_use: boolean;
  };
  description?: string;
};

type listModelsResponse = {
  models: Model[];
};

export type loadState = {
  type: ModelType;
  instance_id: string;
  load_time_seconds: number;
  load_config?: {
    context_length?: number;
    eval_batch_size?: number;
    flash_attention?: boolean;
    num_experts?: number;
    offload_kv_cache_to_gpu?: boolean;
  };
};

type loadModelResponse = {
  state: loadState;
};

export type modelDownloadState = {
  job_id?: string;
  status?: ModelDownloadStatus;
  completed_at?: string;
  total_size_bytes?: number;
  started_at?: string;
};

type modelDownloadResponse = {
  state: modelDownloadState;
};

export type downloadStatus = modelDownloadState & {
  bytes_per_second?: number;
  estimated_completion?: string;
  downloaded_bytes?: number;
};

export const modelRouter = createTRPCRouter({
  listYourModels: protectedProcedure.query(async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.LM_API_TOKEN}`,
    };
    const res: Response = await fetch(env.LM_BASE_URL + "/api/v1/models", {
      headers,
    });
    const models: listModelsResponse = (await res.json()) as listModelsResponse;
    return models;
  }),
  loadModel: protectedProcedure
    .input(
      z.object({
        model: z.string(),
        context_length: z.number().optional(),
        eval_batch_size: z.number().optional(),
        flash_attention: z.boolean().optional(),
        num_expers: z.number().optional(),
        offload_kv_cache_to_gpu: z.boolean().optional(),
        echo_load_config: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.LM_API_TOKEN}`,
      };
      const res: Response = await fetch(
        env.LM_BASE_URL + "/api/v1/models/load",
        {
          method: "POST",
          headers,
          body: JSON.stringify(input),
        },
      );
      const state: Model = (await res.json()) as Model;
      return state;
    }),
  downloadModel: protectedProcedure
    .input(
      z.object({
        model: z.string(),
        quantization: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.LM_API_TOKEN}`,
      };
      const res: Response = await fetch(
        env.LM_BASE_URL + "/api/v1/models/download",
        {
          method: "POST",
          headers,
          body: JSON.stringify(input),
        },
      );
      const state: modelDownloadResponse =
        (await res.json()) as modelDownloadResponse;
      return state;
    }),
  unloadModel: protectedProcedure
    .input(z.object({ instance_id: z.string() }))
    .mutation(async ({ input }) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.LM_API_TOKEN}`,
      };
      const res: Response = await fetch(
        env.LM_BASE_URL + "/api/v1/models/unload",
        {
          method: "POST",
          headers,
          body: JSON.stringify(input),
        },
      );
      const state = (await res.json()) as {
        instance_id: string;
      };
      return state;
    }),
  modelDownloadStatus: protectedProcedure
    .input(z.object({ job_id: z.string() }))
    .query(async ({ input }) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.LM_API_TOKEN}`,
      };
      const res: Response = await fetch(
        env.LM_BASE_URL + `/api/v1/models/download/status/${input.job_id}`,
        {
          headers,
        },
      );
      const state: downloadStatus = (await res.json()) as downloadStatus;
      return state;
    }),
});
