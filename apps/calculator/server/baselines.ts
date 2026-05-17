import fs from "fs";
import path from "path";
import {
  parseMdx,
  toOptionalNumber,
  toStringList,
  type FrontmatterObject,
  type FrontmatterValue,
} from "./content";
import {
  getAllProjects,
  getCriteriaDetails,
  type CriteriaDetail,
  type ProjectSummary,
} from "./projects";

const baselinesDirectory = path.resolve(process.cwd(), "..", "..", "content", "baselines");

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

export function getAllBaselines(): BaselineSummary[] {
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
      const { frontmatter } = parseMdx(fileContents);
      const baseline = normalizeBaseline(frontmatter, fallbackSlug);

      return {
        ...baseline,
        criteriaDetails: getCriteriaDetails(baseline.criteria),
      };
    })
    .filter((baseline) => baseline.published)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function getBaseline(slug: string): BaselineDetail | null {
  const baseline = getAllBaselines().find((item) => item.slug === slug);

  if (!baseline) {
    return null;
  }

  const filePath = path.join(baselinesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { body } = parseMdx(fileContents);

  return {
    ...baseline,
    body,
    linkedProjects: getProjectsBySlugs(baseline.relatedProjects),
  };
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
) {
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
    rating: String(frontmatter.rating ?? "Baseline") as BaselineSummary["rating"],
    estimatedCarbonKg: toOptionalNumber(frontmatter.estimatedCarbonKg),
    estimatedWasteKg: toOptionalNumber(frontmatter.estimatedWasteKg),
    estimatedLifespanUses: toOptionalNumber(frontmatter.estimatedLifespanUses),
    recyclability: String(frontmatter.recyclability ?? "Unknown") as BaselineSummary["recyclability"],
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
