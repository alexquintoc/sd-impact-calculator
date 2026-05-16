import { useMemo, useState } from "react";
import { calculatorVersions } from "@/calculator/registry";
import { QuickProjectScanForm } from "@/quick-project-scan/components/QuickProjectScanForm";
import { QuickProjectScanResults } from "@/quick-project-scan/components/QuickProjectScanResults";
import { scanProjectDescription } from "@/quick-project-scan/lib/scanProjectDescription";
import type { QuickProjectScanInput, QuickProjectScanResult } from "@/quick-project-scan/types";

const EMPTY_SCAN_INPUT: QuickProjectScanInput = {
  projectName: "",
  projectCategory: "",
  projectType: "",
  projectFormat: "",
  description: "",
};

export default function QuickProjectScan() {
  const criteriaData = calculatorVersions.v2.criteria;
  const [formValue, setFormValue] = useState<QuickProjectScanInput>(EMPTY_SCAN_INPUT);
  const [result, setResult] = useState<QuickProjectScanResult | null>(null);

  const criteriaCount = useMemo(
    () => criteriaData.pillars.reduce((total, pillar) => total + pillar.criteria.length, 0),
    [criteriaData]
  );

  const handleSubmit = () => {
    setResult(scanProjectDescription(formValue, criteriaData));
  };

  const handleStartAgain = () => {
    setFormValue(EMPTY_SCAN_INPUT);
    setResult(null);
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
              Quick Project Scan
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f5a50]">
              Scan an early project description against the Environmental, Social, Cultural,
              and Financial pillars before moving into a full calculator review.
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
            criteriaData={criteriaData}
            value={formValue}
            onChange={setFormValue}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
}
