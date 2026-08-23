import { PROJECT_CRITERIA_BY_ID, type CriterionPillarId } from "../criteria";
import type { CriterionStatus, SDStandardProject } from "../types";

export const selectComponentCount = (project: SDStandardProject) => project.components.length;
export const selectAssessmentCount = (project: SDStandardProject) => project.criteriaAssessments.length;
export const selectStrategyCount = (project: SDStandardProject) => project.criteriaAssessments.reduce((count, item) => count + item.strategies.length, 0);
export const selectUnreviewedAssessmentCount = (project: SDStandardProject) => project.criteriaAssessments.filter((item) => item.status === "not-reviewed").length;
export const selectComponentReferenceCount = (project: SDStandardProject, componentId: string) => project.criteriaAssessments.filter((item) => item.scope.level === "component" && item.scope.componentIds.includes(componentId)).length;
export function selectAssessmentsByPillar(project: SDStandardProject): Record<CriterionPillarId, number> {
  const result: Record<CriterionPillarId, number> = { environment: 0, society: 0, culture: 0, finance: 0 };
  project.criteriaAssessments.forEach((item) => { const definition = PROJECT_CRITERIA_BY_ID.get(item.criterionId); if (definition) result[definition.pillarId] += 1; });
  return result;
}
export function selectAssessmentsByStatus(project: SDStandardProject): Partial<Record<CriterionStatus, number>> {
  return project.criteriaAssessments.reduce<Partial<Record<CriterionStatus, number>>>((result, item) => ({ ...result, [item.status]: (result[item.status] ?? 0) + 1 }), {});
}
