import { isCriterionApplicable } from "@/calculator/utils/applicability";
import type { CalculatorCriteriaData } from "@/calculator/registry";
import type {
  CriteriaScanStatus,
  QuickProjectScanInput,
  QuickProjectScanResult,
  ScannedCriterion,
} from "../types";

type KeywordSet = {
  strong: string[];
  related: string[];
};

type ScanCriterionData = Record<string, any> & {
  id: string;
  label: string;
  description?: string;
  whyItMatters?: string;
  displayId?: string;
  legacyId?: string;
  level?: string;
  applicability?: Record<string, any>;
};

const KEYWORD_SETS: Record<string, KeywordSet> = {
  environment: {
    strong: [
      "low impact",
      "reduce waste",
      "waste reduction",
      "fewer materials",
      "digital-first",
      "paper reduction",
      "recycled",
      "recyclable",
      "reuse",
      "reusable",
      "durable",
      "renewable energy",
      "carbon",
      "emissions",
      "local production",
      "shipping",
      "water",
    ],
    related: [
      "materials",
      "paper",
      "print",
      "energy",
      "transport",
      "lifecycle",
      "packaging",
      "supply",
      "repair",
      "end of life",
      "offset",
    ],
  },
  social: {
    strong: [
      "accessibility",
      "wcag",
      "inclusive",
      "universal design",
      "safety",
      "health",
      "local labour",
      "local labor",
      "human rights",
      "education",
      "affordable",
      "open source",
      "creative commons",
    ],
    related: [
      "training",
      "equity",
      "public benefit",
      "plain language",
      "community",
      "workers",
      "wellbeing",
      "license",
      "learning",
    ],
  },
  cultural: {
    strong: [
      "local culture",
      "indigenous",
      "language",
      "cultural diversity",
      "community participation",
      "audience participation",
      "co-design",
    ],
    related: [
      "heritage",
      "translation",
      "local context",
      "storytelling",
      "identity",
      "participatory",
      "public engagement",
      "consultation",
    ],
  },
  financial: {
    strong: [
      "profitable",
      "budget",
      "paid work",
      "no spec work",
      "measurable goals",
      "accountability",
      "financial value",
      "economic benefit",
    ],
    related: [
      "cost",
      "pricing",
      "revenue",
      "funding",
      "value",
      "metrics",
      "reporting",
      "contract",
      "scope",
    ],
  },
};

const STOP_WORDS = new Set([
  "and",
  "for",
  "the",
  "with",
  "that",
  "this",
  "into",
  "from",
  "project",
  "design",
  "designed",
  "includes",
  "include",
  "criteria",
  "criterion",
]);

const MAX_VISIBLE_PER_PILLAR = 6;
const MIN_VISIBLE_PER_PILLAR = 3;

function normalize(value: string) {
  return value.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
}

function getLabelKeywords(label: string) {
  return normalize(label)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
}

function getMatches(text: string, keywords: string[]) {
  return keywords.filter((keyword) => text.includes(normalize(keyword)));
}

function getCriterionKeywords(criterion: Record<string, any>) {
  return [
    ...getLabelKeywords(criterion.label ?? ""),
    ...getLabelKeywords(criterion.description ?? ""),
    ...getLabelKeywords(criterion.whyItMatters ?? ""),
  ];
}

function chooseStatus(
  pillarId: string,
  criterion: Record<string, any>,
  scanText: string
): { status: CriteriaScanStatus; matchedKeywords: string[]; score: number } {
  const pillarKeywords = KEYWORD_SETS[pillarId] ?? { strong: [], related: [] };
  const strongMatches = getMatches(scanText, pillarKeywords.strong);
  const relatedMatches = getMatches(scanText, pillarKeywords.related);
  const criterionMatches = getMatches(scanText, getCriterionKeywords(criterion));

  const matchedKeywords = Array.from(
    new Set([...strongMatches, ...relatedMatches, ...criterionMatches])
  ).slice(0, 5);

  if (strongMatches.length > 0 && criterionMatches.length > 0) {
    return {
      status: "likely-met",
      matchedKeywords,
      score: strongMatches.length * 5 + criterionMatches.length * 2,
    };
  }

  if (strongMatches.length > 0 || criterionMatches.length >= 2) {
    return {
      status: "likely-met",
      matchedKeywords,
      score: strongMatches.length * 4 + criterionMatches.length * 2,
    };
  }

  if (
    strongMatches.length > 0 ||
    criterionMatches.length === 1 ||
    (relatedMatches.length > 0 && criterionMatches.length > 0)
  ) {
    return {
      status: "opportunity",
      matchedKeywords,
      score: relatedMatches.length * 2 + criterionMatches.length,
    };
  }

  return { status: "not-considered", matchedKeywords: [], score: 0 };
}

