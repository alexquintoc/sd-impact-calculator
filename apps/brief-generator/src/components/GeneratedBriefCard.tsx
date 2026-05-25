import { pillarDefinitions } from '../data/brief-generator-data'
import type { GeneratedBrief } from '../lib/generateBrief'

type GeneratedBriefCardProps = {
  brief: GeneratedBrief
}

export function GeneratedBriefCard({ brief }: GeneratedBriefCardProps) {
  return (
    <section className="brief-card" aria-live="polite">
      <div>
        <p className="eyebrow">Generated archetype</p>
        <h2>{brief.archetype}</h2>
      </div>

      <div>
        <p className="eyebrow">Brief title</p>
        <h3>{brief.title}</h3>
      </div>

      <p className="brief-statement">{brief.briefStatement}</p>

      <div className="brief-meta">
        <div style={{ borderLeftColor: pillarDefinitions[brief.dominantPillar].color }}>
          <p className="eyebrow">Dominant pillar</p>
          <strong>{pillarDefinitions[brief.dominantPillar].label}</strong>
        </div>
        <div style={{ borderLeftColor: pillarDefinitions[brief.supportingPillar].color }}>
          <p className="eyebrow">Supporting pillar</p>
          <strong>{pillarDefinitions[brief.supportingPillar].label}</strong>
        </div>
      </div>

      <div>
        <p className="eyebrow">Related SD criteria</p>
        <ul className="criteria-list">
          {brief.relatedCriteria.map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow">Tags</p>
        <ul className="tag-list">
          {brief.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      {brief.tensionWarning ? (
        <div className="tension-warning">
          <p className="eyebrow">Tension warning</p>
          <p>{brief.tensionWarning}</p>
        </div>
      ) : null}
    </section>
  )
}
