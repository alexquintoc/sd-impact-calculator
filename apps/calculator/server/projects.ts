import fs from "fs";
import path from "path";
import criteriaV2 from "../../../packages/standard-core/src/criteria.v2.json";

type FrontmatterValue = string | number | boolean | string[];

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

function getCriteriaDetails(criteria: string[]) {
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

function parseMdx(fileContents: string) {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: fileContents };
  }

  return {
    frontmatter: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

function parseFrontmatter(frontmatter: string) {
  const values: Record<string, FrontmatterValue> = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyValue = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);

    if (!keyValue) {
      continue;
    }

    const [, key, rawValue = ""] = keyValue;

    if (rawValue === "") {
      const list: string[] = [];
      while (lines[index + 1]?.match(/^\s+-\s+/)) {
        index += 1;
        list.push(unquote(lines[index].replace(/^\s+-\s+/, "").trim()));
      }
      values[key] = list;
    } else {
      values[key] = parseScalar(rawValue.trim());
    }
  }

  return values;
}

function parseScalar(value: string): FrontmatterValue {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return unquote(value);
}

function unquote(value: string) {
  return value.replace(/^["']|["']$/g, "");
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
    gallery: Array.isArray(frontmatter.gallery) ? frontmatter.gallery : [],
    pillars: Array.isArray(frontmatter.pillars) ? frontmatter.pillars : [],
    criteria: Array.isArray(frontmatter.criteria) ? frontmatter.criteria : [],
    rating: String(frontmatter.rating ?? "Emerging") as ProjectSummary["rating"],
    score: Number(frontmatter.score ?? 0),
    published: Boolean(frontmatter.published),
  };
}
