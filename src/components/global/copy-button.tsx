"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import copy from "copy-to-clipboard";
import { useState, useEffect } from "react";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  label?: string;
  code: string;
  disableTooltip?: boolean;
  disableAutoOpen?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

export const CopyButton = ({
  label = "",
  code,
  disableTooltip = false,
  disableAutoOpen = false,
  className,
  onClick,
  ...props
}: CopyButtonProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [canShowTooltip, setCanShowTooltip] = useState(!disableAutoOpen);

  useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  useEffect(() => {
    if (!disableAutoOpen) return;
    const timer = setTimeout(() => {
      setCanShowTooltip(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [disableAutoOpen]);

  const handleCopy = () => {
    const copyFn = copy as unknown as (text: string) => void;
    copyFn(code);
    setHasCopied(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleCopy();
    onClick?.(event);
  };

  const renderIconButton = () => (
    <Button
      type="button"
      variant="ghost"
      aria-label="Copy code to clipboard"
      size="icon"
      onClick={handleClick}
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8",
        className,
      )}
      {...props}
    >
      <div className="relative h-4 w-4">
        <CheckIcon
          className={cn(
            "absolute inset-0 h-4 w-4 text-emerald-500 transition-all duration-200 ease-in-out",
            hasCopied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
        <CopyIcon
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-200 ease-in-out",
            hasCopied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
      </div>
    </Button>
  );

  if (disableTooltip || !canShowTooltip) {
    return renderIconButton();
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{renderIconButton()}</TooltipTrigger>
        <TooltipContent>
          {hasCopied ? `Copied ${label}!` : `Copy ${label}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
