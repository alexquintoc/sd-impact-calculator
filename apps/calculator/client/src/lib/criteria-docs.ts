import criteriaMeta from "@shared/generated/criteria-meta.json";

export type CriterionDocMeta = {
  id: string;
  label: string;
  points: number;
  pillarId: string;
  pillarLabel: string;
  summary: string;
  description: string;
  whyItMatters: string;
  url: string;
};

const docsBaseUrl = "https://alexquintoc.github.io/sd-standard";

const meta = criteriaMeta as Record<string, CriterionDocMeta>;

export function getCriterionDocMeta(id: string): CriterionDocMeta | null {
  const item = meta[id];
  if (!item) return null;

  return {
    ...item,
    url: `${docsBaseUrl}${item.url}`,
  };
}