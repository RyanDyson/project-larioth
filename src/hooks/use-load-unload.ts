import { api } from "@/trpc/react";
import { useState } from "react";

export enum LoadAction {
  LOAD = "load",
  EJECT = "eject",
  LOADING = "loading",
  EJECTING = "ejecting",
}

export function useLoadUnload({
  model,
  instanceId,
}: {
  model?: string;
  instanceId?: string;
}) {
  const [action, setAction] = useState<LoadAction | undefined>(undefined);
  const { mutateAsync: loadModel, isPending: isLoadingModel } =
    api.model.loadModel.useMutation();
  const { mutateAsync: unloadModel, isPending: isUnloadingModel } =
    api.model.unloadModel.useMutation();

  const handleLoad = async () => {
    if (!model || !instanceId) return;
    setAction(LoadAction.LOADING);
    await loadModel({ model });
    setAction(LoadAction.EJECT);
  };
  const handleUnload = async () => {
    if (!model || !instanceId) return;
    setAction(LoadAction.EJECTING);
    await unloadModel({ instance_id: instanceId });
    setAction(undefined);
  };

  return {
    action,
    isLoadingModel,
    isUnloadingModel,
    handleLoad,
    handleUnload,
  };
}
