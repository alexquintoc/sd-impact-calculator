import { CriteriaCard } from "./CriteriaCard";
import type { ScannedPillar } from "../types";

type PillarColumnProps = {
  pillar: ScannedPillar;
  index: number;
};

export function PillarColumn({ pillar, index }: PillarColumnProps) {
  const background = index % 2 === 0 ? "bg-[#d1d3d3]" : "bg-[#e5e6e7]";

  return (
    <section className={`${background} min-h-[34rem] px-5 py-10`}>
      <h2 className="text-center text-2xl font-extrabold uppercase leading-tight tracking-normal text-black">
        {pillar.label.replace(" Criteria", "")}
      </h2>

      <div className="mt-14 flex flex-col items-center gap-11">
        {pillar.criteria.map((criterion) => (
          <CriteriaCard key={criterion.id} criterion={criterion} />
        ))}
      </div>
    </section>
  );
}
