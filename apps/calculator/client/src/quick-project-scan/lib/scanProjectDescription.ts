import type { CalculatorCriteriaData } from "@/calculator/registry";
import criteriaMeta from "../../../../../../packages/standard-core/src/generated/criteria-meta.json";
import type {
  ImpactSnapshot,
  ImpactSnapshotCriterion,
  ImpactSnapshotPillarId,
  ImpactSnapshotStatus,
  SnapshotEmbedPayload,
} from "../types";

type CriterionData = Record<string, any> & {
  id: string;
  label: string;
  displayId?: string;
  legacyId?: string;
  description?: string;
  summary?: string;
  whyItMatters?: string;
  category?: string;
  subcategory?: string;
  subcategoryLabel?: string;
  slug?: string;
  terms?: Array<string | { label?: string; term?: string; name?: string }>;
  examples?: Array<string | Record<string, string>>;
  level?: string;
  appliesTo?: string[];
};

type CriterionMeta = {
  url?: string;
  summary?: string;
  description?: string;
  whyItMatters?: string;
  slug?: string;
};

type MatchResult = {
  status: ImpactSnapshotStatus;
  confidence: number;
  evidence: string | null;
  rationale: string;
  score: number;
};

const PILLAR_IDS: ImpactSnapshotPillarId[] = ["environment", "society", "culture", "finance"];

const PILLAR_LABELS: Record<ImpactSnapshotPillarId, string> = {
  environment: "Environment",
  society: "Society",
  culture: "Culture",
  finance: "Finance",
};

const DISCLAIMER =
  "This is an AI-assisted or rule-assisted mapping based on the submitted description. It is not a certification or verification.";

const STATUS_WEIGHT: Record<ImpactSnapshotStatus, number> = {
  likely: 3,
  possible: 2,
  not_enough_evidence: 1,
};

const PILLAR_TERMS: Record<ImpactSnapshotPillarId, { strong: string[]; related: string[] }> = {
  environment: {
    strong: [
      "recycled",
      "recyclable",
      "reuse",
      "reusable",
      "renewable energy",
      "carbon",
      "emissions",
      "zero waste",
      "low waste",
      "minimal ink",
      "reduced paper",
      "paper reduction",
      "local printing",
      "local production",
      "life cycle",
      "lifecycle",
    ],
    related: [
      "materials",
      "paper",
      "ink",
      "print",
      "printing",
      "energy",
      "transport",
      "shipping",
      "waste",
      "water",
      "packaging",
      "durable",
      "durability",
      "finishes",
    ],
  },
  society: {
    strong: [
      "accessibility",
      "accessible",
      "wcag",
      "universal design",
      "health and safety",
      "human rights",
      "worker rights",
      "fair trade",
      "affordable",
      "plain language",
      "open source",
      "creative commons",
    ],
    related: [
      "audience needs",
      "inclusive",
      "equity",
      "training",
      "education",
      "learning",
      "community",
      "local labour",
      "local labor",
      "participation",
      "safety",
    ],
  },
  culture: {
    strong: [
      "local culture",
      "indigenous",
      "endangered language",
      "cultural diversity",
      "community participation",
      "audience engagement",
      "co-design",
      "cultural preservation",
      "bilingual",
      "multilingual",
    ],
    related: [
      "heritage",
      "translation",
      "local context",
      "storytelling",
      "identity",
      "workshop",
      "workshops",
      "museum",
      "community members",
      "public engagement",
    ],
  },
  finance: {
    strong: [
      "profitable",
      "profitability",
      "paid work",
      "paid fairly",
      "no unpaid work",
      "no spec work",
      "financial objectives",
      "smart goals",
      "accountability",
      "transparency",
      "economic benefit",
    ],
    related: [
      "budget",
      "pricing",
      "revenue",
      "funding",
      "contract",
      "scope",
      "metrics",
      "reporting",
      "economic value",
      "financial",
    ],
  },
};

const PROJECT_FORMAT_TERMS: Record<string, string[]> = {
  Website: ["website", "web site", "web app", "landing page", "microsite", "online"],
  PDF: ["pdf", "report", "annual report", "digital document"],
  Poster: ["poster", "billboard", "print ad"],
  Packaging: ["packaging", "package", "label", "box"],
  Campaign: ["campaign", "social media", "advertising"],
  Exhibit: ["exhibit", "exhibition", "museum", "gallery", "installation"],
  Signage: ["signage", "wayfinding", "sign"],
  "Motion graphics": ["motion", "video", "animation"],
  "Printed guide": ["guide", "booklet", "brochure", "catalog"],
};

