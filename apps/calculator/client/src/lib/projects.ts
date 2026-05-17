import { fetchJsonWithFallback } from "@/lib/fetchJson";

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
  relatedBaselines: string[];
  published: boolean;
  criteriaDetails: CriteriaDetail[];
};

export type ProjectDetail = ProjectSummary & {
  body: string;
  relatedProjects: ProjectSummary[];
  linkedBaselines?: import("@/lib/baselines").BaselineSummary[];
};

export async function fetchProjects() {
  const data = await fetchJsonWithFallback<{ projects: ProjectSummary[] }>(
    "/api/projects",
    "/data/projects.json",
  );
  return data.projects;
}

export async function fetchProject(slug: string) {
  const encodedSlug = encodeURIComponent(slug);
  const data = await fetchJsonWithFallback<{ project: ProjectDetail }>(
    `/api/projects/${encodedSlug}`,
    `/data/projects/${encodedSlug}.json`,
  );
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
