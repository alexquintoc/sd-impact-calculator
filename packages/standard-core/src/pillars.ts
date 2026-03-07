import type { PillarId } from "./types";

export interface Pillar {
  id: PillarId;
  title: string;
  description: string;
}

export const pillars: Pillar[] = [
  {
    id: "environment",
    title: "Environment",
    description: "Reduce ecological harm and improve environmental outcomes.",
  },
  {
    id: "social",
    title: "Social",
    description: "Support fair, inclusive, and healthy social outcomes.",
  },
  {
    id: "cultural",
    title: "Cultural",
    description: "Respect context, representation, identity, and local knowledge.",
  },
  {
    id: "financial",
    title: "Financial",
    description: "Promote long-term viability, value, and responsible resource use.",
  },
];