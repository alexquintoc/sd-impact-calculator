import fs from "node:fs";
import path from "node:path";
import criteriaV2 from "../packages/standard-core/src/criteria.v2.json";
import { parseMdx, type FrontmatterValue } from "./content";

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export type ProjectFrontmatter = {
  title: string;
  description: string;
  year: number;
  location: string;
  projectType: string;
  website?: string;
  coverImage: string;
  gallery: string[];
  pillars: string[];
  criteria: string[];
  rating: "Emerging" | "Advanced" | "Transformative";
  score: number;
  relatedBaselines: string[];
  published: boolean;
};

export type Project = ProjectFrontmatter & {
  slug: string;
  body: string;
  criteriaDetails: CriteriaDetail[];
  relatedProjects: ProjectSummary[];
};

export type ProjectSummary = ProjectFrontmatter & {
  slug: string;
  criteriaDetails: CriteriaDetail[];
};

export type CriteriaDetail = {
  displayId: string;
  id: string;
  legacyId?: string;
  label: string;
  description: string;
  pillarId: string;
  pillarLabel: string;
  points: number;
};

type CriteriaWithDisplayIds = {
  id: string;
  displayId?: string;
  legacyId?: string;
  label: string;
  description: string;
  points: number;
};

const pillarAliases: Record<string, string> = {
  environment: "environment",
  society: "social",
  social: "social",
  culture: "cultural",
  cultural: "cultural",
  finance: "financial",
  financial: "financial",
};

const pillarDisplayLabels: Record<string, string> = {
  environment: "Environment",
  society: "Society",
  social: "Society",
  culture: "Culture",
  cultural: "Culture",
  finance: "Finance",
  financial: "Finance",
};

const criteriaByDisplayId = new Map<string, CriteriaDetail>();
const criteriaByLegacyId = new Map<string, CriteriaDetail>();
const criteriaById = new Map<string, CriteriaDetail>();

for (const pillar of criteriaV2.pillars) {
  const prefix =
    pillar.id === "environment"
      ? "E"
      : pillar.id === "social" || pillar.id === "society"
        ? "S"
        : pillar.id === "cultural" || pillar.id === "culture"
          ? "C"
          : "F";

  pillar.criteria.forEach((rawCriterion, index) => {
    const criterion = rawCriterion as CriteriaWithDisplayIds;
    const generatedDisplayId = `${prefix}${index + 1}`;
    const detail: CriteriaDetail = {
      displayId: criterion.displayId ?? generatedDisplayId,
      id: criterion.id,
      legacyId: criterion.legacyId,
      label: criterion.label,
      description: criterion.description,
      pillarId: pillar.id,
      pillarLabel: getPillarLabel(pillar.id),
      points: criterion.points,
    };

    criteriaByDisplayId.set(detail.displayId.toLowerCase(), detail);
    if (detail.legacyId) {
      criteriaByLegacyId.set(detail.legacyId.toLowerCase(), detail);
    }
    criteriaById.set(detail.id.toLowerCase(), detail);
  });
}

export function getPillarLabel(pillar: string) {
  return pillarDisplayLabels[pillar] ?? pillar;
}

export function getPillarKey(pillar: string) {
  return pillarAliases[pillar] ?? pillar;
}

export function getCriteriaDetails(criteria: string[]) {
  return criteria.map((criterion) => {
    const key = criterion.toLowerCase();
    return (
      criteriaByDisplayId.get(key) ??
      criteriaByLegacyId.get(key) ??
      criteriaById.get(key) ?? {
        displayId: criterion,
        id: criterion,
        label: criterion,
        description: "No matching SD Standard v2 criterion was found.",
        pillarId: "unknown",
        pillarLabel: "Unknown",
        points: 0,
      }
    );
  });
}

export function getAllProjects() {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(projectsDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(projectsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { frontmatter, body } = parseMdx(fileContents);
      const project = normalizeProject(frontmatter);

      return {
        ...project,
        slug,
        body,
        criteriaDetails: getCriteriaDetails(project.criteria),
      };
    })
    .filter((project) => project.published)
    .sort((a, b) => b.year - a.year || b.score - a.score);
}

export function getProject(slug: string): Project | null {
  const projects = getAllProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  const currentPillars = new Set(project.pillars.map(getPillarKey));
  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .map((item) => ({
      project: item,
      score: item.pillars.filter((pillar) => currentPillars.has(getPillarKey(pillar))).length,
    }))
    .sort((a, b) => b.score - a.score || b.project.score - a.project.score)
    .slice(0, 3)
    .map(({ project }) => ({
      ...project,
      body: undefined,
      relatedProjects: undefined,
    })) as ProjectSummary[];

  return {
    ...project,
    relatedProjects,
  };
}

function normalizeProject(frontmatter: Record<string, FrontmatterValue>): ProjectFrontmatter {
  return {
    title: String(frontmatter.title ?? "Untitled project"),
    description: String(frontmatter.description ?? ""),
    year: Number(frontmatter.year ?? new Date().getFullYear()),
    location: String(frontmatter.location ?? ""),
    projectType: String(frontmatter.projectType ?? ""),
    website: frontmatter.website ? String(frontmatter.website) : undefined,
    coverImage: String(frontmatter.coverImage ?? ""),
    gallery: toStringList(frontmatter.gallery),
    pillars: toStringList(frontmatter.pillars),
    criteria: toStringList(frontmatter.criteria),
    rating: String(frontmatter.rating ?? "Emerging") as ProjectFrontmatter["rating"],
    score: Number(frontmatter.score ?? 0),
    relatedBaselines: toStringList(frontmatter.relatedBaselines),
    published: frontmatter.published !== false,
  };
}

function toStringList(value: FrontmatterValue | undefined) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
