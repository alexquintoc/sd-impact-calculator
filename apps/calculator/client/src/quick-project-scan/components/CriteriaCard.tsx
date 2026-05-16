import { CriteriaStatusDot, getStatusLabel } from "./CriteriaStatusDot";
import type { ScannedCriterion } from "../types";

type CriteriaCardProps = {
  criterion: ScannedCriterion;
};

export function CriteriaCard({ criterion }: CriteriaCardProps) {
  return (
    <article className="flex flex-col items-center text-center">
      <CriteriaStatusDot status={criterion.status} />
      <div className="mt-3 max-w-44">
        <p className="text-[11px] font-extrabold uppercase leading-tight text-black">
          {criterion.id}: {criterion.label}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase leading-tight text-black/70">
          {getStatusLabel(criterion.status)}
        </p>
        {criterion.matchedKeywords.length > 0 && (
          <p className="mt-2 text-[11px] font-medium leading-snug text-black/65">
            Matched: {criterion.matchedKeywords.join(", ")}
          </p>
        )}
      </div>
    </article>
  );
}
