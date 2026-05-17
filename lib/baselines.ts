import fs from "node:fs";
import path from "node:path";
import { parseMdx, type FrontmatterObject, type FrontmatterValue } from "./content";
import {
  getAllProjects,
  getCriteriaDetails,
  type CriteriaDetail,
  type ProjectSummary,
} from "./projects";

const baselinesDirectory = path.join(process.cwd(), "content", "baselines");

export type Source = {
  label: string;
  url: string;
};

export type BaselineFrontmatter = {
  title: string;
  slug: string;
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
};

export type Baseline = BaselineFrontmatter & {
  body: string;
  criteriaDetails: CriteriaDetail[];
  linkedProjects: ProjectSummary[];
};

export type BaselineSummary = BaselineFrontmatter & {
  criteriaDetails: CriteriaDetail[];
};

export function getAllBaselines() {
  if (!fs.existsSync(baselinesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(baselinesDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const fallbackSlug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(baselinesDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { frontmatter, body } = parseMdx(fileContents);
      const baseline = normalizeBaseline(frontmatter, fallbackSlug);

      return {
        ...baseline,
        body,
        criteriaDetails: getCriteriaDetails(baseline.criteria),
      };
    })
    .filter((baseline) => baseline.published)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function getBaseline(slug: string): Baseline | null {
  const baseline = getAllBaselines().find((item) => item.slug === slug);

  if (!baseline) {
    return null;
  }

  return {
    ...baseline,
    linkedProjects: getProjectsBySlugs(baseline.relatedProjects),
  };
}

export function getBaselinesBySlugs(slugs: string[]) {
  const slugSet = new Set(slugs);
  return getAllBaselines().filter((baseline) => slugSet.has(baseline.slug));
}

export function getBaselinesForProjectSlug(projectSlug: string) {
  const projects = getAllProjects();
  const project = projects.find((item) => item.slug === projectSlug);
  const explicitlyLinked = project?.relatedBaselines ?? [];

  return getAllBaselines().filter(
    (baseline) =>
      baseline.relatedProjects.includes(projectSlug) ||
      explicitlyLinked.includes(baseline.slug),
  );
}

function getProjectsBySlugs(slugs: string[]) {
  const slugSet = new Set(slugs);
  return getAllProjects().filter((project) => slugSet.has(project.slug));
}

function normalizeBaseline(
  frontmatter: Record<string, FrontmatterValue>,
  fallbackSlug: string,
): BaselineFrontmatter {
  return {
    title: String(frontmatter.title ?? "Untitled baseline"),
    slug: String(frontmatter.slug ?? fallbackSlug),
    summary: String(frontmatter.summary ?? ""),
    projectType: String(frontmatter.projectType ?? ""),
    format: String(frontmatter.format ?? ""),
    region: String(frontmatter.region ?? ""),
    year: Number(frontmatter.year ?? new Date().getFullYear()),
    coverImage: frontmatter.coverImage ? String(frontmatter.coverImage) : undefined,
    gallery: toStringList(frontmatter.gallery),
    pillars: toStringList(frontmatter.pillars),
    criteria: toStringList(frontmatter.criteria),
    sdgs: toStringList(frontmatter.sdgs),
    rating: String(frontmatter.rating ?? "Baseline") as BaselineFrontmatter["rating"],
    estimatedCarbonKg: toOptionalNumber(frontmatter.estimatedCarbonKg),
    estimatedWasteKg: toOptionalNumber(frontmatter.estimatedWasteKg),
    estimatedLifespanUses: toOptionalNumber(frontmatter.estimatedLifespanUses),
    recyclability: String(frontmatter.recyclability ?? "Unknown") as BaselineFrontmatter["recyclability"],
    productionAssumptions: toStringList(frontmatter.productionAssumptions),
    materialAssumptions: toStringList(frontmatter.materialAssumptions),
    transportAssumptions: toStringList(frontmatter.transportAssumptions),
    disposalAssumptions: toStringList(frontmatter.disposalAssumptions),
    evidenceNotes: String(frontmatter.evidenceNotes ?? ""),
    sources: toSources(frontmatter.sources),
    relatedProjects: toStringList(frontmatter.relatedProjects),
    published: Boolean(frontmatter.published),
  };
}

function toStringList(value: FrontmatterValue | undefined) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toSources(value: FrontmatterValue | undefined) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is FrontmatterObject => typeof item === "object")
    .map((item) => ({
      label: String(item.label ?? ""),
      url: String(item.url ?? ""),
    }))
    .filter((source) => source.label && source.url);
}

function toOptionalNumber(value: FrontmatterValue | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) return Number(value);
  return undefined;
}