const STOP_WORDS = new Set([
  "about",
  "action",
  "actions",
  "against",
  "also",
  "and",
  "based",
  "being",
  "communication",
  "communicates",
  "criteria",
  "criterion",
  "design",
  "designed",
  "designing",
  "description",
  "document",
  "documented",
  "documents",
  "entity",
  "from",
  "include",
  "includes",
  "including",
  "into",
  "least",
  "matters",
  "plan",
  "planned",
  "planning",
  "produced",
  "production",
  "project",
  "projects",
  "provides",
  "qualified",
  "related",
  "relevant",
  "reporting",
  "requires",
  "review",
  "should",
  "standard",
  "strategy",
  "supported",
  "supports",
  "that",
  "their",
  "this",
  "through",
  "transparency",
  "transparent",
  "used",
  "uses",
  "using",
  "value",
  "values",
  "visual",
  "where",
  "whether",
  "with",
  "within",
  "work",
  "works",
  "would",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function splitWords(value: string) {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function includesTerm(text: string, term: string) {
  const normalized = normalize(term);
  if (!normalized) return false;
  if (!normalized.includes(" ")) {
    const words = text.split(/[^a-z0-9]+/);
    return words.some(
      (word) =>
        word === normalized ||
        word === `${normalized}s` ||
        word === `${normalized}ed` ||
        word === `${normalized}ing`
    );
  }
  return text.includes(normalized);
}

function findTerms(text: string, terms: string[]) {
  return unique(terms).filter((term) => includesTerm(text, term));
}

function getMeta(criterion: CriterionData) {
  const meta = criteriaMeta as Record<string, CriterionMeta>;
  return meta[criterion.id] ?? meta[criterion.displayId ?? ""] ?? meta[criterion.legacyId ?? ""];
}

function getCriterionId(criterion: CriterionData) {
  return criterion.displayId ?? criterion.legacyId ?? criterion.id;
}

function getPillarId(value: string): ImpactSnapshotPillarId {
  if (value === "social") return "society";
  if (PILLAR_IDS.includes(value as ImpactSnapshotPillarId)) return value as ImpactSnapshotPillarId;
  return "environment";
}

function getKnowledgeBaseUrl(criterion: CriterionData) {
  const url = getMeta(criterion)?.url;
  return url ? `/knowledge-base${url}` : null;
}

function termsToText(terms: CriterionData["terms"]) {
  if (!Array.isArray(terms)) return [];
  return terms
    .map((term) => {
      if (typeof term === "string") return term;
      return term.label ?? term.term ?? term.name ?? "";
    })
    .filter(Boolean);
}

function examplesToText(examples: CriterionData["examples"]) {
  if (!Array.isArray(examples)) return [];
  return examples
    .flatMap((example) => {
      if (typeof example === "string") return [example];
      return Object.values(example).filter((value): value is string => typeof value === "string");
    })
    .filter(Boolean);
}

function getCriterionTermGroups(criterion: CriterionData) {
  const meta = getMeta(criterion);
  const labelFields = [
    criterion.label,
    criterion.slug,
    meta?.slug,
    ...termsToText(criterion.terms),
  ];
  const contextFields = [
    criterion.summary,
    criterion.description,
    criterion.whyItMatters,
    meta?.summary,
    meta?.description,
    meta?.whyItMatters,
    ...examplesToText(criterion.examples),
  ];

  return {
    labelTerms: unique(labelFields.flatMap((value) => splitWords(String(value ?? "")))),
    contextTerms: unique(contextFields.flatMap((value) => splitWords(String(value ?? "")))),
  };
}

function findEvidence(description: string, matches: string[]) {
  const sentences = description.match(/[^.!?\n]+[.!?\n]?/g) ?? [description];
  const match = matches.find(Boolean);
  if (!match) return null;

  const sentence = sentences.find((candidate) => includesTerm(normalize(candidate), match));
  if (sentence) return sentence.trim().slice(0, 220);

  const index = normalize(description).indexOf(normalize(match));
  if (index < 0) return match;

  const start = Math.max(0, index - 50);
  const end = Math.min(description.length, index + match.length + 70);
  return description.slice(start, end).trim();
}

function matchCriterion(
  description: string,
  normalizedDescription: string,
  pillarId: ImpactSnapshotPillarId,
  criterion: CriterionData
): MatchResult {
  const pillarTerms = PILLAR_TERMS[pillarId];
  const strongMatches = findTerms(normalizedDescription, pillarTerms.strong);
  const relatedMatches = findTerms(normalizedDescription, pillarTerms.related);
  const { labelTerms, contextTerms } = getCriterionTermGroups(criterion);
  const labelMatches = findTerms(normalizedDescription, labelTerms);
  const contextMatches = findTerms(normalizedDescription, contextTerms);
  const exactLabelMatch = includesTerm(normalizedDescription, criterion.label);
  const criterionSpecificSignal = labelMatches.length > 0 || contextMatches.length >= 2;
  const pillarBoost = criterionSpecificSignal ? strongMatches.length * 2 + relatedMatches.length : 0;

  const score =
    labelMatches.length * 6 +
    contextMatches.length * 2 +
    pillarBoost +
    (exactLabelMatch ? 8 : 0);

  const evidenceMatches = unique([
    ...labelMatches,
    ...contextMatches,
    ...(exactLabelMatch ? [criterion.label] : []),
    ...(criterionSpecificSignal ? strongMatches : []),
    ...(criterionSpecificSignal ? relatedMatches : []),
  ]);
  const evidence = findEvidence(description, evidenceMatches);

  if (
    exactLabelMatch ||
    labelMatches.length >= 2 ||
    (labelMatches.length > 0 && (strongMatches.length > 0 || relatedMatches.length > 0))
  ) {
    const confidence = Math.min(0.92, 0.64 + score / 45);
    return {
      status: "likely",
      confidence: Number(confidence.toFixed(2)),
      evidence,
      rationale: evidence
        ? `Based on the description, this project appears to address ${criterion.label.toLowerCase()}.`
        : `The description includes terms that closely align with ${criterion.label.toLowerCase()}.`,
      score,
    };
  }

  if (labelMatches.length > 0 || contextMatches.length >= 2 || (contextMatches.length > 0 && strongMatches.length > 0)) {
    const confidence = Math.min(0.63, 0.34 + score / 55);
    return {
      status: "possible",
      confidence: Number(confidence.toFixed(2)),
      evidence,
      rationale: `Possible criterion to review: the description has partial signals related to ${criterion.label.toLowerCase()}.`,
      score,
    };
  }

  return {
    status: "not_enough_evidence",
    confidence: 0.12,
    evidence: null,
    rationale: `Not enough evidence to confirm whether this project addresses ${criterion.label.toLowerCase()}.`,
    score: 0,
  };
}

function inferTitle(description: string) {
  const firstSentence = (description.match(/[^.!?\n]+/)?.[0] ?? description).trim();
  if (!firstSentence) return null;

  const compact = firstSentence
    .replace(/^we (designed|created|made|developed|produced)\s+/i, "")
    .replace(/^the project (is|was)\s+/i, "")
    .trim();

  return compact.length > 70 ? `${compact.slice(0, 67).trim()}...` : compact;
}

function inferFormat(description: string) {
  const text = normalize(description);
  const match = Object.entries(PROJECT_FORMAT_TERMS).find(([, terms]) =>
    terms.some((term) => includesTerm(text, term))
  );
  return match?.[0] ?? null;
}

function inferProjectType(description: string, criteriaData: CalculatorCriteriaData) {
  const text = normalize(description);
  const projectTypes = criteriaData.projectTypes ?? [];
  const scoredTypes = projectTypes
    .map((type) => {
      const terms = unique([type.label, type.id, type.description ?? "", ...splitWords(type.label)]);
      const score = findTerms(text, terms).length;
      return { label: type.label, score };
    })
    .filter((type) => type.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredTypes[0]?.label ?? inferFormat(description);
}

function makeEmptyPillarSummary() {
  return {
    environment: { likely: 0, possible: 0 },
    society: { likely: 0, possible: 0 },
    culture: { likely: 0, possible: 0 },
    finance: { likely: 0, possible: 0 },
  };
}

function buildMissingInformation(summary: ImpactSnapshot["summary"]) {
  const questions: string[] = [];

  if (summary.pillars.finance.likely + summary.pillars.finance.possible < 2) {
    questions.push(
      "Was the project profitable or financially sustainable for the design entity?",
      "Was the work paid fairly, with no unpaid or speculative labor?",
      "Were financial objectives, accountability, transparency, or broader economic value documented?"
    );
  }

  if (summary.pillars.society.likely + summary.pillars.society.possible < 2) {
    questions.push(
      "Were accessibility requirements considered for electronic or printed outputs?",
      "Did the project use universal design principles or address audience needs?",
      "Were health, safety, participation, or worker-rights considerations documented?"
    );
  }

  if (summary.pillars.environment.likely + summary.pillars.environment.possible < 2) {
    questions.push(
      "What materials, paper, ink, finishes, product quantities, or packaging were used?",
      "How were transport, energy, waste, water, or end-of-life impacts considered?",
      "Was a lifecycle assessment, emissions estimate, or renewable energy choice documented?"
    );
  }

  if (summary.pillars.culture.likely + summary.pillars.culture.possible < 2) {
    questions.push(
      "How did the project consider local culture, cultural diversity, or Indigenous culture?",
      "Were endangered languages, translation, or multilingual needs relevant?",
      "Did audience or community members participate in shaping the project?"
    );
  }

  return questions.slice(0, 9);
}

export function analyzeProjectDescription(
  description: string,
  criteriaData: CalculatorCriteriaData
): ImpactSnapshot {
  const normalizedDescription = normalize(description);
  const summary = {
    totalLikelyCriteria: 0,
    totalPossibleCriteria: 0,
    pillars: makeEmptyPillarSummary(),
  };

  const criteria = criteriaData.pillars
    .flatMap((pillar) => {
      const pillarId = getPillarId(pillar.id);
      const pillarLabel = PILLAR_LABELS[pillarId];

      return (pillar.criteria as CriterionData[])
        .filter((criterion) => {
          const appliesTo = criterion.appliesTo ?? [];
          return (criterion.level ?? "project") === "project" || appliesTo.includes("project");
        })
        .map((criterion): ImpactSnapshotCriterion & { score: number } => {
          const match = matchCriterion(description, normalizedDescription, pillarId, criterion);

          if (match.status === "likely") {
            summary.totalLikelyCriteria += 1;
            summary.pillars[pillarId].likely += 1;
          }

          if (match.status === "possible") {
            summary.totalPossibleCriteria += 1;
            summary.pillars[pillarId].possible += 1;
          }

          return {
            id: getCriterionId(criterion),
            label: criterion.label,
            pillarId,
            pillarLabel,
            status: match.status,
            confidence: match.confidence,
            rationale: match.rationale,
            evidence: match.evidence,
            knowledgeBaseUrl: getKnowledgeBaseUrl(criterion),
            score: match.score,
          };
        });
    })
    .sort((a, b) => STATUS_WEIGHT[b.status] - STATUS_WEIGHT[a.status] || b.confidence - a.confidence);

  return {
    schema: "sd-standard-impact-snapshot-v1",
    generatedAt: new Date().toISOString(),
    assessmentType: "ai-assisted-self-assessment",
    project: {
      description,
      inferredTitle: inferTitle(description),
      inferredProjectType: inferProjectType(description, criteriaData),
      inferredFormat: inferFormat(description),
    },
    summary,
    criteria: criteria.map(({ score, ...criterion }) => criterion),
    missingInformation: buildMissingInformation(summary),
    disclaimer: DISCLAIMER,
  };
}

export function getCriteriaByStatus(snapshot: ImpactSnapshot, status: ImpactSnapshotStatus) {
  return snapshot.criteria.filter((criterion) => criterion.status === status);
}

export function buildSnapshotEmbedPayload(snapshot: ImpactSnapshot): SnapshotEmbedPayload {
  return {
    schema: "sd-standard-impact-snapshot-embed-v1",
    generatedAt: snapshot.generatedAt,
    projectTitle: snapshot.project.inferredTitle,
    summary: snapshot.summary,
    likelyCriteria: snapshot.criteria
      .filter((criterion) => criterion.status === "likely")
      .slice(0, 8)
      .map(({ id, label, pillarId, pillarLabel }) => ({ id, label, pillarId, pillarLabel })),
  };
}

export function encodeSnapshotPayload(payload: SnapshotEmbedPayload) {
  const json = JSON.stringify(payload);
  return btoa(encodeURIComponent(json));
}

export function decodeSnapshotPayload(value: string | null): SnapshotEmbedPayload | null {
  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(atob(value))) as SnapshotEmbedPayload;
  } catch {
    return null;
  }
}
