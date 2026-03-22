import { useState } from "react";
import { ExternalLink, Info } from "lucide-react";
import { getCriterionDocMeta } from "@/lib/criteria-docs";

type CriterionInfoButtonProps = {
  criterionId: string;
  criterionLabel: string;
};

export function CriterionInfoButton({
  criterionId,
  criterionLabel,
}: CriterionInfoButtonProps) {
  const [open, setOpen] = useState(false);
  const doc = getCriterionDocMeta(criterionId);

  if (!doc) return null;

  return (
    <div
      className="relative inline-flex shrink-0 pb-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label={`More information about ${criterionLabel}`}
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0 w-80 rounded-xl border bg-background p-3 shadow-xl">
          <div className="mb-1 text-sm font-semibold text-foreground">
            {doc.label}
          </div>

          <div className="mb-2 text-xs text-muted-foreground">
            {doc.pillarLabel} · {doc.points} pts
          </div>

          <p className="mb-3 text-sm leading-5 text-muted-foreground">
            {doc.summary || doc.description || "Open the full reference page."}
          </p>

          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline"
          >
            Open full reference
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}