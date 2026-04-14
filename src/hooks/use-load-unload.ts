import { api } from "@/trpc/react";
import { useState } from "react";
import { create } from "zustand";

interface LoadStore {
  loadingModel: string | null;
  loadingAction: "load" | "eject" | null;
  progress: number;
  setLoadingState: (
    model: string | null,
    action: "load" | "eject" | null,
    progress: number,
  ) => void;
}

export const useLoadStore = create<LoadStore>((set) => ({
  loadingModel: null,
  loadingAction: null,
  progress: 0,
  setLoadingState: (model, action, progress) =>
    set({ loadingModel: model, loadingAction: action, progress }),
}));

export enum LoadAction {
  LOAD = "load",
  EJECT = "eject",
  LOADING = "loading",
  EJECTING = "ejecting",
}

export function useLoadUnload(options?: {
  model?: string;
  instanceId?: string;
}) {
  const { model, instanceId } = options ?? {};
  const [action, setAction] = useState<LoadAction>(LoadAction.LOAD);
  const loadingModel = useLoadStore((state) => state.loadingModel);
  const loadingAction = useLoadStore((state) => state.loadingAction);
  const progress = useLoadStore((state) => state.progress);
  const setLoadingState = useLoadStore((state) => state.setLoadingState);
  const {
    data: loadModelData,
    mutateAsync: loadModel,
    isPending: isLoadingModel,
  } = api.model.loadModel.useMutation();
  const {
    data: unloadModelData,
    mutateAsync: unloadModel,
    isPending: isUnloadingModel,
  } = api.model.unloadModel.useMutation();

  const handleLoad = async () => {
    if (!model) return;
    setAction(LoadAction.LOADING);
    setLoadingState(model, "load", 0);
    // Simulate progress for UI
    const interval = setInterval(() => {
      useLoadStore.setState((state) => ({
        progress: Math.min(state.progress + 10, 90),
      }));
    }, 200);
    try {
      await loadModel({ model });
      setLoadingState(model, "load", 100);
      setTimeout(() => setLoadingState(null, null, 0), 500);
      setAction(LoadAction.EJECT);
    } catch (error) {
      setLoadingState(null, null, 0);
      setAction(LoadAction.LOAD);
      throw error;
    } finally {
      clearInterval(interval);
    }
  };
  const handleUnload = async () => {
    if (!instanceId) return;
    setAction(LoadAction.EJECTING);
    setLoadingState(model ?? null, "eject", 0);
    const interval = setInterval(() => {
      useLoadStore.setState((state) => ({
        progress: Math.min(state.progress + 15, 90),
      }));
    }, 150);
    try {
      await unloadModel({ instance_id: instanceId });
      setLoadingState(model ?? null, "eject", 100);
      setTimeout(() => setLoadingState(null, null, 0), 500);
      setAction(LoadAction.LOAD);
    } catch (error) {
      setLoadingState(null, null, 0);
      setAction(LoadAction.EJECT);
      throw error;
    } finally {
      clearInterval(interval);
    }
  };

  return {
    action,
    setAction,
    isLoadingModel,
    isUnloadingModel,
    handleLoad,
    handleUnload,
    loadingModel,
    loadingAction,
    progress,
  };
}
