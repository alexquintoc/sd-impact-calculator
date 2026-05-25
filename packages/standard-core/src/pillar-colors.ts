export const PILLAR_COLORS = {
  environment: "#71b88f",
  society: "#2d6cdf",
  culture: "#c46a4a",
  finance: "#f6d365",
} as const;

export type PillarColorKey = keyof typeof PILLAR_COLORS;
