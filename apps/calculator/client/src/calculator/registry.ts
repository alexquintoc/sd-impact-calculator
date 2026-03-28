import v1Criteria from "@/calculator/versions/v1/criteria.v1.json";
import v2Criteria from "@/calculator/versions/v2/criteria.v2.json";

export type CalculatorVersionId = "v1" | "v2";

export type ProjectCategory = {
  id: string;
  label: string;
  description?: string;
};

export type ProjectType = {
  id: string;
  label: string;
  category: string;
  description?: string;
};

export type CalculatorCriteriaData = {
  version?: string;
  projectCategories?: ProjectCategory[];
  projectTypes?: ProjectType[];
  pillars: Array<{
    id: string;
    label: string;
    criteria: Array<Record<string, any>>;
  }>;
};

export const calculatorVersions: Record<
  CalculatorVersionId,
  {
    id: CalculatorVersionId;
    label: string;
    criteria: CalculatorCriteriaData;
    features: {
      projectTypes: boolean;
    };
  }
> = {
  v1: {
    id: "v1",
    label: "SD Standard v1",
    criteria: v1Criteria as CalculatorCriteriaData,
    features: {
      projectTypes: false,
    },
  },
  v2: {
    id: "v2",
    label: "SD Standard v2 (Beta)",
    criteria: v2Criteria as CalculatorCriteriaData,
    features: {
      projectTypes: true,
    },
  },
};