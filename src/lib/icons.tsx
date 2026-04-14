import {
  Qwen as QwenIcon,
  Gemma as GemmaIcon,
  Meta as LlamaIcon,
  Mistral as MistralIcon,
  DeepSeek as DeepSeekIcon,
  Yi as YiIcon,
  ChatGLM as ChatGLMIcon,
  Cohere as CohereIcon,
} from "@lobehub/icons";

export const getModelIcon = (modelKey: string) => {
  const key = modelKey.toLowerCase();

  if (key.includes("qwen")) {
    return <QwenIcon className="size-4 shrink-0" />;
  }

  if (key.includes("gemma")) {
    return <GemmaIcon className="size-4 shrink-0" />;
  }

  if (key.includes("llama")) {
    return <LlamaIcon className="size-4 shrink-0" />;
  }

  if (key.includes("mistral") || key.includes("mixtral")) {
    return <MistralIcon className="size-4 shrink-0" />;
  }

  if (key.includes("deepseek")) {
    return <DeepSeekIcon className="size-4 shrink-0" />;
  }

  if (key.includes("yi-") || key === "yi") {
    return <YiIcon className="size-4 shrink-0" />;
  }

  if (key.includes("glm")) {
    return <ChatGLMIcon className="size-4 shrink-0" />;
  }

  if (key.includes("cohere") || key.includes("command")) {
    return <CohereIcon className="size-4 shrink-0" />;
  }

  return null;
};
