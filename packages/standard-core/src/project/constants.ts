import type { AssessmentResponse, CriterionRelevance, CriterionStatus, ProjectStage, StrategyStatus } from "./types";

export const PROJECT_SCHEMA_NAME = "sd-standard-project" as const;
export const PROJECT_SCHEMA_VERSION = "0.1.0" as const;
export const SUPPORTED_PROJECT_SCHEMA_VERSIONS = [PROJECT_SCHEMA_VERSION] as const;
export const CRITERIA_VERSION = "criteria-v2";
export const CRITERIA_SOURCE = "criteria.v2.json";
export const PROJECT_STORAGE_KEY = "sd-standard:project:v0.1";
export const PROJECT_STAGES: readonly ProjectStage[] = ["idea", "brief", "planning", "design-development", "production", "active-use", "completed", "post-project-review"];
export const CRITERION_RELEVANCE_VALUES: readonly CriterionRelevance[] = ["unknown", "low", "medium", "high", "not-applicable"];
export const CRITERION_STATUS_VALUES: readonly CriterionStatus[] = ["not-reviewed", "considering", "planned", "in-progress", "completed", "not-applicable"];
export const ASSESSMENT_RESPONSE_VALUES: readonly AssessmentResponse[] = ["not-assessed", "baseline", "improved", "verified", "modeled"];
export const STRATEGY_STATUS_VALUES: readonly StrategyStatus[] = ["suggested", "considering", "selected", "in-progress", "completed", "rejected"];
export const SUGGESTED_COMPONENT_TYPES = ["print", "digital", "website", "publication", "packaging", "exhibition", "installation-component", "signage", "identity", "campaign", "motion", "event", "other"] as const;
