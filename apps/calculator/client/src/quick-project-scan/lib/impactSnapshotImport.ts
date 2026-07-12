import type { CalculatorCriteriaData } from "@/calculator/registry";
import { analyzeProjectDescription } from "./scanProjectDescription";
import type {
  ImpactSnapshot,
  ImpactSnapshotCriterion,
  ImpactSnapshotPillarId,
  ImpactSnapshotPillarSummary,
  ImpactSnapshotStatus,
} from "../types";

export const IMPACT_SNAPSHOT_SCHEMA = "sd-standard-impact-snapshot-v1" as const;
export const IMPACT_SNAPSHOT_SCHEMA_VERSION = 1 as const;
export const MAX_IMPACT_SNAPSHOT_IMPORT_BYTES = 2 * 1024 * 1024;

const VALID_PILLAR_IDS: ImpactSnapshotPillarId[] = [
  "environment",
  "society",
  "culture",
  "finance",
];
const VALID_STATUSES: ImpactSnapshotStatus[] = ["likely", "possible", "not_enough_evidence"];

export type ImpactSnapshotImportWarning =
  | {
      type: "criteria-version-mismatch";
      importedCriteriaVersion: string | null;
      currentCriteriaVersion: string;
    }
  | {
      type: "unknown-criteria";
      criterionIds: string[];
    };

export type ValidatedImpactSnapshotImport = {
  snapshot: ImpactSnapshot;
  warnings: ImpactSnapshotImportWarning[];
  importedCriteriaVersion: string | null;
  unknownCriterionIds: string[];
};

export type ImpactSnapshotImportResult =
  | {
      ok: true;
      value: ValidatedImpactSnapshotImport;
    }
  | {
      ok: false;
      reason:
        | "invalid-json"
        | "invalid-structure"
        | "missing-required-fields"
        | "incorrect-field-types"
        | "unsupported-schema-version";
      details: string[];
    };

export type ImpactSnapshotImportFailureReason = Extract<
  ImpactSnapshotImportResult,
  { ok: false }
>["reason"];

