import { pillarOrder, type PillarKey } from '../data/brief-generator-data'
import type { BriefGeneratorValues } from './generateBrief'
import type { Language } from './localization'

export const defaultValues: BriefGeneratorValues = {
  environment: 62, society: 55, culture: 48, finance: 52,
}

export function getEntryOptions(search: string): { values: BriefGeneratorValues; language: Language } {
  const params = new URLSearchParams(search)
  const pillar = params.get('pillar')
  const language = params.get('lang') === 'es' ? 'es' : 'en'
  // 90 makes the selected pillar dominant; 50 keeps every other pillar meaningful.
  const values = pillarOrder.includes(pillar as PillarKey)
    ? { environment: 50, society: 50, culture: 50, finance: 50, [pillar!]: 90 }
    : { ...defaultValues }
  return { values, language }
}
