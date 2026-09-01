import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'
import { briefSeeds, formatCriterionReference, pillarDefinitions, pillarOrder, validateBriefCriterionReferences } from '../src/data/brief-generator-data'
import { spanishBriefs } from '../src/data/briefs.es'
import { defaultValues, getEntryOptions } from '../src/lib/entryOptions'
import { generateBrief } from '../src/lib/generateBrief'
import { copy, spanishPillars } from '../src/lib/localization'

test('URL parameters are independent, validated, and preserve defaults', () => {
  for (const search of ['', '?pillar=invalid&lang=fr', '?pillar=ENVIRONMENT&lang=', '?pillar=__proto__']) {
    assert.deepEqual(getEntryOptions(search), { values: defaultValues, language: 'en' })
  }
  assert.equal(getEntryOptions('?lang=es&pillar=invalid').language, 'es')
  assert.deepEqual(getEntryOptions('?lang=es').values, defaultValues)
  for (const pillar of pillarOrder) {
    for (const lang of ['en', 'es', 'invalid']) {
      const options = getEntryOptions(`?pillar=${pillar}&lang=${lang}`)
      assert.equal(options.language, lang === 'es' ? 'es' : 'en')
      for (const key of pillarOrder) assert.equal(options.values[key], key === pillar ? 90 : 50)
    }
  }
})

test('each QR entry selects varied Spanish content with the correct primary pillar and no immediate repeats', () => {
  for (const pillar of pillarOrder) {
    const { values, language } = getEntryOptions(`?pillar=${pillar}&lang=es`)
    let previous: string | undefined
    const seen = new Set<string>()
    for (let i = 0; i < 100; i++) {
      const brief = generateBrief(values, i / 100, language, previous)
      assert.equal(brief.dominantPillar, pillar)
      assert.equal(briefSeeds.find((seed) => seed.title === brief.seedTitle)?.primaryPillar, pillar)
      assert.notEqual(brief.seedTitle, previous)
      assert.equal(brief.title, spanishBriefs[brief.seedTitle].title)
      assert.equal(brief.archetype, spanishPillars[pillar].archetype)
      assert.ok(brief.relatedCriteria.length > 4)
      assert.equal(brief.tensionWarning, null)
      seen.add(brief.seedTitle)
      previous = brief.seedTitle
    }
    assert.ok(seen.size > 1)
  }
})

test('edited priorities drive later briefs without returning to the URL pillar', () => {
  const options = getEntryOptions('?pillar=environment&lang=es')
  const first = generateBrief(options.values, 0, options.language)
  const edited = { ...options.values, environment: 20, culture: 100 }
  const next = generateBrief(edited, 0.5, options.language, first.seedTitle)
  const again = generateBrief(edited, 0.5, options.language, next.seedTitle)
  assert.equal(next.dominantPillar, 'culture')
  assert.equal(again.dominantPillar, 'culture')
  assert.equal(again.archetype, spanishPillars.culture.archetype)
  assert.notEqual(next.seedTitle, again.seedTitle)
  assert.equal(edited.environment, 20)
})

test('the entire catalog is translated and every criterion resolves in both languages', () => {
  assert.deepEqual(Object.keys(spanishBriefs).sort(), briefSeeds.map((seed) => seed.title).sort())
  assert.deepEqual(validateBriefCriterionReferences(briefSeeds, pillarDefinitions), [])
  for (const seed of briefSeeds) {
    const translated = spanishBriefs[seed.title]
    for (const field of ['title', 'projectType', 'brief'] as const) {
      assert.ok(translated[field]?.trim(), `${seed.title}: ${field}`)
      assert.notEqual(translated[field], seed[field])
    }
    assert.equal(translated.tags.length, seed.tags.length)
    translated.tags.forEach((tag, i) => {
      assert.ok(tag.trim())
      // These words have the same spelling in English and Spanish.
      if (!['festival'].includes(tag)) assert.notEqual(tag, seed.tags[i])
    })
  }
  const ids = new Set([
    ...briefSeeds.flatMap((seed) => seed.criteria),
    ...Object.values(pillarDefinitions).flatMap((pillar) => pillar.criteria),
  ])
  for (const id of ids) {
    const en = formatCriterionReference(id, 'en')
    const es = formatCriterionReference(id, 'es')
    assert.match(es, /^[A-Z]+\d+: .+/)
    assert.ok(!es.includes('undefined'))
    assert.notEqual(es, en)
    assert.equal(es.split(':')[0], en.split(':')[0], 'display IDs must not change')
  }
  // Legacy E13 resolves to Zero Waste (display E14), not Biological Materials.
  assert.equal(formatCriterionReference('E13', 'es'), 'E14: Cero residuos')
})

test('all warning branches and special archetypes have Spanish copy', () => {
  const cases = [
    { values: { environment: 90, society: 90, culture: 90, finance: 90 }, warning: copy.es.warnings.systemic },
    { values: { environment: 90, society: 50, culture: 50, finance: 10 }, warning: copy.es.warnings.feasibility },
    { values: { environment: 50, society: 10, culture: 50, finance: 90 }, warning: copy.es.warnings.access },
    { values: { environment: 50, society: 30, culture: 90, finance: 50 }, warning: copy.es.warnings.participation },
    { values: { environment: 10, society: 50, culture: 50, finance: 90 }, warning: copy.es.warnings.environment },
  ]
  for (const { values, warning } of cases) assert.equal(generateBrief(values, 0, 'es').tensionWarning, warning)
  assert.equal(generateBrief(cases[0].values, 0, 'es').archetype, copy.es.regenerative)
  assert.equal(generateBrief({ environment: 0, society: 0, culture: 0, finance: 0 }, 0, 'es').archetype, copy.es.usual)
  assert.equal(generateBrief(defaultValues, 0, 'en').archetype, pillarDefinitions.environment.archetype)
})

test('Netlify QR rules are exact 302s before the SPA fallback; Knowledge Base aliases remain intact', () => {
  const rules = readFileSync(resolve(__dirname, '../../calculator/client/public/_redirects'), 'utf8')
    .split(/\r?\n/).filter((line) => line && !line.startsWith('#')).map((line) => line.split(/\s+/))
  const fallbackIndex = rules.findIndex(([from]) => from === '/*')
  for (const [short, pillar] of Object.entries({ e: 'environment', s: 'society', c: 'culture', f: 'finance' })) {
    for (const slash of ['', '/']) {
      const from = `/b/${short}${slash}`
      const matching = rules.filter(([path]) => path === from)
      assert.deepEqual(matching, [[from, `/brief-generator?pillar=${pillar}&lang=es`, '302']])
      assert.ok(rules.indexOf(matching[0]) < fallbackIndex)
    }
    assert.deepEqual(rules.find(([from]) => from === `/${pillar}`), [
      `/${pillar}`, `/knowledge-base/generated/pillars/${pillar}.html`, '301',
    ])
  }
})
