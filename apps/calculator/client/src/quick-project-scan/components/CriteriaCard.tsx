import { ExternalLink } from "lucide-react";
import { CriteriaStatusDot, getStatusLabel } from "./CriteriaStatusDot";
import type { ImpactSnapshotCriterion } from "../types";

type CriteriaCardProps = {
  criterion: ImpactSnapshotCriterion;
};

export function CriteriaCard({ criterion }: CriteriaCardProps) {
  return (
    <article className="rounded-lg border border-[#d9d4c8] bg-white p-4">
      <div className="flex items-start gap-3">
        <CriteriaStatusDot status={criterion.status} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-[#28775e]">
                {criterion.pillarLabel} &middot; {getStatusLabel(criterion.status)}
              </p>
              <h3 className="mt-1 text-base font-extrabold leading-6 text-[#1f241f]">
                {criterion.id}: {criterion.label}
              </h3>
            </div>
            <span className="shrink-0 rounded-full bg-[#f0eee7] px-3 py-1 text-xs font-extrabold text-[#5f5a50]">
              {Math.round(criterion.confidence * 100)}% confidence
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#5f5a50]">{criterion.rationale}</p>

          {criterion.evidence && (
            <p className="mt-3 rounded-md bg-[#f7f5ef] px-3 py-2 text-sm font-medium leading-6 text-[#4f4a42]">
              Evidence: "{criterion.evidence}"
            </p>
          )}

          {criterion.knowledgeBaseUrl && (
            <a
              href={criterion.knowledgeBaseUrl}
              className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-[#28775e] underline-offset-4 hover:underline"
            >
              Review criterion
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
