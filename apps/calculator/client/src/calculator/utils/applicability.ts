export type Applicability = {
  mode?: "all" | "some";
  categories?: string[];
  projectTypes?: string[];
  relevance?: "primary" | "secondary" | "conditional";
  notApplicableMessage?: string;
};

export type ProjectProfile = {
  projectCategory: string;
  projectType: string;
};

export function isCriterionApplicable(
  applicability: Applicability | undefined,
  profile: ProjectProfile
): boolean {
  if (!applicability) return true;

  const mode = applicability.mode ?? "some";

  const categoryMatch =
    !applicability.categories || applicability.categories.length === 0
      ? null
      : applicability.categories.includes(profile.projectCategory);

  const projectTypeMatch =
    !applicability.projectTypes || applicability.projectTypes.length === 0
      ? null
      : applicability.projectTypes.includes(profile.projectType);

  const checks = [categoryMatch, projectTypeMatch].filter(
    (value): value is boolean => value !== null
  );

  if (checks.length === 0) return true;

  return mode === "all" ? checks.every(Boolean) : checks.some(Boolean);
}