type ValidationContext = {
  currentCriteriaVersion: string;
  validCriterionIds: Set<string>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDateLike(value: string) {
  return !Number.isNaN(Date.parse(value));
}

function isFiniteNumberInRange(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function isNonNegativeInteger(value: unknown) {
  return Number.isInteger(value) && Number(value) >= 0;
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getNullableString(value: unknown) {
  return value === null || typeof value === "string" ? value : undefined;
}

export function getImpactSnapshotCriteriaVersion(criteriaData: CalculatorCriteriaData) {
  return criteriaData.version ?? criteriaData.standard?.standardVersion ?? "unknown";
}

export function getImpactSnapshotCriterionIds(criteriaData: CalculatorCriteriaData) {
  return new Set(
    criteriaData.pillars.flatMap((pillar) =>
      pillar.criteria.flatMap((rawCriterion) => {
        const criterion = rawCriterion as unknown as Record<string, unknown>;
        return [criterion.displayId, criterion.legacyId, criterion.id].filter(
          (value): value is string => typeof value === "string" && value.length > 0
        );
      })
    )
  );
}

export function serializeImpactSnapshot(
  snapshot: ImpactSnapshot,
  criteriaVersion: string,
  exportedAt = new Date().toISOString()
): ImpactSnapshot {
  return {
    ...snapshot,
    schema: IMPACT_SNAPSHOT_SCHEMA,
    schemaVersion: IMPACT_SNAPSHOT_SCHEMA_VERSION,
    criteriaVersion,
    exportedAt,
  };
}

function validatePillarSummary(value: unknown, path: string, errors: string[]) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }

  const likely = value.likely;
  const possible = value.possible;
  if (!isNonNegativeInteger(likely)) errors.push(`${path}.likely must be a non-negative integer.`);
  if (!isNonNegativeInteger(possible)) errors.push(`${path}.possible must be a non-negative integer.`);

  return isNonNegativeInteger(likely) && isNonNegativeInteger(possible);
}

function validateSummary(value: unknown, errors: string[]) {
  if (!isObject(value)) {
    errors.push("summary must be an object.");
    return false;
  }

  if (!isNonNegativeInteger(value.totalLikelyCriteria)) {
    errors.push("summary.totalLikelyCriteria must be a non-negative integer.");
  }
  if (!isNonNegativeInteger(value.totalPossibleCriteria)) {
    errors.push("summary.totalPossibleCriteria must be a non-negative integer.");
  }

  if (!isObject(value.pillars)) {
    errors.push("summary.pillars must be an object.");
    return false;
  }

  const pillarResults = VALID_PILLAR_IDS.map((pillarId) =>
    validatePillarSummary(
      (value.pillars as Record<string, unknown>)[pillarId],
      `summary.pillars.${pillarId}`,
      errors
    )
  );

  return (
    isNonNegativeInteger(value.totalLikelyCriteria) &&
    isNonNegativeInteger(value.totalPossibleCriteria) &&
    pillarResults.every(Boolean)
  );
}

function validateProject(value: unknown, errors: string[]) {
  if (!isObject(value)) {
    errors.push("project must be an object.");
    return false;
  }

  if (typeof value.description !== "string" || value.description.trim().length === 0) {
    errors.push("project.description must be a non-empty string.");
  }
  if (getNullableString(value.inferredTitle) === undefined) {
    errors.push("project.inferredTitle must be a string or null.");
  }
  if (getNullableString(value.inferredProjectType) === undefined) {
    errors.push("project.inferredProjectType must be a string or null.");
  }
  if (getNullableString(value.inferredFormat) === undefined) {
    errors.push("project.inferredFormat must be a string or null.");
  }

  return (
    typeof value.description === "string" &&
    value.description.trim().length > 0 &&
    getNullableString(value.inferredTitle) !== undefined &&
    getNullableString(value.inferredProjectType) !== undefined &&
    getNullableString(value.inferredFormat) !== undefined
  );
}

function validateCriterion(value: unknown, index: number, errors: string[]) {
  const path = `criteria[${index}]`;
  if (!isObject(value)) {
    errors.push(`${path} must be an object.`);
    return null;
  }

  const criterionErrors: string[] = [];
  const id = getString(value.id);
  const label = getString(value.label);
  const pillarLabel = getString(value.pillarLabel);
  const rationale = getString(value.rationale);
  const evidence = getNullableString(value.evidence);
  const knowledgeBaseUrl = getNullableString(value.knowledgeBaseUrl);

  if (!id) criterionErrors.push(`${path}.id must be a string.`);
  if (!label) criterionErrors.push(`${path}.label must be a string.`);
  if (!VALID_PILLAR_IDS.includes(value.pillarId as ImpactSnapshotPillarId)) {
    criterionErrors.push(`${path}.pillarId must be a known pillar id.`);
  }
  if (!pillarLabel) criterionErrors.push(`${path}.pillarLabel must be a string.`);
  if (!VALID_STATUSES.includes(value.status as ImpactSnapshotStatus)) {
    criterionErrors.push(`${path}.status must be a supported status.`);
  }
  if (!isFiniteNumberInRange(value.confidence, 0, 1)) {
    criterionErrors.push(`${path}.confidence must be a finite number from 0 to 1.`);
  }
  if (!rationale) criterionErrors.push(`${path}.rationale must be a string.`);
  if (evidence === undefined) criterionErrors.push(`${path}.evidence must be a string or null.`);
  if (knowledgeBaseUrl === undefined) {
    criterionErrors.push(`${path}.knowledgeBaseUrl must be a string or null.`);
  }

  errors.push(...criterionErrors);
  if (criterionErrors.length > 0 || !id || !label || !pillarLabel || !rationale) return null;

  return value as ImpactSnapshotCriterion;
}

export function validateImpactSnapshotImport(
  value: unknown,
  context: ValidationContext
): ImpactSnapshotImportResult {
  const errors: string[] = [];

  if (!isObject(value)) {
    return { ok: false, reason: "invalid-structure", details: ["Root value must be an object."] };
  }

  if (value.schema !== IMPACT_SNAPSHOT_SCHEMA) {
    return {
      ok: false,
      reason: "invalid-structure",
      details: ["File schema does not match an Impact Snapshot export."],
    };
  }

  if (value.schemaVersion !== undefined && value.schemaVersion !== IMPACT_SNAPSHOT_SCHEMA_VERSION) {
    return {
      ok: false,
      reason: "unsupported-schema-version",
      details: ["Only Impact Snapshot schema version 1 is supported."],
    };
  }

  const generatedAt = getString(value.generatedAt);
  if (!generatedAt || !isIsoDateLike(generatedAt)) {
    errors.push("generatedAt must be an ISO-8601 timestamp string.");
  }
  if (value.exportedAt !== undefined) {
    const exportedAt = getString(value.exportedAt);
    if (!exportedAt || !isIsoDateLike(exportedAt)) {
      errors.push("exportedAt must be an ISO-8601 timestamp string.");
    }
  }
  if (value.criteriaVersion !== undefined && typeof value.criteriaVersion !== "string") {
    errors.push("criteriaVersion must be a string when present.");
  }
  if (value.assessmentType !== "ai-assisted-self-assessment") {
    errors.push("assessmentType must match an Impact Snapshot self-assessment export.");
  }

  const projectOk = validateProject(value.project, errors);
  const summaryOk = validateSummary(value.summary, errors);
  if (!Array.isArray(value.criteria)) {
    errors.push("criteria must be an array.");
  }
  if (!Array.isArray(value.missingInformation)) {
    errors.push("missingInformation must be an array.");
  } else if (!value.missingInformation.every((item) => typeof item === "string")) {
    errors.push("missingInformation must contain only strings.");
  }
  if (typeof value.disclaimer !== "string" || value.disclaimer.length === 0) {
    errors.push("disclaimer must be a string.");
  }

  const criteria = Array.isArray(value.criteria)
    ? value.criteria
        .map((criterion, index) => validateCriterion(criterion, index, errors))
        .filter((criterion): criterion is ImpactSnapshotCriterion => criterion !== null)
    : [];

  if (errors.length > 0 || !projectOk || !summaryOk) {
    const missingRequired = errors.some((error) => error.includes("must be an object") || error.includes("must be a non-empty"));
    return {
      ok: false,
      reason: missingRequired ? "missing-required-fields" : "incorrect-field-types",
      details: errors,
    };
  }

  const unknownCriterionIds = criteria
    .map((criterion) => criterion.id)
    .filter((id) => !context.validCriterionIds.has(id));
  const uniqueUnknownCriterionIds = Array.from(new Set(unknownCriterionIds));
  const importedCriteriaVersion = getString(value.criteriaVersion);
  const warnings: ImpactSnapshotImportWarning[] = [];

  if (importedCriteriaVersion && importedCriteriaVersion !== context.currentCriteriaVersion) {
    warnings.push({
      type: "criteria-version-mismatch",
      importedCriteriaVersion,
      currentCriteriaVersion: context.currentCriteriaVersion,
    });
  }

  if (uniqueUnknownCriterionIds.length > 0) {
    warnings.push({ type: "unknown-criteria", criterionIds: uniqueUnknownCriterionIds });
  }

  return {
    ok: true,
    value: {
      snapshot: value as ImpactSnapshot,
      warnings,
      importedCriteriaVersion,
      unknownCriterionIds: uniqueUnknownCriterionIds,
    },
  };
}

export function parseImpactSnapshotImport(
  text: string,
  context: ValidationContext
): ImpactSnapshotImportResult {
  try {
    return validateImpactSnapshotImport(JSON.parse(text), context);
  } catch {
    return {
      ok: false,
      reason: "invalid-json",
      details: ["The selected file could not be parsed as JSON."],
    };
  }
}

export function restoreImpactSnapshotState(
  imported: ValidatedImpactSnapshotImport,
  criteriaData: CalculatorCriteriaData
): ImpactSnapshot {
  const recalculated = analyzeProjectDescription(imported.snapshot.project.description.trim(), criteriaData);
  const importedSummary = imported.snapshot.summary as {
    pillars: Record<ImpactSnapshotPillarId, ImpactSnapshotPillarSummary>;
  };

  return {
    ...recalculated,
    generatedAt: imported.snapshot.generatedAt,
    schemaVersion: IMPACT_SNAPSHOT_SCHEMA_VERSION,
    criteriaVersion: getImpactSnapshotCriteriaVersion(criteriaData),
    exportedAt: imported.snapshot.exportedAt,
    // Keep generated summaries from the current criteria data. This local read makes the migration
    // decision explicit and avoids accidentally trusting stale derived totals.
    summary: recalculated.summary ?? importedSummary,
  };
}
