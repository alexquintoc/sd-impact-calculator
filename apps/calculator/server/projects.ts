import fs from "fs";
import path from "path";
import criteriaV2 from "../../../packages/standard-core/src/criteria.v2.json";
import { parseMdx, toStringList, type FrontmatterValue } from "./content";

export type ProjectSummary = {
  slug: string;
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
  criteriaDetails: CriteriaDetail[];
};

export type ProjectDetail = ProjectSummary & {
  body: string;
  relatedProjects: ProjectSummary[];
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

const projectsDirectory = path.resolve(process.cwd(), "..", "..", "content", "projects");

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
const criteriaByAliasId = new Map<string, CriteriaDetail>();

const criteriaAliasTargets: Record<string, string> = {
  EIRT1: "E1",
  EIRT3: "E3",
  EIRT4: "E4",
  EIRT5: "E5",
  EIRT6: "E6",
  EIRT7: "E7",
  EIRT8: "E7",
  EIRT9: "E9",
  EIRT10: "E10",
  EIRT11: "E11",
  EIRT12: "EM4",
  EIRT13: "EM6",
  EW1: "E15",
  EW2: "E14",
  EW3: "E13",
  EE1: "E16",
  EE2: "E17",
  EE3: "E18",
  EEM1: "E19",
  EEM2: "E11",
  EEM3: "E21",
  EEM4: "E22",
  EWAT1: "E23",
  SDP1: "S1",
  SDP2: "S2",
  SDP3: "S3",
  SEP1: "SM1",
  SEP2: "SM2",
  SEP3: "SM3",
  SEP4: "S10",
  SA1: "S6",
  SA2: "S6b",
  SA3: "S8",
  SA4: "S9",
  SSE1: "S11",
  SSE2: "S12",
  SSE3: "S13",
  SSE4: "S14",
  SED1: "S15",
  SED2: "S16",
  CCP1: "C2",
  CCP2: "C3",
  CCP3: "C4",
  CCP4: "C5",
  CCP5: "CM9",
  CCE1: "C6",
  CCE2: "C7",
  CCE3: "C8",
  FFS1: "F1",
  FFS2: "F2",
  FFS3: "FM3",
  FFP1: "F4",
  FFP2: "F5",
  FFP3: "F6",
  FFP4: "F7",
};

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
      detail.legacyId
        .split("/")
        .map((legacyId) => legacyId.trim())
        .filter(Boolean)
        .forEach((legacyId) => criteriaByLegacyId.set(legacyId.toLowerCase(), detail));
    }
    criteriaById.set(detail.id.toLowerCase(), detail);
  });
}

for (const [aliasId, targetId] of Object.entries(criteriaAliasTargets)) {
  const targetKey = targetId.toLowerCase();
  const detail =
    criteriaById.get(targetKey) ??
    criteriaByLegacyId.get(targetKey) ??
    criteriaByDisplayId.get(targetKey);

  if (detail) {
    criteriaByAliasId.set(aliasId.toLowerCase(), {
      ...detail,
      displayId: aliasId,
    });
  }
}

export function getAllProjects(): ProjectSummary[] {
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
      const { frontmatter } = parseMdx(fileContents);
      const project = normalizeProject(frontmatter);

      return {
        ...project,
        slug,
        criteriaDetails: getCriteriaDetails(project.criteria),
      };
    })
    .filter((project) => project.published)
    .sort((a, b) => b.year - a.year || b.score - a.score);
}

export function getProject(slug: string): ProjectDetail | null {
  const projects = getAllProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  const filePath = path.join(projectsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { body } = parseMdx(fileContents);
  const currentPillars = new Set(project.pillars.map(getPillarKey));
  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .map((item) => ({
      project: item,
      score: item.pillars.filter((pillar) => currentPillars.has(getPillarKey(pillar))).length,
    }))
    .sort((a, b) => b.score - a.score || b.project.score - a.project.score)
    .slice(0, 3)
    .map(({ project }) => project);

  return {
    ...project,
    body,
    relatedProjects,
  };
}

function getPillarLabel(pillar: string) {
  return pillarDisplayLabels[pillar] ?? pillar;
}

function getPillarKey(pillar: string) {
  return pillarAliases[pillar] ?? pillar;
}

export function getCriteriaDetails(criteria: string[]) {
  return criteria.map((criterion) => {
    const key = criterion.toLowerCase();
    return (
      criteriaById.get(key) ??
      criteriaByLegacyId.get(key) ??
      criteriaByAliasId.get(key) ??
      criteriaByDisplayId.get(key) ?? {
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

function normalizeProject(frontmatter: Record<string, FrontmatterValue>) {
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
    rating: String(frontmatter.rating ?? "Emerging") as ProjectSummary["rating"],
    score: Number(frontmatter.score ?? 0),
    relatedBaselines: toStringList(frontmatter.relatedBaselines),
    published: frontmatter.published !== false,
  };
}
