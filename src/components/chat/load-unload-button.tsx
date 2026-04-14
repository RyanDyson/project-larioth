"use client";

import { EjectIcon, DownloadIcon, SpinnerGapIcon } from "@phosphor-icons/react";

import { Button } from "../ui/button";
import { useLoadUnload } from "@/hooks/use-load-unload";
import { LoadAction } from "@/hooks/use-load-unload";
import { useEffect } from "react";
import { api } from "@/trpc/react";

export function LoadUnloadButton({
  model,
  instanceId,
  isLoaded,
}: {
  model: string;
  instanceId?: string;
  isLoaded?: boolean;
}) {
  const {
    action,
    setAction,
    isLoadingModel,
    isUnloadingModel,
    handleLoad,
    handleUnload,
  } = useLoadUnload({ model, instanceId });

  const isBusy = isLoadingModel || isUnloadingModel;
  const isUnloadMode = action === LoadAction.EJECT || isLoaded;

  const { refetch } = api.model.listYourModels.useQuery();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBusy) {
      return;
    }
    if (isUnloadMode) {
      if (!instanceId) {
        return;
      }
      await handleUnload();
      await refetch();
      return;
    }
    if (!model) {
      return;
    }

    await handleLoad();
    await refetch();
  };

  useEffect(() => {
    if (isLoaded) {
      setAction(LoadAction.EJECT);
    } else {
      setAction(LoadAction.LOAD);
    }
  }, [isLoaded, setAction]);

  return (
    <Button
      type="button"
      variant={isUnloadMode ? "gradientDestructive" : "gradient"}
      disabled={isBusy}
      onClick={handleClick}
      className="flex items-center justify-center gap-2"
    >
      {isBusy ? (
        <SpinnerGapIcon className="h-4 w-4 animate-spin" />
      ) : isUnloadMode ? (
        <EjectIcon className="h-4 w-4" />
      ) : (
        <DownloadIcon className="h-4 w-4" />
      )}

      <span className="text-xs font-medium">
        {isBusy ? "Working..." : isUnloadMode ? "Eject" : "Load"}
      </span>
    </Button>
  );
}
