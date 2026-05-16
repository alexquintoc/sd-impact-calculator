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

export async function fetchProjects() {
  const response = await fetch("/api/projects");

  if (!response.ok) {
    throw new Error("Unable to load projects");
  }

  const data = (await response.json()) as { projects: ProjectSummary[] };
  return data.projects;
}

export async function fetchProject(slug: string) {
  const response = await fetch(`/api/projects/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    throw new Error("Unable to load project");
  }

  const data = (await response.json()) as { project: ProjectDetail };
  return data.project;
}

export function getPillarLabel(pillar: string) {
  const labels: Record<string, string> = {
    environment: "Environment",
    society: "Society",
    social: "Society",
    culture: "Culture",
    cultural: "Culture",
    finance: "Finance",
    financial: "Finance",
  };

  return labels[pillar] ?? pillar;
}
