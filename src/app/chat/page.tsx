"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  PaperPlaneRightIcon,
  ArrowCounterClockwiseIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RobotIcon,
  UserIcon,
  CpuIcon,
  TrashIcon,
  EjectIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";

type Role = "user" | "assistant";
type Message = {
  id: string;
  role: Role;
  content: string;
  feedback?: "up" | "down";
};
type Chat = { id: string; title: string; messages: Message[] };

const MODELS = [
  { id: "llama3.2:3b", name: "Llama 3.2 3B", loaded: true },
  { id: "mistral:7b", name: "Mistral 7B", loaded: false },
  { id: "phi3:mini", name: "Phi-3 Mini", loaded: false },
  { id: "deepseek-r1:8b", name: "DeepSeek R1 8B", loaded: false },
];

const seedChats: Chat[] = [
  {
    id: "1",
    title: "Workout plan advice",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Can you give me a 3-day split workout plan?",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Sure! Here's a classic **Push/Pull/Legs** split:\n\n**Day 1 – Push**\n- Bench Press: 4×8\n- OHP: 3×10\n- Tricep extensions: 3×12\n\n**Day 2 – Pull**\n- Pull-ups: 4×8\n- Barbell row: 3×10\n- Bicep curls: 3×12\n\n**Day 3 – Legs**\n- Squat: 4×8\n- RDL: 3×10\n- Leg press: 3×15\n\nRest on day 4, then repeat. Progressive overload is key!",
      },
    ],
  },
  {
    id: "2",
    title: "Budget tracking ideas",
    messages: [
      {
        id: "m3",
        role: "user",
        content: "How should I categorize my expenses?",
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Great question! A simple categorization system:\n\n```\n- Housing (rent, utilities)\n- Food (groceries, dining out)\n- Transport (fuel, public transit)\n- Health (gym, doctor visits)\n- Entertainment (movies, hobbies)\n- Savings/Investments\n```\n\nTip: The **50/30/20 rule** is a good starting point — 50% needs, 30% wants, 20% savings.",
      },
    ],
  },
];

function MessageBubble({
  msg,
  onResend,
  onFeedback,
}: {
  msg: Message;
  onResend?: () => void;
  onFeedback?: (f: "up" | "down") => void;
}) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("group flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isUser ? (
          <UserIcon className="size-4" />
        ) : (
          <RobotIcon className="size-4" />
        )}
      </div>
      <div
        className={cn("flex max-w-[75%] flex-col gap-1", isUser && "items-end")}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm",
          )}
        >
          {msg.content}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Tooltip>
              <TooltipTrigger
                className="hover:bg-accent inline-flex size-6 items-center justify-center rounded-md"
                onClick={() => onResend?.()}
              >
                <ArrowCounterClockwiseIcon className="size-3" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Resend prompt</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  "hover:bg-accent inline-flex size-6 items-center justify-center rounded-md",
                  msg.feedback === "up" && "text-green-500",
                )}
                onClick={() => onFeedback?.("up")}
              >
                <ThumbsUpIcon className="size-3" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Good response</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  "hover:bg-accent inline-flex size-6 items-center justify-center rounded-md",
                  msg.feedback === "down" && "text-red-500",
                )}
                onClick={() => onFeedback?.("down")}
              >
                <ThumbsDownIcon className="size-3" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Bad response</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [chats, setChats] = React.useState<Chat[]>(seedChats);
  const [activeChatId, setActiveChatId] = React.useState<string>(
    seedChats[0]!.id,
  );
  const [input, setInput] = React.useState("");
  const [loadedModel, setLoadedModel] = React.useState(MODELS[0]);
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  function newChat() {
    const chat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  }

  function deleteChat(id: string) {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter((c) => c.id !== id);
      if (remaining.length > 0) setActiveChatId(remaining[0]!.id);
    }
  }

  function sendMessage(content?: string) {
    const text = content ?? input.trim();
    if (!text || !activeChat) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const placeholder: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "...",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
              messages: [...c.messages, userMsg, placeholder],
            }
          : c,
      ),
    );
    setInput("");
  }

  function resendLast(chatId: string, _userContent: string) {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const messages = [...c.messages];
        // remove last assistant message
        if (messages.at(-1)?.role === "assistant") messages.pop();
        const placeholder: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "...",
        };
        return { ...c, messages: [...messages, placeholder] };
      }),
    );
  }

  function setFeedback(chatId: string, msgId: string, feedback: "up" | "down") {
    setChats((prev) =>
      prev.map((c) =>
        c.id !== chatId
          ? c
          : {
              ...c,
              messages: c.messages.map((m) =>
                m.id === msgId ? { ...m, feedback } : m,
              ),
            },
      ),
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Chat list sidebar */}
          <div className="flex w-64 shrink-0 flex-col border-r">
            <div className="p-3">
              <Button size="sm" className="w-full" onClick={newChat}>
                <PlusIcon className="mr-1.5 size-4" />
                New Chat
              </Button>
            </div>
            <Separator />
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={cn(
                    "group hover:bg-accent flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    chat.id === activeChatId && "bg-accent font-medium",
                  )}
                >
                  <span className="flex-1 truncate">{chat.title}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 shrink-0 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  >
                    <TrashIcon className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Model indicator bar */}
            <div className="flex items-center justify-end border-b px-4 py-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => setIsModelOpen(true)}
              >
                <CpuIcon className="size-3.5" />
                {loadedModel?.name ?? "No model"}
                <CaretDownIcon className="size-3" />
              </Button>
            </div>

            {activeChat ? (
              <>
                {/* Messages */}
                <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                  {activeChat.messages.length === 0 && (
                    <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3">
                      <RobotIcon className="size-12" />
                      <p className="text-sm">Start a conversation</p>
                    </div>
                  )}
                  {activeChat.messages.map((msg, idx) => {
                    const prevUserMsg =
                      msg.role === "assistant"
                        ? activeChat.messages[idx - 1]
                        : undefined;
                    return (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        onResend={
                          prevUserMsg
                            ? () =>
                                resendLast(activeChatId, prevUserMsg.content)
                            : undefined
                        }
                        onFeedback={(f) => setFeedback(activeChatId, msg.id, f)}
                      />
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Textarea
                      placeholder="Message the assistant..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-20 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      disabled={!input.trim()}
                      onClick={() => sendMessage()}
                    >
                      <PaperPlaneRightIcon className="size-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground flex flex-1 items-center justify-center">
                <p className="text-sm">No chat selected. Create a new one.</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Model Manager Dialog */}
      <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CpuIcon className="size-4" />
              Model Manager
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {MODELS.map((model) => {
              const isLoaded = loadedModel?.id === model.id;
              return (
                <div
                  key={model.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 transition-colors",
                    isLoaded && "border-primary bg-primary/5",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{model.name}</p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {model.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLoaded && (
                      <Badge
                        variant="outline"
                        className="text-primary border-primary/40 text-xs"
                      >
                        Loaded
                      </Badge>
                    )}
                    {isLoaded ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setLoadedModel(undefined)}
                      >
                        <EjectIcon className="mr-1 size-3" />
                        Eject
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => {
                          setLoadedModel(model);
                          setIsModelOpen(false);
                        }}
                      >
                        Load
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
