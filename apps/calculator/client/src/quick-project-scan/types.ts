export type CriteriaScanStatus = "likely-met" | "opportunity" | "not-considered";

export type QuickProjectScanInput = {
  projectName: string;
  projectCategory: string;
  projectType: string;
  projectFormat: string;
  description: string;
};

export type ScannedCriterion = {
  id: string;
  label: string;
  pillarId: string;
  pillarLabel: string;
  status: CriteriaScanStatus;
  matchedKeywords: string[];
};

export type ScannedPillar = {
  id: string;
  label: string;
  criteria: ScannedCriterion[];
};

export type QuickProjectScanResult = {
  projectName: string;
  interpretationNote: string;
  pillars: ScannedPillar[];
  totals: Record<CriteriaScanStatus, number>;
};
