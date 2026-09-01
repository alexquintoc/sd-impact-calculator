import { useEffect, useState } from 'react'
import { pillarDefinitions, type PillarKey } from '../data/brief-generator-data'
import { generateBrief } from './generateBrief'
import { getEntryOptions } from './entryOptions'
import { copy, spanishPillars } from './localization'

export function useBriefGenerator() {
  // Initialize URL priorities and the random brief together, before the first render.
  const [state, setState] = useState(() => {
    const options = getEntryOptions(window.location.search)
    return { ...options, brief: generateBrief(options.values, Math.random(), options.language) }
  })
  const { values, language, brief } = state
  const text = copy[language]
  const pillars = language === 'es' ? spanishPillars : pillarDefinitions

  useEffect(() => {
    const previousTitle = document.title
    const previousLanguage = document.documentElement.lang
    document.title = text.title
    document.documentElement.lang = language === 'es' ? 'es-MX' : 'en'
    return () => {
      document.title = previousTitle
      document.documentElement.lang = previousLanguage
    }
  }, [language, text.title])

  const updateValue = (pillar: PillarKey) => (nextValue: number) => {
    const random = Math.random()
    setState((current) => {
      const nextValues = { ...current.values, [pillar]: nextValue }
      return { ...current, values: nextValues, brief: generateBrief(nextValues, random, current.language) }
    })
  }
  const generateAnother = () => {
    const random = Math.random()
    setState((current) => ({
      ...current,
      brief: generateBrief(current.values, random, current.language, current.brief.seedTitle),
    }))
  }

  return { values, language, brief, text, pillars, updateValue, generateAnother }
}
