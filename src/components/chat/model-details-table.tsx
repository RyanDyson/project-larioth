import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type DetailsRow } from "./model-columns";

type FieldConfig = {
  label: string;
  render: (value: NonNullable<DetailsRow[keyof DetailsRow]>) => React.ReactNode;
};

const FIELD_CONFIG: Partial<Record<keyof DetailsRow, FieldConfig>> = {
  modelKey: {
    label: "Model Key",
    render: (v) => (
      <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[11px]">
        {v as string}
      </code>
    ),
  },
  architecture: {
    label: "Architecture",
    render: (v) => <span>{v as string}</span>,
  },
  format: {
    label: "Format",
    render: (v) => (
      <Badge variant="outline" className="tracking-wide uppercase">
        {v as string}
      </Badge>
    ),
  },
  paramsString: {
    label: "Parameters",
    render: (v) => <span>{v as string}</span>,
  },
  vision: {
    label: "Vision",
    render: (v) =>
      v ? (
        <Badge variant="default">Yes</Badge>
      ) : (
        <Badge variant="outline">No</Badge>
      ),
  },
  trainedForToolUse: {
    label: "Tool Use",
    render: (v) =>
      v ? (
        <Badge variant="default">Yes</Badge>
      ) : (
        <Badge variant="outline">No</Badge>
      ),
  },
  path: {
    label: "Path",
    render: (v) => (
      <code className="text-muted-foreground font-mono text-[10px] leading-relaxed break-all">
        {v as string}
      </code>
    ),
  },
};

// Render fields in a stable, intentional order
const FIELD_ORDER: (keyof DetailsRow)[] = [
  "modelKey",
  "architecture",
  "format",
  "paramsString",
  "vision",
  "trainedForToolUse",
  "path",
];

export function ModelDetailsTable({ details }: { details: DetailsRow }) {
  const entries = FIELD_ORDER.flatMap((key) => {
    const value = details[key];
    const config = FIELD_CONFIG[key];
    if (value == null || !config) return [];
    return [{ key, label: config.label, node: config.render(value) }];
  });

  if (entries.length === 0) return null;

  return (
    <div className="w-full max-w-xs min-w-64">
      {entries.map(({ key, label, node }, i) => (
        <div
          key={key}
          className={cn(
            "grid grid-cols-[6.5rem_1fr] items-start gap-x-3 px-3 py-2",
            i !== entries.length - 1 && "border-border border-b",
          )}
        >
          <span className="text-muted-foreground pt-px text-xs leading-normal">
            {label}
          </span>
          <span className="text-foreground flex min-w-0 flex-wrap items-center text-xs leading-normal">
            {node}
          </span>
        </div>
      ))}
    </div>
  );
}
