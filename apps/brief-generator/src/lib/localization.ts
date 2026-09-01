import type { PillarKey } from '../data/brief-generator-data'

export type Language = 'en' | 'es'

export const copy = {
  en: {
    title: 'SD Brief Generator', prototype: 'Experimental prototype',
    introduction: 'Shape an early design brief by balancing environmental, social, cultural, and financial priorities. The brief updates as the sliders move.',
    priorities: 'Impact priorities', instructions: 'Adjust each SD Standard pillar from 0 to 100.',
    currentValues: 'Current slider values', generate: 'Generate another brief',
    archetype: 'Generated archetype', briefTitle: 'Brief title', projectType: 'Project type',
    dominant: 'Dominant pillar', supporting: 'Supporting pillar', criteria: 'Related SD criteria',
    tags: 'Tags', warning: 'Tension warning',
    regenerative: 'Regenerative Systems Brief', usual: 'Business-as-Usual Brief',
    warnings: {
      systemic: 'Ambitious systemic brief. May require longer timelines, partnerships, and higher budget.',
      feasibility: 'Strong environmental ambition, but financial feasibility may be weak.',
      access: 'Strong market focus, but accessibility and social benefit may be underdeveloped.',
      participation: 'Cultural representation is strong, but community participation may need more attention.',
      environment: 'Commercially viable, but environmental impact may be ignored.',
    },
  },
  es: {
    title: 'Generador de briefs SD', prototype: 'Prototipo experimental',
    introduction: 'Dale forma a una propuesta inicial de diseño equilibrando las prioridades ambientales, sociales, culturales y económicas. El brief se actualiza al mover los controles.',
    priorities: 'Prioridades de impacto', instructions: 'Ajusta cada pilar de SD Standard de 0 a 100.',
    currentValues: 'Valores actuales de los controles', generate: 'Generar otro brief',
    archetype: 'Enfoque del brief', briefTitle: 'Título del brief', projectType: 'Tipo de proyecto',
    dominant: 'Pilar principal', supporting: 'Pilar de apoyo', criteria: 'Criterios SD relacionados',
    tags: 'Etiquetas', warning: 'Posibles tensiones',
    regenerative: 'Brief de sistemas regenerativos', usual: 'Brief de prácticas convencionales',
    warnings: {
      systemic: 'Este brief propone una transformación amplia del sistema. Puede requerir más tiempo, alianzas y un mayor presupuesto.',
      feasibility: 'La ambición ambiental es alta, pero la viabilidad económica podría ser limitada.',
      access: 'El enfoque comercial es fuerte, pero la accesibilidad y el beneficio social podrían necesitar más desarrollo.',
      participation: 'La representación cultural es fuerte, pero la participación comunitaria podría necesitar más atención.',
      environment: 'El proyecto es comercialmente viable, pero podría dejar de lado su impacto ambiental.',
    },
  },
}

export const spanishPillars: Record<PillarKey, { label: string; archetype: string }> = {
  environment: { label: 'Medioambiente', archetype: 'Brief de optimización ambiental' },
  society: { label: 'Sociedad', archetype: 'Brief centrado en la equidad' },
  culture: { label: 'Cultura', archetype: 'Brief guiado por la cultura' },
  finance: { label: 'Economía', archetype: 'Brief orientado a la viabilidad económica' },
}

// Canonical IDs, not display IDs: the standard resolves legacy references first.
export const spanishCriteria: Record<string, string> = {
  E1: 'Reducción del impacto ambiental', E5: 'Papel', E13: 'Cero residuos',
  E14: 'Reciclabilidad o reutilización',
  S1: 'Ausencia de daño', S8: 'Principios de diseño universal',
  S11: 'Precio accesible', S16: 'Componente educativo',
  C2: 'Lenguas en peligro de desaparición', C4: 'Cultura local',
  C5: 'Diversidad cultural', C6: 'Vinculación con el público',
  F1: 'Beneficios económicos', F2: 'Rentabilidad', FM3: 'Trabajo no remunerado',
  F4: 'Objetivos específicos, medibles, alcanzables, relevantes y con plazo definido',
}
