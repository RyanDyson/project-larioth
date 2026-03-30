"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import {
  CaretDownIcon,
  PlusIcon,
  SparkleIcon,
  TrashIcon,
} from "@phosphor-icons/react";

type PersonalityPreset = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

const PERSONALITY_PRESETS: PersonalityPreset[] = [
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm and conversational",
    prompt:
      "Respond in a friendly, approachable tone while staying helpful and clear.",
  },
  {
    id: "concise",
    label: "Concise",
    description: "Short and direct",
    prompt: "Be concise, direct, and avoid unnecessary detail.",
  },
  {
    id: "expert",
    label: "Expert",
    description: "Technical and precise",
    prompt:
      "Act like a subject matter expert. Be precise, technical, and thorough when needed.",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Flexible and idea-rich",
    prompt:
      "Offer creative options, interesting alternatives, and thoughtful ideas when relevant.",
  },
];

type PromptTemplate = {
  id: string;
  label: string;
  description: string;
  value: string;
};

const BASE_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "default",
    label: "Default",
    description: "General-purpose assistant behavior",
    value:
      "You are a helpful assistant. Answer clearly, accurately, and adapt your tone to the user's needs.",
  },
  {
    id: "developer",
    label: "Developer",
    description: "Good for coding and debugging",
    value:
      "You are a senior software engineer. Give practical implementation advice, identify edge cases, and prefer maintainable solutions.",
  },
  {
    id: "research",
    label: "Research",
    description: "Good for analysis and summaries",
    value:
      "You are a careful research assistant. Summarize thoughtfully, compare options, and note uncertainties when relevant.",
  },
  {
    id: "custom",
    label: "Custom",
    description: "Write your own prompt",
    value: "",
  },
];

type ChatSettingsDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  chatUuid: string;
  initialTitle?: string;
  refetch?: () => void;
};

export const ChatSettingsDialog = ({
  open,
  setOpen,
  initialTitle = "",
}: ChatSettingsDialogProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedPersonalityId, setSelectedPersonalityId] =
    useState("friendly");
  const [selectedPromptId, setSelectedPromptId] = useState("default");
  const [customPrompt, setCustomPrompt] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const selectedPersonality = useMemo(
    () =>
      PERSONALITY_PRESETS.find(
        (preset) => preset.id === selectedPersonalityId,
      ) ?? PERSONALITY_PRESETS[0],
    [selectedPersonalityId],
  );

  const selectedTemplate = useMemo(
    () =>
      BASE_PROMPT_TEMPLATES.find(
        (template) => template.id === selectedPromptId,
      ) ?? BASE_PROMPT_TEMPLATES[0],
    [selectedPromptId],
  );

  const basePrompt =
    selectedPromptId === "custom" ? customPrompt : selectedTemplate.value;

  const combinedPrompt = useMemo(() => {
    const parts = [
      basePrompt.trim(),
      selectedPersonality.prompt.trim(),
      extraNotes.trim(),
    ].filter(Boolean);

    return parts.join("\n\n");
  }, [basePrompt, extraNotes, selectedPersonality.prompt]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-h-[90vh] w-full min-w-4xl overflow-hidden p-0">
        <AlertDialogHeader className="border-border border-b px-5 py-4">
          <h3 className="text-lg font-semibold">Chat Settings</h3>
          <p className="text-muted-foreground text-sm">
            Configure the tone, prompt, and behavior for this chat.
          </p>
        </AlertDialogHeader>

        <div className="grid gap-0 md:grid-cols-[1fr_1.15fr]">
          {/* Left column */}
          <div className="space-y-5 p-5">
            <div className="space-y-2">
              <label htmlFor="chat-title" className="text-sm font-medium">
                Chat title
              </label>
              <Input
                id="chat-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter chat title"
                autoComplete="off"
              />
              <p className="text-muted-foreground text-xs">
                This is the visible name of the conversation.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Personality</h4>
                  <p className="text-muted-foreground text-xs">
                    Choose how the assistant should sound.
                  </p>
                </div>
                <SparkleIcon className="text-primary size-4" />
              </div>

              <div className="grid gap-2">
                {PERSONALITY_PRESETS.map((preset) => {
                  const active = preset.id === selectedPersonalityId;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPersonalityId(preset.id)}
                      className={`border-border bg-background hover:bg-accent/40 flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        active ? "border-primary/40 bg-primary/5" : ""
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {preset.label}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {preset.description}
                        </p>
                      </div>
                      <CaretDownIcon
                        className={`text-muted-foreground size-4 shrink-0 transition-transform ${
                          active ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="extra-notes" className="text-sm font-medium">
                Extra notes
              </label>
              <Textarea
                id="extra-notes"
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="Add special rules, formatting preferences, or reminders..."
                className="min-h-28 resize-y"
              />
              <p className="text-muted-foreground text-xs">
                Optional instructions layered on top of the base prompt.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="border-border border-t p-5 md:border-t-0 md:border-l">
            <div className="space-y-5">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium">Base prompt</h4>
                  <p className="text-muted-foreground text-xs">
                    Start from a template or switch to custom.
                  </p>
                </div>

                <div className="grid gap-2">
                  {BASE_PROMPT_TEMPLATES.map((template) => {
                    const active = template.id === selectedPromptId;

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          setSelectedPromptId(template.id);
                          if (template.id === "custom" && !customPrompt) {
                            setCustomPrompt(template.value);
                          }
                        }}
                        className={`border-border bg-background hover:bg-accent/40 flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          active ? "border-primary/40 bg-primary/5" : ""
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {template.label}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {template.description}
                          </p>
                        </div>
                        <CaretDownIcon
                          className={`text-muted-foreground size-4 shrink-0 transition-transform ${
                            active ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="base-prompt" className="text-sm font-medium">
                  Prompt content
                </label>
                <Textarea
                  id="base-prompt"
                  value={basePrompt}
                  onChange={(e) => {
                    setSelectedPromptId("custom");
                    setCustomPrompt(e.target.value);
                  }}
                  placeholder="Write the base system prompt here..."
                  className="min-h-52 resize-y"
                />
                <p className="text-muted-foreground text-xs">
                  This is the core behavior the model should follow.
                </p>
              </div>

              <div className="border-border bg-muted/20 rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Live preview</h4>
                    <p className="text-muted-foreground text-xs">
                      A combined preview of the current settings.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 rounded-md border p-3">
                  <p className="text-foreground text-sm font-medium">
                    {title.trim() || "Untitled chat"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {selectedPersonality.label} • {selectedTemplate.label}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap">
                    {combinedPrompt || "No prompt configured yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="border-border border-t px-5 py-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="gradient">Save Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
