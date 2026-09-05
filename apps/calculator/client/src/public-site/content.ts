import type { PillarColorKey } from "@/lib/pillar-colors";
export const pillars = [
  {
    title: "Environment",
    description: "Focus on ecological impact, natural resources, and the full lifecycle of design outputs.",
    themes: ["materials", "emissions", "waste", "energy", "lifecycle impact"],
    href: "/knowledge-base/generated/pillars/environment.html",
    colorKey: "environment",
  },
  {
    title: "Society",
    description: "Focus on equity, accessibility, labour conditions, and social well-being.",
    themes: ["accessibility", "labour rights", "education", "equity", "participation"],
    href: "/knowledge-base/generated/pillars/society.html",
    colorKey: "society",
  },
  {
    title: "Culture",
    description: "Focus on identity, heritage, language, diversity, and community participation.",
    themes: ["local identity", "Indigenous culture", "diversity", "language preservation", "audience participation"],
    href: "/knowledge-base/generated/pillars/culture.html",
    colorKey: "culture",
  },
  {
    title: "Finance",
    description: "Focus on economic sustainability, accountability, and long-term value.",
    themes: ["transparency", "fair compensation", "profitability", "accountability", "long-term value"],
    href: "/knowledge-base/generated/pillars/finance.html",
    colorKey: "finance",
  },
] satisfies Array<{
  title: string;
  description: string;
  themes: string[];
  href: string;
  colorKey: PillarColorKey;
}>;


export const involvementGroups = [
  {
    title: "Contributors & Collaborators",
    for: ["designers", "developers", "writers", "translators", "UX designers", "students"],
    contributionTitle: "Ways to contribute",
    contributions: ["improve the user experience", "develop tools", "write case studies", "create datasets", "document projects", "test workflows"],
  },
  {
    title: "Advisors & Researchers",
    for: ["academics", "sustainability specialists", "accessibility experts", "social health advocates", "lawyers", "attorneys", "policy advisors", "Indigenous knowledge holders", "lifecycle assessment professionals"],
    contributionTitle: "Ways to contribute",
    contributions: ["review criteria", "advise on methodology", "contribute research", "help validate frameworks", "evolve knowledge base"],
  },
  {
    title: "Educational & Institutional Partners",
    for: ["schools", "nonprofits", "design associations", "government agencies", "incubators"],
    contributionTitle: "COLLABORATION OPPORTUNTIES",
    contributions: ["sustainable design curriculum", "workshops", "certification pilots", "research partnerships", "student challenges", "regional adaptations"],
  },
  {
    title: "Industry & Supply Chain Partners",
    for: ["printers", "paper suppliers", "digital hosting companies", "accessibility vendors", "packaging suppliers", "lifecycle assessment providers", "product vendors", "certification bodies"],
    contributionTitle: "Ways to collaborate",
    contributions: ["materials datasets", "environmental benchmarks", "verified supplier pathways", "low-impact production templates", "chain-of-custody systems"],
  },
];
