import { Qwen as QwenIcon } from "@lobehub/icons";

export const getModelIcon = (modelKey: string) => {
  const key = modelKey.toLowerCase();

  if (key.includes("qwen")) {
    return <QwenIcon className="size-4 shrink-0" />;
  }

  return null;
};
