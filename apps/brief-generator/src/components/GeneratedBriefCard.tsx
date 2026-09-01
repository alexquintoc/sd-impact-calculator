import { pillarDefinitions } from '../data/brief-generator-data'
import { copy, spanishPillars, type Language } from '../lib/localization'
import type { GeneratedBrief } from '../lib/generateBrief'

type GeneratedBriefCardProps = {
  language: Language
  brief: GeneratedBrief
}

export function GeneratedBriefCard({ brief, language }: GeneratedBriefCardProps) {
  const text = copy[language]
  const pillars = language === 'es' ? spanishPillars : pillarDefinitions
  return (
    <section className="brief-card" aria-live="polite">
      <div>
        <p className="eyebrow">{text.archetype}</p>
        <h2>{brief.archetype}</h2>
      </div>

      <div>
        <p className="eyebrow">{text.briefTitle}</p>
        <h3>{brief.title}</h3>
      </div>

      <p>{text.projectType}: {brief.projectType}</p>
      <p className="brief-statement">{brief.briefStatement}</p>

      <div className="brief-meta">
        <div style={{ borderLeftColor: pillarDefinitions[brief.dominantPillar].color }}>
          <p className="eyebrow">{text.dominant}</p>
          <strong>{pillars[brief.dominantPillar].label}</strong>
        </div>
        <div style={{ borderLeftColor: pillarDefinitions[brief.supportingPillar].color }}>
          <p className="eyebrow">{text.supporting}</p>
          <strong>{pillars[brief.supportingPillar].label}</strong>
        </div>
      </div>

      <div>
        <p className="eyebrow">{text.criteria}</p>
        <ul className="criteria-list">
          {brief.relatedCriteria.map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow">{text.tags}</p>
        <ul className="tag-list">
          {brief.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      {brief.tensionWarning ? (
        <div className="tension-warning">
          <p className="eyebrow">{text.warning}</p>
          <p>{brief.tensionWarning}</p>
        </div>
      ) : null}
    </section>
  )
}
