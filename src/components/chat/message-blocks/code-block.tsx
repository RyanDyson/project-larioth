import { a11yDark, CodeBlock as Base } from "react-code-blocks";
import { CopyButton } from "@/components/global/copy-button";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <div className="border-primary/30 bg-background my-3 overflow-hidden rounded-xl border shadow-sm">
      <div className="from-primary/10 to-primary/20 text-muted-foreground border-primary/30 flex items-center justify-between gap-3 border-b bg-linear-to-b px-3 py-2 text-sm">
        <span>{language}</span>
        <CopyButton code={code} label={language} className="relative" />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <Base
          language={language}
          showLineNumbers
          customStyle={{
            background: "transparent",
            border: "none",
            borderRadius: "0",
            padding: "0",
          }}
          theme={a11yDark}
        />
      </pre>
    </div>
  );
}
