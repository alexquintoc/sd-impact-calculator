import { useMemo, useState } from "react";
import { calculatorVersions } from "@/calculator/registry";
import { QuickProjectScanForm } from "@/quick-project-scan/components/QuickProjectScanForm";
import { QuickProjectScanResults } from "@/quick-project-scan/components/QuickProjectScanResults";
import { analyzeProjectDescription } from "@/quick-project-scan/lib/scanProjectDescription";
import type { ImpactSnapshot } from "@/quick-project-scan/types";

const STORAGE_KEY = "sd-standard-impact-snapshot:last";

export default function QuickProjectScan() {
  const criteriaData = calculatorVersions.v2.criteria;
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ImpactSnapshot | null>(null);

  const criteriaCount = useMemo(
    () => criteriaData.pillars.reduce((total, pillar) => total + pillar.criteria.length, 0),
    [criteriaData]
  );

  const handleSubmit = () => {
    const snapshot = analyzeProjectDescription(description.trim(), criteriaData);
    setResult(snapshot);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  };

  const handleStartAgain = () => {
    setDescription("");
    setResult(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <a
              href="/"
              className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e] hover:text-[#1f241f]"
            >
              SD Standard
            </a>
            <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
              SD Standard Impact Snapshot
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f5a50]">
              Describe a design project in your own words. The tool will map the project against
              the SD Standard criteria and generate a simple four-pillar snapshot across
              Environment, Society, Culture, and Finance.
            </p>
          </div>
          <p className="max-w-xs rounded-md border border-[#d9d4c8] bg-[#fffdf8] px-4 py-3 text-sm font-bold leading-6 text-[#5f5a50]">
            Using SD Standard v2 draft data with {criteriaCount} criteria available.
          </p>
        </header>

        {result ? (
          <QuickProjectScanResults result={result} onStartAgain={handleStartAgain} />
        ) : (
          <QuickProjectScanForm
            value={description}
            onChange={setDescription}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
}
