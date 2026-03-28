import { useMemo } from "react";
import {
  calculatorVersions,
  type CalculatorVersionId,
} from "@/calculator/registry";

export function useCalculatorCriteria(version: CalculatorVersionId) {
  const data = useMemo(() => {
    return calculatorVersions[version].criteria;
  }, [version]);

  return {
    data,
    isLoading: false,
    error: null,
  };
}