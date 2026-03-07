export type PillarId =
  | "environment"
  | "social"
  | "cultural"
  | "financial";

export type DisciplineId =
  | "web"
  | "ui"
  | "ux"
  | "graphic"
  | "editorial"
  | "packaging"
  | "motion"
  | "product"
  | "brand"
  | "service"
  | "mixed";

export interface Criterion {
  id: string;
  title: string;
  pillar: PillarId;
  description: string;
  guidance?: string;
  appliesTo?: DisciplineId[];
  tags?: string[];
  sdgs?: number[];
  version?: string;
}