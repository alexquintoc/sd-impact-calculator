export { PILLAR_COLORS } from "../../../../../packages/standard-core/src/pillar-colors";
import { PILLAR_COLORS } from "../../../../../packages/standard-core/src/pillar-colors";

export type PillarColorKey = keyof typeof PILLAR_COLORS;

const PILLAR_COLOR_ALIASES: Record<string, PillarColorKey> = {
  environment: "environment",
  environmental: "environment",
  social: "society",
  society: "society",
  cultural: "culture",
  culture: "culture",
  financial: "finance",
  finance: "finance",
};

export function getPillarColor(pillarId: string) {
  return PILLAR_COLORS[PILLAR_COLOR_ALIASES[pillarId] ?? "environment"];
}
