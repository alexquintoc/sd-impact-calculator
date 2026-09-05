import source from "../../../../../packages/standard-core/src/criteria.v2.json";
import translations from "../../../../../packages/standard-core/src/i18n/criteria.es.json";
import { getCriterionDocMeta } from "@/lib/criteria-docs";

export type SpanishTranslation = { label: string; summary: string };
export const spanishCriteria: Record<string, SpanishTranslation> = translations;
export const publicCriteria = source.pillars.flatMap(pillar => pillar.criteria.map(criterion => ({
  ...criterion, displayId: criterion.displayId || criterion.id,
  pillarId: pillar.id, pillarLabel: pillar.label,
  url: getCriterionDocMeta(criterion.id)?.url ?? "",
})));
export function scopeLabel(appliesTo: readonly string[], spanish = false) {
  if (!appliesTo.length || appliesTo.some(value => value !== "project" && value !== "designingEntity")) throw new Error("Unknown criterion applicability");
  return [appliesTo.includes("project") ? (spanish ? "Proyecto" : "Project") : "", appliesTo.includes("designingEntity") ? (spanish ? "Entidad de diseño" : "Design entity") : ""].filter(Boolean).join(" + ");
}
export function localizedCriterion(item: typeof publicCriteria[number], spanish: boolean, dictionary = spanishCriteria) {
  const translation = spanish ? dictionary[item.id] : undefined;
  return { label: translation?.label || item.label, summary: translation?.summary || item.summary, fallback: spanish && (!translation?.label || !translation?.summary) };
}
export function filterCriteria(query: string, pillar: string, spanish = false) {
  const needle = query.trim().toLocaleLowerCase();
  return publicCriteria.filter(item => {
    const copy = localizedCriterion(item, spanish);
    return (pillar === "all" || item.pillarId === pillar) && `${item.id} ${item.displayId} ${item.label} ${item.summary} ${copy.label} ${copy.summary}`.toLocaleLowerCase().includes(needle);
  });
}
