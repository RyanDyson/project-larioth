"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  RobotIcon,
  SparkleIcon,
  GitForkIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import React from "react";
import ReactMarkdown from "react-markdown";

import { CodeBlock } from "./message-blocks/code-block";
import { InlineImageBlock } from "./message-blocks/inline-image-block";
import { LatexBlock } from "./message-blocks/latex-block";
import { MessageRole } from "@/server/db/schema";
import { CopyButton } from "../global/copy-button";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { authClient } from "@/server/better-auth/client";
import { motion } from "motion/react";
import { getModelIcon } from "@/lib/icons";

type MessageBubbleProps = {
  text: string;
  isStreaming?: boolean;
  modelName?: string;
  className?: string;
  role?: MessageRole;
};

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }
  return "";
}

function MarkdownContent({ text }: { text: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => (
            <p className="mb-3 leading-7 last:mb-0">{children}</p>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ml-5 list-disc space-y-2 marker:text-emerald-500/80 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-6">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-primary/30 text-muted-foreground bg-muted/30 mb-3 rounded-r-lg border-l-2 px-4 py-2 italic last:mb-0">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border/70 my-4" />,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-border bg-muted/50 border px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-border border px-3 py-2 align-top">
              {children}
            </td>
          ),
          img: ({ src, alt, title }) => {
            return src ? (
              <InlineImageBlock
                src={String(src as string)}
                alt={alt}
                title={title}
              />
            ) : null;
          },
          code: ({ children, className, ...props }) => {
            const code = getNodeText(children).replace(/\n$/, "");
            const languageMatch = /language-([a-zA-Z0-9_-]+)/.exec(
              className ?? "",
            );
            const language = languageMatch?.[1] ?? "text";
            const isBlock =
              className !== undefined ||
              code.includes("\n") ||
              code.length > 80 ||
              language === "math" ||
              language === "latex";

            if (language === "math" || language === "latex") {
              return <LatexBlock code={code} />;
            }

            if (isBlock) {
              return <CodeBlock code={code} language={language} />;
            }

            const inlineText = getNodeText(children);

            return (
              <code
                className="bg-muted/60 text-foreground rounded px-1.5 py-0.5 font-mono text-[0.95em]"
                {...props}
              >
                {inlineText}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export function MessageBubble({
  text,
  isStreaming = false,
  modelName = "Assistant",
  className,
  role,
}: MessageBubbleProps) {
  const { data: session } = authClient.useSession();

  const isUser = role === MessageRole.USER;
  const isSystem = role === MessageRole.SYSTEM;
  const isAssistant = role === MessageRole.ASSISTANT;

  return (
    <div
      className={cn(
        "flex w-full flex-row gap-2 py-4",
        isUser && "justify-end",
        isSystem && "justify-center py-2",
      )}
    >
      <div className={cn("flex gap-2", isSystem && "w-full max-w-2xl")}>
        <div
          className={cn(
            "group flex w-full items-start gap-3 py-3",
            isUser &&
              "bg-card max-w-xl self-end justify-self-end rounded-xl rounded-tr-none p-4",
            isSystem && "items-center rounded-xl px-4 py-3 font-mono italic",
            isAssistant && "",
            className,
          )}
        >
          <div className={cn("flex min-w-0 flex-1 flex-col")}>
            {isStreaming && (
              <div className="mb-2 flex items-center gap-2">
                <span className="border-primary/20 bg-primary/10 text-primary inline-flex h-6 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
                  <motion.span
                    className="bg-primary size-1 rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="bg-primary size-1 rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="bg-primary size-1 rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </span>
              </div>
            )}

            <div
              className={cn(
                "relative w-full max-w-6xl text-sm leading-6 transition-colors",
                isUser && "text-right",
                isSystem && "text-muted-foreground text-center text-xs",
              )}
            >
              <MarkdownContent text={text} />
            </div>

            {isAssistant && !isStreaming && (
              <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  {getModelIcon(modelName ?? "")}
                  {modelName}
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <span>248 tokens</span>
                  <span>14.2 kb/s</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <CopyButton
                    code={text}
                    label="message"
                    className="hover:bg-muted/50 hover:text-foreground text-muted-foreground flex h-7 w-7 items-center justify-center rounded-md border-none bg-transparent p-0 shadow-none transition-colors [&>svg]:size-4"
                  />
                  <button
                    className="hover:bg-muted/50 hover:text-foreground text-muted-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                    title="Fork chat"
                  >
                    <GitForkIcon className="size-4" />
                  </button>
                  <button
                    className="hover:bg-muted/50 hover:text-foreground text-muted-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                    title="Resend with different model"
                  >
                    <ArrowsClockwiseIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isUser ? (
        <Avatar
          className={cn(
            "border-border/70 bg-background mt-0.5 size-9 shrink-0 border",
          )}
        >
          <AvatarImage
            src={session?.user?.image ?? undefined}
            alt={modelName}
          />
          <AvatarFallback className="from-primary/15 via-primary/10 to-muted text-primary bg-linear-to-br">
            {isAssistant ? (
              <RobotIcon size={18} weight="bold" />
            ) : (
              <SparkleIcon size={18} weight="bold" />
            )}
          </AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}
