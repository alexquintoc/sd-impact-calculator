import {
  briefSeeds,
  formatCriterionReference,
  pillarDefinitions,
  pillarOrder,
  validateBriefCriterionReferences,
  type BriefSeed,
  type PillarKey,
} from '../data/brief-generator-data'

export type BriefGeneratorValues = Record<PillarKey, number>

export type GeneratedBrief = {
  title: string
  dominantPillar: PillarKey
  supportingPillar: PillarKey
  archetype: string
  projectType: string
  briefStatement: string
  relatedCriteria: string[]
  tensionWarning: string | null
  tags: string[]
}

const clampScore = (value: number) => Math.min(100, Math.max(0, value))

const findRankedPillars = (values: BriefGeneratorValues) =>
  [...pillarOrder].sort((first, second) => {
    const difference = values[second] - values[first]
    return difference === 0
      ? pillarOrder.indexOf(first) - pillarOrder.indexOf(second)
      : difference
  })

const getArchetype = (
  values: BriefGeneratorValues,
  dominantPillar: PillarKey,
) => {
  const scores = Object.values(values)

  if (scores.every((score) => score > 75)) {
    return 'Regenerative Systems Brief'
  }

  if (scores.every((score) => score < 25)) {
    return 'Business-as-Usual Brief'
  }

  return pillarDefinitions[dominantPillar].archetype
}

const getTensionWarning = (values: BriefGeneratorValues) => {
  if (Object.values(values).every((score) => score > 75)) {
    return 'Ambitious systemic brief. May require longer timelines, partnerships, and higher budget.'
  }

  if (values.environment > 75 && values.finance < 25) {
    return 'Strong environmental ambition, but financial feasibility may be weak.'
  }

  if (values.finance > 75 && values.society < 25) {
    return 'Strong market focus, but accessibility and social benefit may be underdeveloped.'
  }

  if (values.culture > 75 && values.society < 40) {
    return 'Cultural representation is strong, but community participation may need more attention.'
  }

  if (values.environment < 25 && values.finance > 75) {
    return 'Commercially viable, but environmental impact may be ignored.'
  }

  return null
}

const unique = (values: string[]) => Array.from(new Set(values))

const missingCriteria = validateBriefCriterionReferences(
  briefSeeds,
  pillarDefinitions,
)

if (missingCriteria.length > 0) {
  console.warn(
    `Brief Generator has unresolved SD criteria references: ${missingCriteria.join(', ')}`,
  )
}

const scoreSeed = (
  seed: BriefSeed,
  values: BriefGeneratorValues,
  dominantPillar: PillarKey,
  supportingPillar: PillarKey,
) => {
  let score = values[seed.primaryPillar] * 1.2

  if (seed.primaryPillar === dominantPillar) {
    score += 100
  }

  if (seed.secondaryPillars.includes(supportingPillar)) {
    score += 55
  }

  if (seed.secondaryPillars.includes(dominantPillar)) {
    score += 20
  }

  seed.secondaryPillars.forEach((pillar) => {
    score += values[pillar] * 0.45
  })

  return score
}

const hashSelection = (values: BriefGeneratorValues, variant: number) => {
  const signature = pillarOrder
    .map((pillar, index) => values[pillar] * (index + 3))
    .reduce((total, value) => total + value, variant * 97)

  return Math.abs(Math.sin(signature) * 10000)
}

const selectBriefSeed = (
  values: BriefGeneratorValues,
  dominantPillar: PillarKey,
  supportingPillar: PillarKey,
  variant: number,
) => {
  const rankedSeeds = briefSeeds
    .map((seed) => ({
      seed,
      score: scoreSeed(seed, values, dominantPillar, supportingPillar),
    }))
    .sort((first, second) => second.score - first.score)

  const topSeeds = rankedSeeds.slice(0, 8).map(({ seed }) => seed)
  const index = Math.floor(hashSelection(values, variant) % topSeeds.length)

  return topSeeds[index]
}

export const generateBrief = (
  rawValues: BriefGeneratorValues,
  variant = 0,
): GeneratedBrief => {
  const values = pillarOrder.reduce((nextValues, pillar) => {
    nextValues[pillar] = clampScore(rawValues[pillar])
    return nextValues
  }, {} as BriefGeneratorValues)

  const [dominantPillar, supportingPillar] = findRankedPillars(values)
  const seed = selectBriefSeed(
    values,
    dominantPillar,
    supportingPillar,
    variant,
  )

  return {
    title: seed.title,
    dominantPillar,
    supportingPillar,
    archetype: getArchetype(values, dominantPillar),
    projectType: seed.projectType,
    briefStatement: seed.brief,
    relatedCriteria: unique([
      ...seed.criteria,
      ...pillarDefinitions[dominantPillar].criteria,
      ...pillarDefinitions[supportingPillar].criteria,
    ]).map(formatCriterionReference),
    tensionWarning: getTensionWarning(values),
    tags: seed.tags,
  }
}