function buildInterpretationNote(input: QuickProjectScanInput, totals: Record<CriteriaScanStatus, number>) {
  const name = input.projectName.trim() || "This project";
  if (totals["likely-met"] > 0) {
    return `${name} appears to connect with ${totals["likely-met"]} SD Standard criteria and may have ${totals.opportunity} additional improvement opportunities. This is a rule-based first pass, so each result is worth checking against the full criteria.`;
  }

  if (totals.opportunity > 0) {
    return `${name} may relate to ${totals.opportunity} SD Standard criteria, but the description does not yet include enough evidence to mark criteria as likely met. Adding more specifics would improve the scan.`;
  }

  return `${name} does not include enough sustainability detail for this prototype to identify likely matches yet. Consider adding evidence about materials, accessibility, cultural context, or financial accountability.`;
}

export function scanProjectDescription(
  input: QuickProjectScanInput,
  criteriaData: CalculatorCriteriaData
): QuickProjectScanResult {
  const scanText = normalize(
    [
      input.projectName,
      input.projectCategory,
      input.projectType,
      input.projectFormat,
      input.description,
    ].join(" ")
  );

  const totals: Record<CriteriaScanStatus, number> = {
    "likely-met": 0,
    opportunity: 0,
    "not-considered": 0,
  };

  const pillars = criteriaData.pillars.map((pillar) => {
    const scoredCriteria = (pillar.criteria as ScanCriterionData[])
      .filter((criterion) => {
        if ((criterion.level ?? "project") !== "project") {
          return false;
        }

        if (!input.projectCategory && !input.projectType) {
          return true;
        }

        return isCriterionApplicable(criterion.applicability, {
          projectCategory: input.projectCategory,
          projectType: input.projectType,
        });
      })
      .map((criterion) => {
        const scan = chooseStatus(pillar.id, criterion, scanText);

        return {
          id: criterion.displayId ?? criterion.legacyId ?? criterion.id,
          label: criterion.label,
          pillarId: pillar.id,
          pillarLabel: pillar.label,
          status: scan.status,
          matchedKeywords: scan.matchedKeywords,
          score: scan.score,
        };
      })
      .sort((a, b) => {
        const statusWeight = {
          "likely-met": 3,
          opportunity: 2,
          "not-considered": 1,
        };

        return statusWeight[b.status] - statusWeight[a.status] || b.score - a.score;
      });

    const matchedCriteria = scoredCriteria.filter(
      (criterion) => criterion.status !== "not-considered"
    );
    const visibleCount = Math.min(
      MAX_VISIBLE_PER_PILLAR,
      Math.max(MIN_VISIBLE_PER_PILLAR, matchedCriteria.length)
    );
    const visibleCriteria = scoredCriteria.slice(0, visibleCount) as Array<
      ScannedCriterion & { score?: number }
    >;

    visibleCriteria.forEach((criterion) => {
      totals[criterion.status] += 1;
    });

    return {
      id: pillar.id,
      label: pillar.label,
      criteria: visibleCriteria.map(({ score, ...criterion }) => criterion),
    };
  });

  return {
    projectName: input.projectName.trim() || "Untitled project",
    interpretationNote: buildInterpretationNote(input, totals),
    pillars,
    totals,
  };
}

// A future AI-assisted classifier can replace chooseStatus while keeping this
// function's input/output contract stable for the UI components.
