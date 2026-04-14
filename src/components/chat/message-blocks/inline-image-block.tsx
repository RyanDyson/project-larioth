"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function InlineImageBlock({
  src,
  alt,
  title,
  className,
}: {
  src: string;
  alt?: string;
  title?: string;
  className?: string;
}) {
  return (
    <span className="my-2 block">
      <span className="border-border/60 bg-background inline-flex max-w-full overflow-hidden rounded-xl border shadow-sm">
        <Image
          src={src}
          alt={alt ?? ""}
          title={title}
          className={cn("max-h-96 max-w-full object-contain", className)}
          width={1200}
          height={800}
          loading="lazy"
        />
      </span>
      {title ? (
        <span className="text-muted-foreground mt-1 block text-xs">
          {title}
        </span>
      ) : null}
    </span>
  );
}
