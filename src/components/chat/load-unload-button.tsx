"use client";

import { Button } from "../ui/button";
import { EjectIcon, DownloadIcon } from "@phosphor-icons/react";
import { LoadAction } from "@/hooks/use-load-unload";
import { useLoadUnload } from "@/hooks/use-load-unload";

export function LoadUnloadButton({
  model,
  instanceId,
  isLoaded,
}: {
  model: string;
  instanceId: string;
  isLoaded?: boolean;
}) {
  const { action, isLoadingModel, isUnloadingModel, handleLoad, handleUnload } =
    useLoadUnload({ model, instanceId });

  return (
    <Button
      variant={
        action === LoadAction.EJECTING || action === LoadAction.EJECT
          ? "gradientDestructive"
          : "gradient"
      }
      disabled={isLoadingModel || isUnloadingModel}
      onClick={action === LoadAction.EJECT ? handleUnload : handleLoad}
      className="flex items-center justify-center gap-1"
    >
      {action === LoadAction.EJECT ? <EjectIcon /> : <DownloadIcon />}
    </Button>
  );
}
