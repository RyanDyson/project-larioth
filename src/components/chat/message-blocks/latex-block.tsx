"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import Latex from "react-latex";

type LatexBlockProps = {
  code: string;
  className?: string;
};

export function LatexBlock({ code, className }: LatexBlockProps) {
  const content = useMemo(() => code.replace(/\n$/, ""), [code]);

  return (
    <div
      className={cn(
        "border-border/60 bg-muted/30 my-3 overflow-x-auto rounded-xl border px-4 py-3",
        className,
      )}
    >
      <div className="text-muted-foreground mb-2 text-[11px] font-medium">
        LaTeX
      </div>
      <div className="overflow-x-auto">
        <Latex>{`$$${content}$$`}</Latex>
      </div>
    </div>
  );
}
