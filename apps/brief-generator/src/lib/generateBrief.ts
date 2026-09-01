import {
  briefSeeds,
  formatCriterionReference,
  pillarDefinitions,
  pillarOrder,
  validateBriefCriterionReferences,
  type BriefSeed,
  type PillarKey,
} from '../data/brief-generator-data'
import { spanishBriefs } from '../data/briefs.es'
import { copy, spanishPillars, type Language } from './localization'

export type BriefGeneratorValues = Record<PillarKey, number>

export type GeneratedBrief = {
  seedTitle: string
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
  language: Language,
) => {
  const scores = Object.values(values)

  if (scores.every((score) => score > 75)) {
    return copy[language].regenerative
  }

  if (scores.every((score) => score < 25)) {
    return copy[language].usual
  }

  return (language === 'es' ? spanishPillars : pillarDefinitions)[dominantPillar].archetype
}

const getTensionWarning = (values: BriefGeneratorValues, language: Language) => {
  if (Object.values(values).every((score) => score > 75)) {
    return copy[language].warnings.systemic
  }

  if (values.environment > 75 && values.finance < 25) {
    return copy[language].warnings.feasibility
  }

  if (values.finance > 75 && values.society < 25) {
    return copy[language].warnings.access
  }

  if (values.culture > 75 && values.society < 40) {
    return copy[language].warnings.participation
  }

  if (values.environment < 25 && values.finance > 75) {
    return copy[language].warnings.environment
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

const selectBriefSeed = (
  values: BriefGeneratorValues,
  dominantPillar: PillarKey,
  supportingPillar: PillarKey,
  random: number,
  previousSeedTitle?: string,
) => {
  const rankedSeeds = briefSeeds
    .filter((seed) => seed.primaryPillar === dominantPillar)
    .map((seed) => ({
      seed,
      score: scoreSeed(seed, values, dominantPillar, supportingPillar),
    }))
    .sort((first, second) => second.score - first.score)

  const topSeeds = rankedSeeds.slice(0, 8).map(({ seed }) => seed)
  const alternatives = topSeeds.filter((seed) => seed.title !== previousSeedTitle)
  const candidates = alternatives.length ? alternatives : topSeeds
  const index = Math.min(candidates.length - 1, Math.floor(Math.max(0, random) * candidates.length))

  return candidates[index]
}

export const generateBrief = (
  rawValues: BriefGeneratorValues,
  random = Math.random(),
  language: Language = 'en',
  previousSeedTitle?: string,
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
    random,
    previousSeedTitle,
  )
  const content = language === 'es' ? spanishBriefs[seed.title] : seed

  return {
    seedTitle: seed.title,
    title: content.title,
    dominantPillar,
    supportingPillar,
    archetype: getArchetype(values, dominantPillar, language),
    projectType: content.projectType,
    briefStatement: content.brief,
    relatedCriteria: unique([
      ...seed.criteria,
      ...pillarDefinitions[dominantPillar].criteria,
      ...pillarDefinitions[supportingPillar].criteria,
    ].map((id) => formatCriterionReference(id, language))),
    tensionWarning: getTensionWarning(values, language),
    tags: content.tags,
  }
}
