import criteriaData from "../criteria.v2.json";

type CriterionRecord = { id?: unknown };
type PillarRecord = { criteria?: unknown };

export type CriterionPillarId = "environment" | "society" | "culture" | "finance";
export interface ProjectCriterionDefinition {
  id: string;
  displayId: string;
  label: string;
  description: string;
  summary: string;
  pillarId: CriterionPillarId;
  pillarLabel: string;
  category: string;
  level: string;
}

function collectCriterionIds(value: unknown): Set<string> {
  const ids = new Set<string>();
  if (!value || typeof value !== "object") return ids;
  const pillars = (value as { pillars?: unknown }).pillars;
  if (!Array.isArray(pillars)) return ids;
  for (const pillar of pillars as PillarRecord[]) {
    if (!Array.isArray(pillar.criteria)) continue;
    for (const criterion of pillar.criteria as CriterionRecord[]) {
      if (typeof criterion.id === "string") ids.add(criterion.id);
    }
  }
  return ids;
}

export const PROJECT_CRITERION_IDS: ReadonlySet<string> = collectCriterionIds(criteriaData);

export const PROJECT_CRITERIA_CATALOG: readonly ProjectCriterionDefinition[] = (criteriaData.pillars as Array<{
  id: CriterionPillarId;
  label: string;
  criteria: Array<{ id: string; displayId?: string; label: string; description?: string; summary?: string; category?: string; level?: string }>;
}>).flatMap((pillar) => pillar.criteria.map((criterion) => ({
  id: criterion.id,
  displayId: criterion.displayId ?? criterion.id,
  label: criterion.label,
  description: criterion.description ?? "",
  summary: criterion.summary ?? criterion.description ?? "",
  pillarId: pillar.id,
  pillarLabel: pillar.label,
  category: criterion.category ?? "",
  level: criterion.level ?? "project",
})));

export const PROJECT_CRITERIA_BY_ID: ReadonlyMap<string, ProjectCriterionDefinition> = new Map(
  PROJECT_CRITERIA_CATALOG.map((criterion) => [criterion.id, criterion])
);
