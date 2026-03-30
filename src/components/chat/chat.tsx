"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
type message = {
  body: string;
  role: "user" | "assistant";
  time: Date;
};

const initialMessages: message[] = [
  {
    role: "assistant",
    body: "Hello! I’m Library AI Assistant here to help you with information about the CityUHK Library enquiry. I’ll do my best to provide accurate and helpful answers, but please double-check any important details with official sources.",
    time: new Date(),
  },
  {
    role: "assistant",
    body: "How can I assist you today?",
    time: new Date(),
  },
];

export function Chat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState<message[]>(initialMessages);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  type SendChatVars = {
    input: string;
    chatHistoryUser: string[];
    chatReplyUser: string[];
    onChunk: (text: string) => void;
  };

  const {
    mutateAsync: sendChatMessage,
    isPending: isSendingChat,
    error: sendError,
  } = useMutation({
    mutationFn: async (vars: SendChatVars) => {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const cannedReplies = [
        "Thanks for your question. This is a mock response for now. You can replace this with the real API again whenever you're ready.",
        "I found a few useful details in the mock dataset. For official confirmation, please check the CityUHK Library website or contact the help desk.",
        "Great question. In this mocked mode, responses are generated locally to keep UI testing fast and predictable.",
      ];

      const fallbackReply =
        cannedReplies[Math.floor(Math.random() * cannedReplies.length)] ??
        "Thanks for your message. This is a mock response.";

      const matchedReply =
        vars.input.toLowerCase().includes("hour") ||
        vars.input.toLowerCase().includes("open")
          ? "Mock info: The library is typically open on weekdays and has reduced weekend hours. Please verify exact hours on the official site."
          : vars.input.toLowerCase().includes("book") ||
              vars.input.toLowerCase().includes("reserve")
            ? "Mock info: You can reserve books online through the library portal and pick them up at the circulation desk when notified."
            : vars.input.toLowerCase().includes("room") ||
                vars.input.toLowerCase().includes("study")
              ? "Mock info: Study rooms can be booked in advance, usually in hourly slots, subject to availability."
              : fallbackReply;

      const tokens = matchedReply.split(" ");
      let streamed = "";
      for (const token of tokens) {
        streamed += `${streamed ? " " : ""}${token}`;
        vars.onChunk(streamed);
        await delay(45);
      }

      return [matchedReply];
    },
  });

  const handleSend = async () => {
    const input = inputValue.trim();
    if (!input || isSendingChat) return;
    setInputValue("");
    setChatHistory((prev) => [
      ...prev,
      { body: input, role: "user", time: new Date() },
      { body: "", role: "assistant", time: new Date() },
    ]);
    const assistantMessages = chatHistory
      .filter((msg) => msg.role === "assistant")
      .map((msg) => msg.body);
    const userMessages = chatHistory
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.body);
    await sendChatMessage({
      input,
      chatHistoryUser: userMessages,
      chatReplyUser: assistantMessages,
      onChunk: (text) => {
        setChatHistory((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, body: text };
          return updated;
        });
      },
    });
    scrollToBottom();
  };

  useEffect(() => {
    if (sendError) {
      toast.error("Failed to send message. Please try again later.", {
        id: "send-chat-error",
        toasterId: "canvas",
      });
    }
  }, [sendError]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="bg-background h-full w-full overflow-x-clip overflow-y-auto"
    >
      <div className="min-h-full w-screen space-y-4 overflow-x-clip p-4 pb-44">
        {chatHistory.map((message, index) => (
          <div
            key={`${message.time}-${index}`}
            className={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "assistant"
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {isSendingChat &&
              message.role === "assistant" &&
              message.body === "" ? (
                <span className="flex items-center gap-1 py-1">
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              ) : message.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-1 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-1 list-disc space-y-0.5 pl-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-1 list-decimal space-y-0.5 pl-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    h1: ({ children }) => (
                      <h1 className="mb-1 text-base font-bold">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-1 text-sm font-bold">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-1 text-sm font-semibold">{children}</h3>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-black/10 px-1 font-mono text-xs">
                        {children}
                      </code>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:opacity-80"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.body}
                </ReactMarkdown>
              ) : (
                <p>{message.body}</p>
              )}
              <p className="mt-1 text-[11px] opacity-60">
                {message.time.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed right-0 bottom-0 flex w-screen flex-col items-center gap-2 px-2">
        <div className="flex w-full items-center justify-center gap-2 px-4">
          <motion.div
            layout
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center gap-2"
          >
            <div className="text-muted-foreground bg-background/70 border-border max-w-lg items-center justify-center rounded-full border p-1 px-4 text-center text-xs backdrop-blur-xl">
              Please avoid sharing any personal or sensitive information,
              including passwords, your eID or other confidential information,
            </div>
          </motion.div>

          {showScrollBtn && (
            <motion.div
              key="scroll-btn"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={scrollToBottom}
            >
              <Button
                size="icon"
                className="text-primary border-primary/30 hover:bg-primary/30 from-primary/10 to-primary/20 size-11 shrink-0 cursor-pointer rounded-full border bg-transparent bg-linear-to-b font-bold backdrop-blur-lg"
              >
                <CaretDownIcon className="size-3.5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
