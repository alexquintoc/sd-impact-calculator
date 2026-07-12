export type ImpactSnapshotStatus = "likely" | "possible" | "not_enough_evidence";

export type ImpactSnapshotPillarId = "environment" | "society" | "culture" | "finance";

export type ImpactSnapshotCriterion = {
  id: string;
  label: string;
  pillarId: ImpactSnapshotPillarId;
  pillarLabel: string;
  status: ImpactSnapshotStatus;
  confidence: number;
  rationale: string;
  evidence: string | null;
  knowledgeBaseUrl: string | null;
};

export type ImpactSnapshotPillarSummary = {
  likely: number;
  possible: number;
};

export type ImpactSnapshot = {
  schema: "sd-standard-impact-snapshot-v1";
  schemaVersion?: 1;
  generatedAt: string;
  exportedAt?: string;
  criteriaVersion?: string;
  assessmentType: "ai-assisted-self-assessment";
  project: {
    description: string;
    inferredTitle: string | null;
    inferredProjectType: string | null;
    inferredFormat: string | null;
  };
  summary: {
    totalLikelyCriteria: number;
    totalPossibleCriteria: number;
    pillars: Record<ImpactSnapshotPillarId, ImpactSnapshotPillarSummary>;
  };
  criteria: ImpactSnapshotCriterion[];
  missingInformation: string[];
  disclaimer: string;
};

export type SnapshotEmbedPayload = {
  schema: "sd-standard-impact-snapshot-embed-v1";
  generatedAt: string;
  projectTitle: string | null;
  summary: ImpactSnapshot["summary"];
  likelyCriteria: Array<Pick<ImpactSnapshotCriterion, "id" | "label" | "pillarId" | "pillarLabel">>;
};
