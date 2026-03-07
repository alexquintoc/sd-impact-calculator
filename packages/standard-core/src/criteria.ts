import type { Criterion } from "./types";

export const criteria: Criterion[] = [
  {
    id: "env-materials-01",
    title: "Prefer lower-impact materials",
    pillar: "environment",
    description:
      "Choose materials, substrates, and production methods with lower environmental impact where feasible.",
    guidance:
      "Consider recycled content, reusability, durability, toxicity, and local sourcing.",
    appliesTo: ["graphic", "editorial", "packaging", "brand", "mixed"],
    tags: ["materials", "production", "footprint"],
    sdgs: [12, 13],
    version: "1.0.0",
  },
  {
    id: "soc-access-01",
    title: "Support accessibility",
    pillar: "social",
    description:
      "Design outputs should be usable by people with different abilities and access needs.",
    guidance:
      "Consider readability, contrast, captions, alternative text, keyboard access, and inclusive interaction patterns.",
    appliesTo: ["web", "ui", "ux", "graphic", "motion", "mixed"],
    tags: ["accessibility", "inclusion"],
    sdgs: [10],
    version: "1.0.0",
  },
];