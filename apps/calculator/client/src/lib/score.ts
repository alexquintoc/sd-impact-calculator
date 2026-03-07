export type AnswerStatus = 'Meets' | 'Not yet' | 'N/A' | undefined;
export type Answers = Record<string, AnswerStatus>;

export interface Criterion {
  id: string;
  label: string;
  points: number;
}

export interface Pillar {
  id: string;
  label: string;
  criteria: Criterion[];
}

export interface CriteriaData {
  version: string;
  thresholds: Record<string, number>;
  pillars: Pillar[];
}

/**
 * Computes the score for each pillar based on user answers.
 * - "Meets" adds the criterion's points.
 * - "Not yet" and "N/A" add 0 points.
 */
export function computePillarScores(criteriaData: CriteriaData, answers: Answers): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const pillar of criteriaData.pillars) {
    let score = 0;
    for (const criterion of pillar.criteria) {
      if (answers[criterion.id] === 'Meets') {
        score += criterion.points;
      }
    }
    scores[pillar.id] = score;
  }

  return scores;
}

export interface CertificationResult {
  isCertified: boolean;
  pillarStatus: Record<string, boolean>;
  pillarScores: Record<string, number>;
}

/**
 * Evaluates certification status.
 * Requires ALL pillars to meet or exceed their defined threshold (usually 50).
 */
export function computeCertificationStatus(
  scores: Record<string, number>,
  thresholds: Record<string, number>
): CertificationResult {
  let allPassed = true;
  const pillarStatus: Record<string, boolean> = {};

  for (const [pillarId, score] of Object.entries(scores)) {
    // Default to 50 if threshold is missing in JSON
    const threshold = thresholds[pillarId] ?? 50;
    const passed = score >= threshold;
    
    pillarStatus[pillarId] = passed;
    
    if (!passed) {
      allPassed = false;
    }
  }

  return {
    isCertified: Object.keys(scores).length > 0 ? allPassed : false,
    pillarStatus,
    pillarScores: scores
  };
}
