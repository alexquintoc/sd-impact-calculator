import { useMemo, useState } from 'react'
import { GeneratedBriefCard } from './components/GeneratedBriefCard'
import { PillarSlider } from './components/PillarSlider'
import { pillarDefinitions, pillarOrder } from './data/brief-generator-data'
import { generateBrief, type BriefGeneratorValues } from './lib/generateBrief'
import './App.css'

const initialValues: BriefGeneratorValues = {
  environment: 62,
  society: 55,
  culture: 48,
  finance: 52,
}

const resources = [
  {
    title: 'Knowledge Base',
    description: 'Explore the SD Standard criteria, terms, and guidance notes.',
    href: '/knowledge-base/',
    linkText: 'Open Knowledge Base',
  },
  {
    title: 'Impact Calculator',
    description: 'Evaluate a design project against the SD Standard criteria.',
    href: '/calculator/',
    linkText: 'Open Impact Calculator',
  },
  {
    title: 'Design Brief Generator',
    description:
      'Generate ambitious design brief concepts by balancing environment, society, culture, and finance.',
    href: '/brief-generator/',
    linkText: 'Open Brief Generator',
  },
]

function IndexPage() {
  return (
    <main className="app-shell index-page">
      <section className="intro index-hero">
        <p className="eyebrow">Sustainable Design Standard</p>
        <h1>SD Standard</h1>
        <p>
          Tools and resources for applying sustainable design criteria to
          communication design projects.
        </p>
      </section>

      <section className="resource-grid" aria-label="SD Standard resources">
        {resources.map((resource) => (
          <a className="resource-card" href={resource.href} key={resource.title}>
            <span>
              <span className="resource-card__accent" />
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
            </span>
            <strong>{resource.linkText} -&gt;</strong>
          </a>
        ))}
      </section>
    </main>
  )
}

function BriefGeneratorApp() {
  const [values, setValues] = useState<BriefGeneratorValues>(initialValues)
  const [briefVariant, setBriefVariant] = useState(0)

  const brief = useMemo(
    () => generateBrief(values, briefVariant),
    [values, briefVariant],
  )

  const updateValue =
    (pillar: keyof BriefGeneratorValues) => (nextValue: number) => {
      setValues((currentValues) => ({
        ...currentValues,
        [pillar]: nextValue,
      }))
      setBriefVariant(0)
    }

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Experimental prototype</p>
        <h1>SD Brief Generator</h1>
        <p>
          Shape an early design brief by balancing environmental, social,
          cultural, and financial priorities. The brief updates live as the
          sliders move.
        </p>
      </section>

      <section className="generator-layout">
        <div className="controls-panel">
          <div className="controls-heading">
            <h2>Impact priorities</h2>
            <p>Adjust each pillar from 0 to 100.</p>
          </div>

          <div className="slider-stack">
            {pillarOrder.map((pillar) => (
              <PillarSlider
                key={pillar}
                color={pillarDefinitions[pillar].color}
                label={pillarDefinitions[pillar].label}
                value={values[pillar]}
                onChange={updateValue(pillar)}
              />
            ))}
          </div>

          <div className="value-grid" aria-label="Current slider values">
            {pillarOrder.map((pillar) => (
              <div key={pillar}>
                <span>{pillarDefinitions[pillar].label}</span>
                <strong>{values[pillar]}</strong>
              </div>
            ))}
          </div>

          <button
            className="generate-button"
            type="button"
            onClick={() => setBriefVariant((currentVariant) => currentVariant + 1)}
          >
            Generate another brief
          </button>
        </div>

        <GeneratedBriefCard brief={brief} />
      </section>
    </main>
  )
}

function App() {
  const pathname = window.location.pathname

  if (pathname.startsWith('/brief-generator')) {
    return <BriefGeneratorApp />
  }

  return <IndexPage />
}

export default App
