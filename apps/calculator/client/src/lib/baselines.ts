import type { CriteriaDetail, ProjectSummary } from "@/lib/projects";

export type Source = {
  label: string;
  url: string;
};

export type BaselineSummary = {
  slug: string;
  title: string;
  summary: string;
  projectType: string;
  format: string;
  region: string;
  year: number;
  coverImage?: string;
  gallery: string[];
  pillars: string[];
  criteria: string[];
  sdgs: string[];
  rating: "Baseline" | "Improved" | "Best Practice" | "Experimental";
  estimatedCarbonKg?: number;
  estimatedWasteKg?: number;
  estimatedLifespanUses?: number;
  recyclability: "High" | "Medium" | "Low" | "Unknown";
  productionAssumptions: string[];
  materialAssumptions: string[];
  transportAssumptions: string[];
  disposalAssumptions: string[];
  evidenceNotes: string;
  sources: Source[];
  relatedProjects: string[];
  published: boolean;
  criteriaDetails: CriteriaDetail[];
};

export type BaselineDetail = BaselineSummary & {
  body: string;
  linkedProjects: ProjectSummary[];
};

export async function fetchBaselines() {
  const response = await fetch("/api/baselines");

  if (!response.ok) {
    throw new Error("Unable to load baselines");
  }

  const data = (await response.json()) as { baselines: BaselineSummary[] };
  return data.baselines;
}

export async function fetchBaseline(slug: string) {
  const response = await fetch(`/api/baselines/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    throw new Error("Unable to load baseline");
  }

  const data = (await response.json()) as { baseline: BaselineDetail };
  return data.baseline;
}

export function formatMetric(value: number | undefined, unit: string) {
  if (value === undefined || Number.isNaN(value)) {
    return "Not estimated";
  }

  return `${value.toLocaleString()} ${unit}`;
}
