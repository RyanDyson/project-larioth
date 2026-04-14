import {
  CompassIcon,
  CodeIcon,
  GraduationCapIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function Page() {
  const categories = [
    { label: "Create", icon: <SparkleIcon className="size-4" /> },
    { label: "Explore", icon: <CompassIcon className="size-4" /> },
    { label: "Code", icon: <CodeIcon className="size-4" /> },
    { label: "Learn", icon: <GraduationCapIcon className="size-4" /> },
  ];

  const prompts = [
    "How does AI work?",
    "Are black holes real?",
    'How many Rs are in the word "strawberry"?',
    "What is the meaning of life?",
  ];

  return (
    <div className="relative flex h-[calc(100vh-var(--header-height))] w-full items-center justify-center overflow-hidden px-6 py-10">
      <div className="border-boder bg-background relative z-10 w-full max-w-3xl rounded-3xl border p-8 md:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-4xl">
          How can I help you today?
        </h1>

        <div className="mt-7 flex flex-wrap gap-2">
          {categories.map((item) => {
            return (
              <Button
                key={item.label}
                variant="outline"
                className="h-9 rounded-full px-4 text-sm"
              >
                {item.icon}
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="bg-card border-border mt-8 overflow-hidden rounded-2xl border">
          {prompts.map((prompt, index) => (
            <button
              type="button"
              key={prompt}
              className={`w-full px-5 py-3.5 text-left text-base transition-colors ${
                index < prompts.length - 1 ? "border-border border-b" : ""
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
