import { CriteriaStatusDot } from "./CriteriaStatusDot";
import { PillarColumn } from "./PillarColumn";
import type { QuickProjectScanResult } from "../types";

type QuickProjectScanResultsProps = {
  result: QuickProjectScanResult;
  onStartAgain: () => void;
};

export function QuickProjectScanResults({ result, onStartAgain }: QuickProjectScanResultsProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Quick Project Scan
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight text-[#1f241f]">
              {result.projectName}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#5f5a50]">
              {result.interpretationNote}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-bold uppercase text-[#1f241f]">
            <span className="inline-flex items-center gap-2 rounded-md border border-[#d9d4c8] bg-white px-3 py-2">
              <CriteriaStatusDot status="likely-met" size="sm" />
              Likely met
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#d9d4c8] bg-white px-3 py-2">
              <CriteriaStatusDot status="opportunity" size="sm" />
              Opportunity
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#d9d4c8] bg-white px-3 py-2">
              <CriteriaStatusDot status="not-considered" size="sm" />
              Not considered
            </span>
          </div>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-lg border border-[#bfc1c1] md:grid-cols-2 xl:grid-cols-4">
        {result.pillars.map((pillar, index) => (
          <PillarColumn key={pillar.id} pillar={pillar} index={index} />
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onStartAgain}
          className="inline-flex items-center justify-center rounded-md border border-[#1f241f] px-5 py-3 text-sm font-extrabold text-[#1f241f] transition hover:bg-[#1f241f] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
        >
          Start again
        </button>
        <a
          href="/case-studies/submit/"
          className="inline-flex items-center justify-center rounded-md bg-[#28775e] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1f241f] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
        >
          Submit this project to the SD Standard Case Studies library
        </a>
      </div>
    </section>
  );
}
